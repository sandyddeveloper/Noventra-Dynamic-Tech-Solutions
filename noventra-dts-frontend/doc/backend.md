Here’s a **full upgraded spec** that includes all your new ideas (Project Intelligence, KB, Document Vault, Notifications, Audit) and connects them cleanly with your existing roles, tickets, projects, HR, etc.

I’ll break it into:

1. **Roles & Access Summary (who can do what)**
2. **Backend Features + Key Entities + REST Endpoints**
3. **End-to-End Workflows (how everything connects)**

---

## 1. Roles & Access Summary

**Roles:**

* **Super Admin**

  * Full access to everything.
  * Creates projects, sets global settings, SLA rules, retention policies, etc.
* **Admin**

  * Manages departments, teams, team leads.
  * Can create employees, manage clients.
  * Can approve client tickets and assign them to team leads.
* **HR**

  * Manages employees, attendance, shifts, leave, performance.
* **Team Lead**

  * Manages tasks & tickets in their team.
  * Assigns employees to projects (via invite), assigns tasks & ticket owners.
* **Employee**

  * Works on assigned tasks & tickets.
  * Can only edit own profile (name, avatar, password).
* **Client**

  * Views only their own projects, status, tickets.
  * Can raise tickets and see ticket status.

**Key Access Rules:**

* **Projects**

  * Created only by **Super Admin**.
  * Project is assigned to one or more **teams**.
  * Only those teams (and their leads/employees) plus Super Admin/Admin can see & work on that project.
* **Teams**

  * Created by **Admin**.
  * Admin assigns **Team Lead**.
  * Admin & Team Lead can add employees to team.
* **Project & Task assignment**

  * Team Lead (or Admin, Super Admin) invites employees to project by **email + token**.
  * Team Lead assigns tasks and ticket-fixes to team members.
* **Tickets**

  * Client raises ticket → Admin approves & assigns Team Lead → TL assigns employee → Employee resolves → TL closes → client notified.
* **HR**

  * Full control over employees, attendance, shifts, leave, performance analytics.
* **Knowledge Base / Documents / Intelligence**

  * Read/write depends on role; clients get limited read access for their projects.

---

## 2. Backend Features + Endpoints

### 2.1 Auth & Security

**Entities**

* User, Role, Permission
* Session / Refresh token
* Password reset token
* Email verification / invitation token

**Key Endpoints**

* `POST /auth/login`
* `POST /auth/logout`
* `POST /auth/refresh`
* `POST /auth/password/forgot`
* `POST /auth/password/reset`
* `POST /auth/invite` (for employee & client invites)
* `POST /auth/verify-email`

---

### 2.2 Organization & Users

**Entities**

* Department
* Team
* Employee Profile
* Role assignment

**Endpoints**

* Departments

  * `GET /departments`
  * `POST /departments` (Admin, Super Admin)
  * `PUT /departments/{id}`
  * `DELETE /departments/{id}`
* Teams

  * `GET /teams`
  * `GET /departments/{id}/teams`
  * `POST /teams` (Admin)
  * `PUT /teams/{id}` (Admin)
  * `PATCH /teams/{id}/lead` (Admin)
  * `PATCH /teams/{id}/members` (Admin, Team Lead – add/remove employees)
* Employees

  * `GET /employees` (Admin, HR, Super Admin)
  * `GET /employees/{id}`
  * `POST /employees` (HR, Admin, Super Admin)
  * `PUT /employees/{id}` (HR/Admin, limited self update for Employee: name, avatar)
  * `PATCH /employees/{id}/status`
  * `DELETE /employees/{id}` (Admin/Super Admin)
* Employee Self-Profile

  * `GET /me`
  * `PUT /me/profile` (name, avatar only)
  * `PUT /me/password`

---

### 2.3 Clients & Tickets

**Entities**

* Client
* Client Contact
* Client Project Mapping
* Ticket (support / bug / change request)
* Ticket Comment (with internal/private vs public)
* Ticket Assignment (Team → Employee)
* Ticket SLA & severity

**Client Endpoints**

* `GET /clients`
* `GET /clients/{id}`
* `POST /clients` (Admin/Super Admin)
* `PUT /clients/{id}`
* `DELETE /clients/{id}`

**Ticket Endpoints**

* `GET /clients/{clientId}/tickets`
* `GET /tickets/{id}`
* `POST /clients/{clientId}/tickets` (Client, Admin can also create)

  * Creates ticket in “Pending Approval” by default.
* `PATCH /tickets/{id}/approve` (Admin)

  * Assigns to a Team Lead.
* `PATCH /tickets/{id}/assign-team` (Admin, Super Admin)
* `PATCH /tickets/{id}/assign-owner` (Team Lead → Employee)
* `PATCH /tickets/{id}/update-status` (Lead/Employee: Open, In Progress, Waiting Client, Resolved, Closed)
* `PATCH /tickets/{id}/severity`
* `PATCH /tickets/{id}/sla`
* `POST /tickets/{id}/comments`

  * with fields `{ text, isInternal, attachments[] }`
* `GET /tickets/{id}/history` (for audit trail)
* `POST /tickets/{id}/convert-to-kb` (Lead, Admin, Super Admin)

  * Creates KB article from resolved ticket.

**Ticket Escalation / SLA**

* `POST /tickets/{id}/escalate`
* Background job: checks SLA breaches and triggers notifications.

---

### 2.4 Projects, Tasks & Sprints

**Entities**

* Project
* ProjectTeamAccess (project ↔ team)
* InvitationToken (for employee project access)
* Sprint
* Task (backlog, ticket-linked, etc.)
* TaskAssignment

**Project Endpoints**

* `GET /projects`
* `GET /projects/{id}`
* `POST /projects` (Super Admin only)

  * Fields: name, clientId, description, start/end, budgets, etc.
* `PATCH /projects/{id}/teams` (Super Admin, Admin)

  * Assign teams that can access.
* `PATCH /projects/{id}/status`
* `GET /projects/{id}/members`
* `POST /projects/{id}/invite-member` (Team Lead or Admin)

  * Sends email with token.
* `POST /projects/join` (Employee uses token)

  * Validates token → adds employee to project team.

**Task & Sprint Endpoints**

* `GET /projects/{id}/sprints`
* `POST /projects/{id}/sprints`
* `PUT /sprints/{id}`
* `GET /projects/{id}/tasks`
* `POST /projects/{id}/tasks` (Team Lead)
* `PUT /tasks/{id}`
* `PATCH /tasks/{id}/assign` (Team Lead → employee)
* `PATCH /tasks/{id}/status`
* `GET /tasks/{id}/activity`

---

### 2.5 Attendance, Shifts & Leave

**Entities**

* AttendanceRecord
* Shift
* LeaveRequest
* Holiday

**Attendance**

* `GET /attendance/daily`
* `GET /attendance/employee/{id}`
* `POST /attendance/check-in`
* `POST /attendance/check-out`
* `PUT /attendance/{id}` (HR/Admin)
* `GET /attendance/report` (filters: date range, dept, etc.)

**Shift Planner**

* `GET /shifts` (list definitions)
* `POST /shifts` (HR)
* `PUT /shifts/{id}`
* `DELETE /shifts/{id}`
* `GET /shifts/plan?week=YYYY-WW`
* `POST /shifts/plan` (assign employees to shifts for dates)
* `GET /employees/{id}/shifts`

**Leave Management**

* `GET /leave/policies`
* `POST /leave/policies` (HR)
* `GET /leave/requests`
* `POST /leave/requests` (Employee)
* `PATCH /leave/requests/{id}/approve` (Manager/HR)
* `PATCH /leave/requests/{id}/reject`
* `GET /employees/{id}/leave-balance`

**Holiday Calendar**

* `GET /holidays`
* `POST /holidays` (HR/Admin)
* `PUT /holidays/{id}`
* `DELETE /holidays/{id}`

---

### 2.6 Project Intelligence & Insights

**Entities**

* ProjectHealthSnapshot
* EmployeePerformanceSnapshot
* MetricDefinition (for extensibility)

**Project Health**

* `GET /analytics/projects/health` (list, filters)
* `GET /analytics/projects/{projectId}/health`

  * Returns:

    * riskScore (0–100)
    * backlogSize (open tasks)
    * openTicketsBySeverity
    * velocity (tasks completed / sprint)
    * burnDownData / burnUpData
    * resourceUtilization (per role/employee)
* `POST /analytics/projects/recompute` (cron/job trigger, Super Admin only)

Risk score uses:

* backlog size
* open tickets & severity
* overdue tasks
* recent team performance (efficiency)
* attendance pattern (optional factor)

**Burn-down / Burn-up**

* `GET /analytics/projects/{id}/burndown?sprintId=...`
* `GET /analytics/projects/{id}/burnup?sprintId=...`

**Resource Utilization Matrix**

* `GET /analytics/resources/utilization?from=...&to=...`

  * Returns per employee:

    * plannedHours vs actualHours
    * projects assigned
    * percentage utilization.

**Employee Performance Metrics**

* `GET /analytics/employees/performance`
* `GET /analytics/employees/{id}/performance`

  * `efficiencyScore` = f(tasksDone, ticketSeverityHandled, punctuality, attendance)
  * tasksDone = completed tasks / time
  * ticketSeverityHandled = points based on severity resolved
  * punctuality = check-ins vs scheduled / late count
  * plus optional: code reviews, quality, etc.

HR uses this for:

* appraisal cycles
* performance review dashboards.

---

### 2.7 Knowledge Base (Central KB)

**Entities**

* KnowledgeArticle
* ArticleVersion
* Tag
* ArticleFeedback (likes, helpfulness)

**KB Endpoints**

* `GET /kb/articles`
* `GET /kb/articles/{id}`
* `POST /kb/articles` (Team Lead, Admin, Super Admin)
* `PUT /kb/articles/{id}` (with versioning)
* `PATCH /kb/articles/{id}/publish`
* `DELETE /kb/articles/{id}`

**Convert Ticket → Article**

* `POST /tickets/{id}/convert-to-kb`

  * Pre-fills problem, root cause, resolution, env details, etc.
  * Links article back to ticket.

**Suggestion API**

* `GET /kb/suggestions?ticketId=...`
* `GET /kb/suggestions?q=...&projectId=...`

  * Used when client or team creates/edit a ticket → shows similar solutions.

**Feedback / Quality**

* `POST /kb/articles/{id}/feedback` (helpful / not helpful, comment)
* `GET /kb/articles/{id}/stats`

---

### 2.8 Document Vault per Project

**Entities**

* ProjectDocument
* DocumentVersion
* AccessControlEntry (ACE)
* RetentionPolicy

**Document Endpoints**

* `GET /projects/{id}/documents`
* `GET /projects/{id}/documents/{docId}`
* `POST /projects/{id}/documents` (upload)

  * metadata: title, type, tags, restricted roles
* `PUT /projects/{id}/documents/{docId}` (metadata/update)
* `DELETE /projects/{id}/documents/{docId}`

**Access Control**

* `PATCH /projects/{id}/documents/{docId}/acl`

  * list of `{ role/team/userId, permission: read/write/download }`
* `GET /projects/{id}/documents/{docId}/audit-log`

**Retention & Auto-Expiry**

* `GET /compliance/retention-policies`
* `POST /compliance/retention-policies`
* background worker:

  * marks docs as “Expired”, soft-deletes or archives based on policy.

---

### 2.9 Notification & Communication Hub

**Entities**

* Notification
* NotificationTemplate
* UserNotificationPreference
* TicketChatMessage (for ticket discussion)

**Notification Endpoints**

* `GET /notifications`
* `PATCH /notifications/{id}/read`
* `PATCH /notifications/mark-all-read`

**Templates**

* `GET /notifications/templates`
* `POST /notifications/templates`
* `PUT /notifications/templates/{id}`

  * For events like:

    * ticket created / approved / assigned / escalated / resolved / closed
    * project invitation
    * task assignment
    * leave approval
    * shift change
    * severe risk alerts.

**Preferences**

* `GET /me/notification-preferences`
* `PUT /me/notification-preferences`

  * per channel: email, push, WhatsApp/SMS (for severe events only), in-app.

**Ticket Chat / Discussion**

* `GET /tickets/{id}/chat`
* `POST /tickets/{id}/chat`

  * payload: `{ message, isInternalNote, attachments }`
* WebSocket / SSE channel: `/ws/tickets/{id}` for real-time chat.

Rules:

* Client sees **only** public messages.
* Internal notes visible to Employees/Leads/Admin/HR.

---

### 2.10 Audit & Compliance

**Entities**

* AuditLog
* LoginSessionLog
* LegalHold
* IPDeviceRecord

**Endpoints**

* Audit

  * `GET /audit/logs`
  * `GET /audit/logs?entityType=ticket&entityId=...`
  * Logs for:

    * CRUD on users, projects, tasks, tickets, docs, KB, settings.
    * status changes, assignment changes, role changes.

* Sessions / Access

  * `GET /security/sessions` (for user)
  * `DELETE /security/sessions/{id}` (logout specific device)
  * admin version: view all active sessions (Super Admin only).
  * store IP, device fingerprint, location (approx).

* Device & IP Rules

  * `GET /security/allowed-devices`
  * `POST /security/allowed-devices`
  * `GET /security/allowed-ip-ranges`
  * `POST /security/allowed-ip-ranges`

* Legal Hold & Retention

  * `POST /compliance/legal-hold` (on project or ticket)
  * `GET /compliance/legal-hold`
  * When on hold: disable deletion for related data.

* GDPR

  * `POST /privacy/export-data/{userId}`
  * `POST /privacy/delete-data/{userId}` (soft delete or anonymize)

---

### 2.11 Settings / Admin Config

* `GET /settings`
* `PUT /settings` (Super Admin)

  * global SLA defaults
  * risk calculation weights (backlog vs tickets vs performance)
  * retention policies defaults
  * notification channels enabled
  * project templates, etc.

---



## 3. Key Workflows (Connected Start → End → Start)

### 3.1 Client Ticket Lifecycle (Full Chain)

1. **Client raises ticket**

   * Client → `/clients/{id}/tickets` → status `PendingApproval`.
   * Notification: Admin (and maybe Super Admin).

2. **Admin reviews & approves**

   * Admin opens ticket review UI.
   * If valid: `PATCH /tickets/{id}/approve` + `assign-team`.
   * Notification: Team Lead of chosen team.

3. **Team Lead triage**

   * Sees ticket in “Assigned to my team” list.
   * Checks KB suggestions via `GET /kb/suggestions?ticketId=...`.
   * Assigns to best employee: `PATCH /tickets/{id}/assign-owner`.
   * Notification: that employee.

4. **Employee works & communicates**

   * Updates status (In Progress / Waiting Client / Needs Info).
   * Uses ticket chat:

     * public messages for client.
     * internal notes for internal discussions.
   * Links tasks if needed (implementation tasks in project).

5. **Resolution**

   * Employee marks `status=Resolved`.
   * Team Lead reviews resolution and optionally:

     * Uses `POST /tickets/{id}/convert-to-kb` to create article.
   * TL then sets `status=Closed`.

6. **Client notified**

   * Client receives notification & email template: “Ticket closed”.
   * Sees final message & optionally KB article link.
   * Client can mark satisfaction/feedback.

7. **Insights & Learning**

   * Ticket resolution & severity feed into:

     * Employee performance.
     * Project risk (if linked to a project).
     * KB quality & suggestions.

---

### 3.2 Project Creation & Access Workflow

1. **Super Admin creates project**

   * `/projects` with client, goals, budget etc.
2. **Assign teams**

   * `/projects/{id}/teams` things like “Team A + Team B”.
3. **Team Lead invites members**

   * `/projects/{id}/invite-member` → email token for each employee.
4. **Employee joins**

   * Clicks invite link → `/projects/join` with token.
   * Gets limited access (see project, assigned tasks & tickets).
5. **Client sees only their project(s)** via portal.

Project data then feeds into dashboards, health, risk, docs, etc.

---

### 3.3 Shift & Leave + Attendance Workflow

1. HR defines shifts and holidays.
2. HR uses Shift Planner to assign employees → weekly grid.
3. Employee checks in/out → attendance records with geolocation (WFO vs WFH).
4. Employee applies leave → `/leave/requests`.
5. Manager/HR approves → calendar + shift planner updated.
6. Attendance & punctuality feed into:

   * Employee performance score.
   * Project risk if a key resource is often late or absent.

---

### 3.4 Knowledge Base & Document Workflow

1. Ticket resolved → TL decides it's useful for future.
2. `POST /tickets/{id}/convert-to-kb` → new article in draft.
3. Admin/TL reviews & publishes → KB.
4. Next time a similar ticket or task is created:

   * Frontend calls `GET /kb/suggestions` → shows related articles.
5. For project docs:

   * Upload design docs, SOW, security certs to `Document Vault`.
   * Apply retention policy (e.g. 3 years after project end).
   * Legal hold prevents deletion in case of dispute.

---

### 3.5 Notifications & Audit

* **Every critical action** (status change, assignment, approval, login, IP change, document download) writes an **AuditLog** entry and can trigger notification based on template & user preferences.
* Admin can search audit logs for:

  * “Who changed ticket severity?”
  * “Who downloaded this secure document?”
  * “Who modified project access list?”

---

Nice, we’re going full “backend brain” mode now 😄
I’ll treat this as: **how the backend behaves, step-by-step**, for each big flow, with layers and what happens in DB, events, notifications, audit, etc.


---

## 0. Backend Architecture Overview

### 0.1 Layers

* **Controller layer (`@RestController`)**

  * Exposes endpoints (e.g. `POST /tickets`, `GET /projects`).
  * Validates requests (DTOs, bean validation).
  * Calls service layer.
* **Service layer**

  * Business logic.
  * Enforces rules: roles, transitions, workflows.
  * Emits domain events (e.g. `TicketCreatedEvent`, `ProjectAssignedEvent`).
* **Repository layer**

  * JPA repositories for CRUD on entities.
* **Infra / Cross-cutting**

  * Security (JWT auth, role + permission checks).
  * Notifications (email/SMS/WhatsApp/push).
  * Audit logging.
  * Background jobs (schedulers for analytics, SLA checks, retention).

### 0.2 Cross-cutting Concepts

#### Authentication & Session

* After login, backend issues:

  * **Access token** (JWT) – short-lived.
  * **Refresh token** – stored in DB/Redis.
* `ProtectedRoute` on frontend + backend `SecurityFilter` require valid token.
* For your *20 min inactivity* requirement, backend can:

  * Check last activity timestamp (`lastActiveAt`) in DB/Redis per session.
  * Middleware updates it per request.
  * If difference > 20 min → reject with `401` and invalidate refresh token.

#### Authorization

* Each request has:

  * `User.role` (SUPER_ADMIN, ADMIN, HR, TEAM_LEAD, EMPLOYEE, CLIENT).
  * `teams` list, `projects` list, `clients` list.
* Service methods check:

  * Role-based rules (e.g. only SUPER_ADMIN can `createProject`).
  * Scope (team-based, project-based, client-based).
* Central helper like:

```java
accessChecker.canViewProject(user, project);
accessChecker.canManageTicket(user, ticket);
accessChecker.canManageEmployee(user, employee);
```

#### Audit Logging

* Every important change goes through a helper:

```java
auditService.log(
  actorUserId,
  entityType,          // "TICKET", "PROJECT", "DOCUMENT", "USER"
  entityId,
  action,              // "CREATE", "UPDATE_STATUS", "ASSIGN", "DELETE"
  beforeJson,
  afterJson,
  metadata             // e.g. IP, userAgent
);
```

* `AuditLog` entity writes to DB.

#### Notifications

* Domain events: `TicketCreatedEvent`, `TicketApprovedEvent`, `TaskAssignedEvent`, etc.
* Event listener:

```java
@EventListener
public void handleTicketCreated(TicketCreatedEvent event) {
    notificationService.sendNotificationForEvent(event);
}
```

* `notificationService`:

  * Looks up `NotificationTemplate` and `UserNotificationPreference`.
  * Creates `Notification` rows (in-app).
  * Sends email / WhatsApp / push if enabled.

#### Analytics Jobs

* Scheduled jobs:

```java
@Scheduled(cron = "0 */30 * * * *") // every 30 mins
public void recomputeProjectHealth() { ... }

@Scheduled(cron = "0 0 2 * * *") // nightly
public void recomputeEmployeePerformance() { ... }

@Scheduled(cron = "0 */5 * * * *") // every 5 mins
public void checkTicketSLA() { ... }
```

---

## 1. User / Organization Workflow

### 1.1 Onboarding Employee (by HR/Admin)

1. **Request**

   * `POST /employees` from HR/Admin.
   * Payload: basic info + role + department + teamId (optional).

2. **Backend Steps**

   * Controller validates DTO.
   * Service checks: requester has role `HR` or `ADMIN` or `SUPER_ADMIN`.
   * Creates `Employee` entity with `status=Invited`.
   * Creates `User` entity for auth, but:

     * Either: generates initial password or invitation token.
   * Stores `EmployeeRole` (role: STAFF, MANAGER, ADMIN, etc).
   * Saves `Employee` & `User` via repositories.

3. **Post-actions**

   * Create **AuditLog** (“EMPLOYEE_CREATE”).
   * Emit `EmployeeInvitedEvent`.
   * Listener sends welcome/invite email with a link:

     * `/accept-invite?token=...`.

4. **Invite Acceptance**

   * User hits `POST /auth/accept-invite`.
   * Backend:

     * Validates token.
     * Lets user set password.
     * Sets `Employee.status = Active`.
     * Clears invitation token.
     * Logs audit.

---

## 2. Project Workflow (Secure & Team-based)

### 2.1 Create Project (Super Admin Only)

1. **Request**

   * `POST /projects` by SUPER_ADMIN.

2. **Backend Steps**

   * Auth: check role `SUPER_ADMIN`.
   * Validate `clientId`, dates, budgets.
   * Create `Project` entity: `status=PLANNED` or `ACTIVE`.
   * Save to DB.

3. **Post-actions**

   * Audit: PROJECT_CREATE.
   * Optional event: `ProjectCreatedEvent` (to send notification to Admins or client account manager).

### 2.2 Assign Teams to Project

1. **Request**

   * `PATCH /projects/{id}/teams` with array of `teamIds`.

2. **Backend**

   * Check `SUPER_ADMIN` or `ADMIN`.
   * Load project & teams.
   * Validate teams exist.
   * Create/update `ProjectTeamAccess` rows linking project ↔ team.
   * Save.

3. **Post**

   * Audit: PROJECT_ASSIGN_TEAMS.
   * Event: `ProjectTeamsAssignedEvent` → notifications to Team Leads.

### 2.3 Invite Employees to Project (Team Lead / Admin)

1. **Request**

   * `POST /projects/{id}/invite-member` by Team Lead.
   * Payload: `{ email, roleInProject, message }`.

2. **Backend**

   * Check: user is `TEAM_LEAD` of a team that has access to this project (via `ProjectTeamAccess`) OR Admin/Super Admin.
   * Find employee by email (if exists) OR create a pending account.
   * Generate `InvitationToken` with:

     * `projectId`, `employeeId`, `expiresAt`.
   * Save token.

3. **Post**

   * Send email with link: `/projects/join?token=...`.
   * Audit: PROJECT_MEMBER_INVITE.

4. **Join**

   * `POST /projects/join` with token.
   * Validate token (expiry, used?).
   * Add row in `ProjectMember` table (employee ↔ project).
   * Mark token as used.
   * Audit: PROJECT_MEMBER_JOINED.

---

## 3. Ticket Workflow (Client → Admin → Team Lead → Employee → Client)

### 3.1 Client Raises Ticket

1. **Request**

   * `POST /clients/{clientId}/tickets` by CLIENT.
   * Payload: title, description, projectId (optional), severity, attachments.

2. **Backend Steps**

   * Auth: user must be `CLIENT` with access to `clientId`.
   * Validate that project belongs to that client (if provided).
   * Create `Ticket` entity with:

     * `status = PENDING_APPROVAL`.
     * `createdBy = clientUserId`.
     * Link to `clientId`, `projectId`.
   * Save attachments (File storage + `TicketAttachment` records).

3. **Post**

   * Audit: TICKET_CREATE_CLIENT.
   * Emit `TicketCreatedEvent`.
   * Notification listener:

     * Notify Admin(s) (and possibly Super Admin).

### 3.2 Admin Approves & Assigns Team

1. **Request**

   * `PATCH /tickets/{id}/approve` by `ADMIN` (or `SUPER_ADMIN`).
   * Body: `teamId`, `priority`, optional `sla`.

2. **Backend**

   * Auth: role check.
   * Load ticket.
   * Ensure `status=PENDING_APPROVAL`.
   * Set:

     * `status = OPEN`.
     * `assignedTeamId = teamId`.
     * `priority`, `slaDeadline` computed from SLA rules.
   * Save ticket.

3. **Post**

   * Audit: TICKET_APPROVED.
   * Event: `TicketApprovedEvent`.
   * Notification:

     * Notify `TEAM_LEAD` of that `teamId`.

### 3.3 Team Lead Assigns Employee & Starts Work

1. **Request**

   * `PATCH /tickets/{id}/assign-owner` by `TEAM_LEAD`.
   * Body: `{ employeeId }`.

2. **Backend**

   * Check:

     * Ticket’s `assignedTeamId` is one of TL’s teams.
   * Validate employee is in that team.
   * Set:

     * `ticket.assignedToEmployeeId = employeeId`.
     * If status is `OPEN`, can set to `IN_PROGRESS`.
   * Save.

3. **Post**

   * Audit: TICKET_ASSIGN_OWNER.
   * Event: `TicketAssignedToEmployeeEvent`.
   * Notification:

     * To employee.

### 3.4 Employee Works & Communicates

**Status Updates**

* `PATCH /tickets/{id}/update-status`

  * Allowed statuses based on current state & role:

    * Employee: `IN_PROGRESS`, `WAITING_CLIENT`, `RESOLVED`.
    * TL/Admin: any except `PENDING_APPROVAL`.
* Validate transitions (state machine).
* Save & audit each transition.

**Chat / Discussion**

* `POST /tickets/{id}/chat`

  * Body: `{ message, isInternalNote, attachments }`.
* Backend:

  * Check user access (team, admin, client).
  * Validate `isInternalNote`:

    * Clients can only send `isInternalNote=false`.
  * Save `TicketChatMessage`.
  * Emit `TicketMessageCreatedEvent`.
  * Notify:

    * If client wrote → notify assigned employee/TL.
    * If internal note or staff message → notify client (if `isInternalNote=false`).

### 3.5 Resolution & KB Conversion

1. **Employee marks as Resolved**

   * `PATCH /tickets/{id}/update-status` → `RESOLVED`.
   * Audit + notify TL & client.

2. **Team Lead Finalizes**

   * Verifies fix & communication.
   * Decides to:

     * Convert to KB: `POST /tickets/{id}/convert-to-kb`.

       * Backend:

         * Generates `KnowledgeArticle` with

           * title = ticket title
           * problem/steps/resolution from ticket description & last messages.
         * `status=DRAFT`, link to `ticketId`.
         * Audit: KB_CREATE_FROM_TICKET.
     * Set `status=CLOSED`:

       * `PATCH /tickets/{id}/update-status` → `CLOSED`.

3. **Client Notification**

   * `TicketClosedEvent` triggers:

     * In-app + email notification to client.
     * If enabled and severity high: WhatsApp/SMS “Issue resolved” message.

---

## 4. Tasks & Sprints Workflow

### 4.1 Create Sprint

* `POST /projects/{id}/sprints` by TL/PM/Admin.
* Service:

  * Checks project access.
  * Validates dates.
  * Creates `Sprint`.

### 4.2 Create Task

* `POST /projects/{id}/tasks`

  * Body: title, description, type (feature/bug/ticket-linked), sprintId (optional), storyPoints.

* Backend:

  * Checks TL/Admin/PM rights for project.
  * Creates `Task`.
  * Optionally links to `ticketId`.

### 4.3 Assign Task

* `PATCH /tasks/{id}/assign`

  * Body: `{ assigneeId }`.
* Backend:

  * Check `assigneeId` is a project member (via `ProjectMember`).
  * Update `task.assigneeId`.
  * Audit & notify.

### 4.4 Task Status Changes

* `PATCH /tasks/{id}/status` → `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`.
* Each change:

  * Validates state transition.
  * Writes audit.
  * Feeds into:

    * `EmployeePerformanceSnapshot` job.
    * `ProjectHealth` metrics (backlog & velocity).

---

## 5. Attendance, Shifts & Leave Workflow

### 5.1 Shift Planner

1. HR defines shift:

* `POST /shifts`:

  * name: “Morning Shift”, start/end, grace period, etc.

2. HR assigns weekly plan:

* `POST /shifts/plan`

  * body: list of `{ employeeId, date, shiftId }`.

3. Backend:

* Stores rows in `ShiftAssignment`.
* Validates no conflicts for same employee.

### 5.2 Attendance Check-in/Check-out

* `POST /attendance/check-in`

  * Body: location, device, timestamp (or server time).
* Backend:

  * Locates today’s shift for this employee.
  * Computes lateness, geo-fence (if WFO).
  * Saves `AttendanceRecord` with `checkInTime`.
* `POST /attendance/check-out`

  * Updates same record; computes total hours.

These values will feed `punctuality` metric.

### 5.3 Leave Workflow

* Employee: `POST /leave/requests`.
* Manager/HR/Lead: `PATCH /leave/requests/{id}/approve/reject`.
* Approved leave:

  * Blocks attendance, may adjust shift planner.
  * Affects resource availability on project health.

---

## 6. Knowledge Base Workflow

### 6.1 Article Lifecycle

* **Create**
  `POST /kb/articles` (TL/Admin/SA)

  * status = DRAFT by default.
  * Body: title, content (Markdown/HTML), tags.

* **Edit & Version**

  * `PUT /kb/articles/{id}`

    * Backend:

      * Copy current as `ArticleVersion`.
      * Update article.
      * Increment version number.

* **Publish**

  * `PATCH /kb/articles/{id}/publish`
  * Backend:

    * status = PUBLISHED.
    * Audit.

### 6.2 Suggestions

* Whenever frontend opens:

  * New ticket form or ticket detail:

    * Calls `GET /kb/suggestions?ticketId=...` or `?q=...`.
* Backend:

  * Resolve query:

    * If `ticketId` given: use ticket title + description.
    * Search in `title`, `tags`, `content`.
  * Return top N articles.

### 6.3 Feedback

* `POST /kb/articles/{id}/feedback`

  * Body: `{ helpful: boolean, comment? }`.
* Backend:

  * Store `ArticleFeedback`.
  * Used for analytics (helpful ratio, future ranking).

---

## 7. Document Vault Workflow

### 7.1 Upload Document

* `POST /projects/{id}/documents`

  * Multipart: file + JSON metadata.
* Backend:

  * Validate project access.
  * Store file in S3/local storage.
  * Store `ProjectDocument`:

    * `path`, `title`, `tags`, `contentType`, `size`.
    * `ownerId`, `projectId`.
    * default ACL based on project teams.
  * Audit: DOCUMENT_UPLOAD.

### 7.2 Access & ACL

* `GET /projects/{id}/documents`

  * Filter by tags, type.

* `GET /projects/{id}/documents/{docId}`

  * Backend:

    * Check ACL via `AccessControlEntry`.
  * Return metadata + download URL.

* `PATCH /projects/{id}/documents/{docId}/acl`

  * Body: list of `ACE`s (role/team/user permissions).

* Backend:

  * Replaces ACL entries.
  * Logs audit.

### 7.3 Retention & Legal Hold

* Retention Policy:

  * `RetentionPolicy` table:

    * conditions: e.g. “Project closed + 3 years”.
    * action: ARCHIVE or DELETE.

* Scheduled job:

  * For each document:

    * Evaluate policy.
    * If expired & NOT under legal hold:

      * Perform action.
      * log `DOCUMENT_EXPIRED`.

* Legal Hold:

  * `POST /compliance/legal-hold`

    * e.g. on projectId or ticketId.
  * Backend:

    * Flags related docs and records.
    * All delete attempts are blocked until hold released.

---

## 8. Project Intelligence & Analytics Workflow

### 8.1 Project Health Calculation

Scheduled job or manual trigger:

1. Fetch all active projects.
2. For each project:

   * Metrics:

     * `backlogTasksCount` (open tasks).
     * `openTicketsSeverityCounts` (Critical/High/Medium/Low).
     * `avgTaskCompletionTime`.
     * `teamAvailability` (shifts, leave, attendance).
     * `velocity` (tasks done per sprint).
3. Apply weighted formula:

```pseudo
riskScore = 
    w1 * normalizedBacklog +
    w2 * normalizedOpenTicketsSeverity +
    w3 * (1 - normalizedVelocity) +
    w4 * (1 - avgTeamPunctuality);
```

4. Save `ProjectHealthSnapshot` with:

   * riskScore, metrics JSON, timestamp.

### 8.2 Employee Performance Calculation

Nightly job:

1. Loop through all active employees.
2. Compute:

   * `tasksDone` in last N days (weighted by complexity / story points).
   * `ticketsResolved` weighted by severity.
   * `punctualityScore` from attendance.
3. Compute:

```pseudo
efficiencyScore = 
  a * tasksScore + b * ticketSeverityScore + c * punctualityScore;
```

4. Store in `EmployeePerformanceSnapshot`.

These snapshots power the HR & analytics dashboards.

---

## 9. Notification & Preferences Workflow

### 9.1 Sending Notifications

Any business action (ticket created, task assigned, leave approved):

1. Service emits event (e.g. `TaskAssignedEvent`).
2. `NotificationListener`:

   * Determines recipients (e.g. `task.assigneeId`).
   * For each recipient:

     * Load `UserNotificationPreference`.
     * Create `Notification` row (in-app).
     * If email enabled → send via SMTP.
     * If WhatsApp/SMS enabled & severity high → call Twilio (etc).
     * If push enabled → call push service.

### 9.2 Reading & Managing Notifications

* `GET /notifications`

  * Returns paginated notifications.
* `PATCH /notifications/{id}/read` or `mark-all-read`.
* Backend updates `readAt`.

---

## 10. Security & Session Management Workflow

### 10.1 Login

* `POST /auth/login`

  * Validate credentials.
  * If ok:

    * Generate `accessToken`, `refreshToken`.
    * Save `Session` record:

      * userId, device info, ip, createdAt, lastActiveAt.
    * Return tokens.

### 10.2 Every Request

* JWT filter:

  * Validates token.
  * Loads user + roles.
* `ActivityFilter`:

  * Finds session by token Id.
  * If `now - lastActiveAt > 20min` → 401 + invalid refresh token.
  * Else update `lastActiveAt = now`.

### 10.3 Logout

* `POST /auth/logout`

  * Backend:

    * Invalidate refresh token.
    * Mark session record as `terminatedAt=now`.

### 10.4 Admin Session View

* `GET /security/sessions` (for self).
* `DELETE /security/sessions/{id}` → remote logout.

---

