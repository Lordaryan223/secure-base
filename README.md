# 🗂️ Basecampy — Project Management API

A robust REST API for managing projects, tasks, and team collaboration. Built with Node.js, Express, and MongoDB.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (Access + Refresh Tokens) |
| Email | Nodemailer + Mailgen |
| Validation | express-validator |
| File Upload | Multer |

---

## 📁 Project Structure

```
project-management/
├── src/
│   ├── controllers/
│   │   ├── auth.controllers.js
│   │   ├── project.controllers.js
│   │   ├── task.controllers.js
│   │   └── healthcheck.controllers.js
│   ├── models/
│   │   ├── user.models.js
│   │   ├── project.models.js
│   │   ├── projectmember.models.js
│   │   ├── task.models.js
│   │   ├── subtask.models.js
│   │   └── note.models.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   └── healthcheck.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── multer.middleware.js
│   │   └── validator.middleware.js
│   ├── utils/
│   │   ├── api-error.js
│   │   ├── api-response.js
│   │   ├── async-handler.js
│   │   ├── constants.js
│   │   └── mail.js
│   ├── db/
│   │   └── index.js
│   ├── app.js
│   └── index.js
├── public/
│   └── images/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account (for emails) or Mailtrap

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/project-management.git
cd project-management
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```bash
cp .env.example .env
```

Fill in the values (see Environment Variables section below).

### 4. Run the server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000`

---



> 💡 Generate secure secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 📡 API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login user |
| POST | `/logout` | ✅ | Logout user |
| GET | `/current-user` | ✅ | Get logged in user |
| POST | `/refresh-token` | ❌ | Refresh access token |
| GET | `/verify-email/:token` | ❌ | Verify email |
| POST | `/resend-email-verification` | ✅ | Resend verification email |
| POST | `/forgot-password` | ❌ | Request password reset |
| POST | `/reset-password/:token` | ❌ | Reset password |
| POST | `/change-password` | ✅ | Change current password |

### Projects — `/api/v1/projects`

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/` | Any | Get all my projects |
| POST | `/` | Any | Create new project |
| GET | `/:projectId` | Any | Get project by ID |
| PUT | `/:projectId` | Admin | Update project |
| DELETE | `/:projectId` | Admin | Delete project |
| GET | `/:projectId/members` | Any | Get project members |
| POST | `/:projectId/members` | Admin | Add member to project |
| PUT | `/:projectId/members/:userId` | Admin | Update member role |
| DELETE | `/:projectId/members/:userId` | Admin | Remove member |

### Healthcheck — `/api/v1/healthcheck`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Check server status |

---

## 👥 User Roles

| Role | Permissions |
|------|------------|
| `admin` | Full access — create, update, delete projects and members |
| `project_admin` | Manage tasks and members within a project |
| `member` | View and work on tasks |

---

## 📦 Response Format

All API responses follow this structure:

```json
{
  "statusCode": 200,
  "data": { },
  "message": "Success",
  "success": true
}
```

Error responses:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "success": false,
  "errors": []
}
```

---

## 🗄️ Data Models

### User
```
username, email, password, fullName, avatar, isEmailVerified, refreshToken
```

### Project
```
name, description, createdBy (User ref)
```

### ProjectMember
```
user (User ref), project (Project ref), role (admin | project_admin | member)
```

### Task
```
title, description, project (ref), assignedTo (User ref), assignedBy (User ref), status (todo | in_progress | done), attachments[]
```

### Subtask
```
title, task (Task ref), isCompleted, createdBy (User ref)
```

---

## 📈 Scalability Notes

See [SCALABILITY.md](./SCALABILITY.md) for detailed notes on scaling this application.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use this project for learning and development.
