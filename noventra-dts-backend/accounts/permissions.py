# apps/accounts/permissions.py

from rest_framework import permissions
from apps.accounts import access_checker as ac
from apps.projects.models import Project
from apps.tickets.models import Ticket

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return ac.is_super_admin(request.user)

class IsProjectMember(permissions.BasePermission):
    """
    View must have 'project_id' in kwargs OR object with 'project_id'.
    """
    def has_permission(self, request, view):
        pid = view.kwargs.get("project_id") or request.query_params.get("project_id")
        if pid:
            try:
                proj = Project.objects.get(pk=pid)
            except Project.DoesNotExist:
                return False
            return ac.is_user_project_member(request.user, proj) or ac.is_admin(request.user) or ac.is_super_admin(request.user)
        return False

class CanViewTicket(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: Ticket):
        return ac.can_view_ticket(request.user, obj)

class CanManageTicket(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: Ticket):
        return ac.can_manage_ticket(request.user, obj)
