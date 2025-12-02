# Noventra Dynamic Management System (NDMS)

Noventra Dynamic Management System (NDMS) is an advanced, enterprise-grade platform designed by **Noventra Dynamic Tech Solutions** to streamline and automate core company operations with precision and scalability.

This system integrates modern technologies to support intelligent workforce management, project operations, client handling, financial tracking, and AI-enhanced analytics.

## 🚀 Key Features

- Employee Management & Roles (Super Admin, HR, Team Lead, Employee)
- Advanced Attendance System with Geo-Location Validation
- Time Tracking & Working Hours Monitoring
- Project Management & Milestones
- Project Progress Tracking & Dashboards
- Task Assignment & Deadlines
- Task Completion Monitoring
- Team Management & Team-Based Operations
- Department Management
- Employee Assignment to Departments & Teams
- Client Management & Project Client Linking
- Salary / Payment Module for Interns & Employees
- Multiple Permission Levels & Secure Authentication
- Full Audit Logs & History Tracking
- Futuristic AI-Enhanced Insights (Planned)
- Realtime Notifications (Planned)

## 🧱 Tech Stack

**Frontend:** React + Vite + TypeScript, TailwindCSS  
**Backend:** Java + Spring Boot  
**Database:** SQL (PostgreSQL recommended)  
**Infrastructure:** Docker, CI/CD Pipeline (Planned)  
**AI Integrations:** Internal Harix Engine (Planned)

## 📦 Project Goal

To build a highly scalable, secure, and future-ready company management ecosystem that can evolve with organizational needs while integrating modern automation and AI-driven intelligence.

# Noventra Dynamic Management System (NDMS)

Noventra Dynamic Management System (NDMS) is an advanced enterprise application built by **Noventra Dynamic Tech Solutions** to automate and streamline operations across the entire organization.

The system integrates workforce management, project monitoring, client operations, financial tracking, and AI-augmented insights into one unified platform.

---

## 🌐 Features

### 🔹 Employee & Role Management
- Multi-role system: **Super Admin, HR, Team Lead, Employee**
- Employee profiles, departments, teams, assignment system
- Access-level–controlled modules

### 🔹 Attendance & Time Tracking
- Geo-validated attendance punch-in/out
- Real-time location validation
- Working hours computation
- Late / leave / overtime tracking

### 🔹 Project & Task Operations
- Project creation, assignment, progress visualization
- Milestones, deadlines, workflow tracking
- Team & employee-specific tasks
- Task completion time monitoring

### 🔹 Team & Department Management
- Department creation and linking
- Team-based structures
- Team lead assignment
- Employee–team mapping

### 🔹 Client & Finance Modules
- Client onboarding
- Project–client linking
- Intern payment system
- Task/project-based compensation

### 🔹 System Intelligence (Planned)
- AI-driven analytics via Harix Engine
- Predictive dashboards
- Smart workload distribution

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript, TailwindCSS |
| Backend | Java + Spring Boot |
| Database | PostgreSQL |
| Infrastructure | Docker (CI/CD Planned) |
| AI | Harix Engine (Planned) |

---

## 📦 Installation

### Prerequisites
- Node.js ≥ 18  
- Java 17 or 21  
- PostgreSQL ≥ 14  
- Git  
- Maven ≥ 3.8  

---

## 🔧 Backend Setup (Spring Boot)

```bash
cd backend
cp .env.example .env
# Add DB credentials in .env

mvn clean install
mvn spring-boot:run
```

Backend will start at:

```
http://localhost:8080
```

---

## 🎨 Frontend Setup (React + Vite TS)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## 🏗 Architecture Overview

```
/frontend
  /src
    /components
    /pages
    /hooks
    /api
    /context
    /utils

/backend
  /src/main/java/com/noventra
    /config
    /controller
    /service
    /repository
    /entity
    /dto
    /security
```

---

## 📡 API Overview

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new employee |
| `/auth/login` | POST | Login |  
| `/auth/refresh` | POST | Refresh JWT token |

### Employee
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/employee` | GET | List employees |
| `/employee/{id}` | GET | Get employee |
| `/employee` | POST | Create employee |
| `/employee/{id}` | PUT | Update employee |
| `/employee/{id}` | DELETE | Remove employee |

### Attendance
| `/attendance/punch-in` | POST | Punch-in with geo coordinates |
| `/attendance/punch-out` | POST | Punch-out |
| `/attendance/{id}` | GET | View logs |

### (More endpoints added as modules expand.)

---

## 🖼 Screenshots (to be updated)

```
[PLACEHOLDER: Dashboard Screenshot]
[PLACEHOLDER: Attendance Geo Map Screenshot]
[PLACEHOLDER: Project Tracking Dashboard Screenshot]
```

---

## 📜 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

See **CONTRIBUTING.md**

---

## 🔐 Security

See **SECURITY.md**

---

## 🧩 Code of Conduct

See **CODE_OF_CONDUCT.md**

---

## 🌟 Contact

**Noventra Dynamic Tech Solutions**  
(Website coming soon)
