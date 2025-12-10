## 3. Frontend Features & Pages

### Global

* Auth screens: Login, Forgot Password, Reset Password.
* Layout with Sidebar (role-based links), Header, Mobile Drawer, Notification Bell.
* Global toasts & error handling.

### Dashboards

1. **Main Dashboard**

   * KPI cards: total employees, active projects, open tickets, today’s attendance, etc.
   * Quick health summary: top risky projects, SLA breaches, pending approvals.

2. **Project Health Dashboard**

   * Project list with risk scores, traffic-light status.
   * Burn-down / burn-up charts (per project / sprint).
   * Resource utilization matrix.
   * Filters: client, team, status, timeframe.

3. **Employee Performance Dashboard (HR)**

   * Leaderboard of efficiency scores.
   * Drill-down per employee.
   * Correlation with attendance, tickets handled, tasks completed.

---

### Project & Work Management

* **Projects Page**

  * List/grid of projects, filters.
  * Detail page: members, tasks, tickets, docs, health, risk trends.
  * Team assignment management.

* **Tasks & Sprints**

  * Kanban board, sprint view.
  * Task detail with comments, attachments, links to tickets/KBA.

* **Time Tracking / Timesheets**

  * Daily/weekly log of hours per project/task.
  * Approvals by Team Lead.

---

### Client CRM & Tickets

* **Client Management Page** (you already have)

  * list + detail workspace
  * MRR, risk, projects, tickets.

* **Client Portal (frontend)**

  * My projects
  * My tickets (table + mobile cards)
  * Raise ticket page
  * Ticket details (public messages, attachments, status timeline).

* **Internal Ticket Management**

  * Admin view: approve & assign to team lead.
  * Team lead view: queue of tickets, assign to employees.
  * Employee view: “My tickets”, with quick update buttons.
  * Chat section in ticket: conversation + internal/private notes.

---

### HR / People Ops

* **User Management Page**

  * you already have list + filters + modals.
* **Employees Page**

  * list view + mobile card view.
* **Attendance Page**

  * daily view, date filters, status chips, geo-fence info.
* **Shift Planner**

  * Weekly grid: employees vs days vs shifts.
  * Drag-and-drop scheduling.
* **Leave Management**

  * HR view: requests, approvals.
  * Employee view: apply leave, see balances & calendar.
* **Holiday Calendar**

  * small calendar + list, filter by region, add holiday modal.

---

### Knowledge & Documents

* **Knowledge Base**

  * Article list with search & tags.
  * Detail page with versions & feedback.
  * “Create from ticket” flow.
  * “Related articles” panel on ticket and on new ticket form.

* **Document Vault (per project)**

  * List view with filters (type, tag, owner).
  * Upload modal with access category.
  * Audit tab for each document.
  * Badge indicators for expiring docs.

---

### Notifications & Communication

* Notification dropdown + full notifications page.
* Settings page → “Notification Preferences” tab:

  * choose event types & channels (email, in-app, push, WhatsApp/SMS).
* Ticket chat UI:

  * split between “Client Messages” and “Internal Notes”.

---

### Audit & Settings

* **Audit Logs Page**

  * filter by user, entity type, time range.
* **Sessions & Security**

  * “My sessions”: active devices, IPs, last active, revoke button.
* **Admin Settings**

  * risk formula tuning
  * SLA defaults, ticket priority matrix
  * document retention & legal holds
  * channel config (Twilio, WhatsApp, SMTP, push keys, etc.).

---