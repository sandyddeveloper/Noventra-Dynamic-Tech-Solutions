# apps/accounts/access_checker.py
from typing import Optional, Iterable
from django.core.cache import cache
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from apps.accounts.models import User
# domain models (adjust imports if your app names differ)
from apps.projects.models import Project, ProjectTeamAccess, ProjectMember
from apps.teams.models import Team
from apps.tickets.models import Ticket

# Cache key helpers
CACHE_PREFIX_PROJECT_MEMBER = "proj_member:"        # proj_member:<project_id>:<user_id> -> bool
CACHE_PREFIX_TEAM_MEMBER = "team_member:"            # team_member:<team_id>:<user_id> -> bool
CACHE_TTL_SHORT = 60 * 5     # 5 minutes by default (tunable)


# ---------- role helpers ----------
def is_super_admin(user: Optional[User]) -> bool:
    return bool(user and getattr(user, "is_authenticated", False) and user.role == "SUPER_ADMIN")


def is_admin(user: Optional[User]) -> bool:
    return bool(user and getattr(user, "is_authenticated", False) and user.role == "ADMIN")


def is_hr(user: Optional[User]) -> bool:
    return bool(user and getattr(user, "is_authenticated", False) and user.role == "HR")


def is_team_lead(user: Optional[User]) -> bool:
    return bool(user and getattr(user, "is_authenticated", False) and user.role == "TEAM_LEAD")


def is_employee(user: Optional[User]) -> bool:
    return bool(user and getattr(user, "is_authenticated", False) and user.role == "EMPLOYEE")


def is_client(user: Optional[User]) -> bool:
    return bool(user and getattr(user, "is_authenticated", False) and user.role == "CLIENT")


# ---------- team helpers ----------
def _team_cache_key(team_id: str, user_id: str) -> str:
    return f"{CACHE_PREFIX_TEAM_MEMBER}{team_id}:{user_id}"


def is_user_in_team(user: User, team: Optional[Team] = None, team_id: Optional[str] = None, cache_client=cache, ttl: int = CACHE_TTL_SHORT) -> bool:
    """
    Returns True if user is a member of the given team.
    Accepts either a Team object or team_id. Uses cache first if available.

    Example:
        is_user_in_team(user, team=team_obj)
        is_user_in_team(user, team_id="uuid")
    """
    if team is None and team_id is None:
        return False

    tid = str(team.id) if team is not None else str(team_id)
    ck = _team_cache_key(tid, str(user.id))
    val = cache_client.get(ck)
    if val is not None:
        return bool(val)

    # cache miss -> query DB
    if team is not None:
        exists = team.members.filter(pk=user.pk).exists()
    else:
        exists = Team.objects.filter(pk=tid, members__pk=user.pk).exists()

    cache_client.set(ck, exists, timeout=ttl)
    return exists


def is_team_lead_of_team(user: User, team: Optional[Team] = None, team_id: Optional[str] = None) -> bool:
    """
    Checks whether the user is the lead of the team. Accepts team object or team_id.
    """
    if team is not None:
        return getattr(team, "lead_id", None) == user.id
    if team_id is not None:
        return Team.objects.filter(pk=team_id, lead_id=user.id).exists()
    return False


# ---------- project scoping ----------
def _proj_member_cache_key(project_id: str, user_id: str) -> str:
    return f"{CACHE_PREFIX_PROJECT_MEMBER}{project_id}:{user_id}"


def is_user_project_member(
    user: User,
    project: Optional[Project] = None,
    project_id: Optional[str] = None,
    *,
    cache_client=cache,
    ttl: int = CACHE_TTL_SHORT,
    prefetch_team_ids: Optional[Iterable[str]] = None,
) -> bool:
    """
    Checks if a user is a member of a project.
    Accepts either a Project object or project_id. Cache-first.

    Optional:
      - prefetch_team_ids: if caller has the list of team ids assigned to project already, pass them to avoid a DB query.

    Typical call patterns:
      project = Project.objects.get(pk=pid)
      is_user_project_member(user, project=project)

      # or if you already have team ids:
      is_user_project_member(user, project_id=pid, prefetch_team_ids=[...])
    """
    if project is None and project_id is None:
        return False

    pid = str(project.id) if project is not None else str(project_id)
    ck = _proj_member_cache_key(pid, str(user.id))
    cached = cache_client.get(ck)
    if cached is not None:
        return bool(cached)

    # 1) direct ProjectMember
    if project is not None:
        direct = ProjectMember.objects.filter(project=project, user=user).exists()
    else:
        direct = ProjectMember.objects.filter(project_id=pid, user=user).exists()

    if direct:
        cache_client.set(ck, True, timeout=ttl)
        return True

    # 2) check team membership via ProjectTeamAccess
    if prefetch_team_ids is not None:
        team_ids = list(prefetch_team_ids)
    else:
        # fetch team ids assigned to project
        if project is not None:
            team_ids = list(ProjectTeamAccess.objects.filter(project=project).values_list("team_id", flat=True))
        else:
            team_ids = list(ProjectTeamAccess.objects.filter(project_id=pid).values_list("team_id", flat=True))

    if not team_ids:
        cache_client.set(ck, False, timeout=ttl)
        return False

    # check if user is in any of those teams
    in_team = Team.objects.filter(pk__in=team_ids, members__pk=user.pk).exists()
    cache_client.set(ck, in_team, timeout=ttl)
    return in_team


def is_user_project_admin(user: User, project: Optional[Project] = None, project_id: Optional[str] = None, cache_client=cache, ttl: int = CACHE_TTL_SHORT) -> bool:
    """
    True if user is Super Admin or Admin or a team lead for a team assigned to the project.
    Accepts project object or id.
    """
    if is_super_admin(user) or is_admin(user):
        return True

    # get team ids
    if project is not None:
        team_ids = list(ProjectTeamAccess.objects.filter(project=project).values_list("team_id", flat=True))
    elif project_id is not None:
        team_ids = list(ProjectTeamAccess.objects.filter(project_id=project_id).values_list("team_id", flat=True))
    else:
        return False

    if not team_ids:
        return False

    # check if any of those teams have lead == user
    return Team.objects.filter(pk__in=team_ids, lead_id=user.id).exists()


# ---------- ticket scoping ----------
def can_view_ticket(user: User, ticket: Optional[Ticket] = None, ticket_id: Optional[str] = None, *, cache_client=cache, ttl: int = CACHE_TTL_SHORT) -> bool:
    """
    Determine if a user can view a ticket.
    Accepts a Ticket object or ticket_id.
    Uses project/team membership helpers and caches intermediate project membership checks.
    """
    if ticket is None and ticket_id is None:
        return False

    # ensure we have a ticket object when needed
    if ticket is None:
        ticket = Ticket.objects.select_related("project").filter(pk=ticket_id).first()
        if ticket is None:
            return False

    # 1) client owner
    if getattr(ticket, "client", None) and getattr(ticket.client, "user_id", None) == user.id:
        return True

    # 2) super/admin
    if is_super_admin(user) or is_admin(user):
        return True

    # 3) assigned owner
    if getattr(ticket, "assigned_to_id", None) == user.id:
        return True

    # 4) assigned team members
    assigned_team_id = getattr(ticket, "assigned_team_id", None)
    if assigned_team_id and is_user_in_team(user, team_id=assigned_team_id, cache_client=cache_client, ttl=ttl):
        return True

    # 5) if linked to a project check project membership (pass prefetch team ids if available)
    proj = getattr(ticket, "project", None)
    if proj:
        return is_user_project_member(user, project=proj, cache_client=cache_client, ttl=ttl)
    if getattr(ticket, "project_id", None):
        return is_user_project_member(user, project_id=ticket.project_id, cache_client=cache_client, ttl=ttl)

    return False


def can_manage_ticket(user: User, ticket: Optional[Ticket] = None, ticket_id: Optional[str] = None) -> bool:
    """
    Who can change status / assign a ticket:
      - Super Admin / Admin
      - Team Lead for assigned team
      - Assigned owner (for working)
    Accepts Ticket object or ticket_id.
    """
    if is_super_admin(user) or is_admin(user):
        return True

    if ticket is None and ticket_id is not None:
        ticket = Ticket.objects.filter(pk=ticket_id).first()
        if ticket is None:
            return False

    if ticket is None:
        return False

    assigned_team_id = getattr(ticket, "assigned_team_id", None)
    if assigned_team_id:
        # safe: don't do heavy queries — check team lead directly
        return is_team_lead_of_team(user, team_id=assigned_team_id)

    if getattr(ticket, "assigned_to_id", None) == user.id:
        return True

    return False


# ---------- employee management ----------
def can_manage_employee(requester: User, target_user: User) -> bool:
    """
    HR/Admin/Super Admin can manage employees. Users can edit their own profile.
    """
    if is_super_admin(requester) or is_admin(requester) or is_hr(requester):
        return True
    return requester.id == target_user.id


# ---------- generic helpers ----------
def require_project_access(user: User, project_id: str, cache_client=cache, ttl: int = CACHE_TTL_SHORT) -> Project:
    """
    Ensures the user has access to the project; raises PermissionDenied if not.
    Returns the Project object (fetched).
    """
    project = get_object_or_404(Project, pk=project_id)
    if not is_user_project_member(user, project=project, cache_client=cache_client, ttl=ttl) and not is_admin(user) and not is_super_admin(user):
        raise PermissionDenied("No access to project.")
    return project
