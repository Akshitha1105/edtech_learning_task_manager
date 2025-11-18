# **EdTech Learning Task Manager**

A full-stack role-based learning task manager designed to streamline coordination between **teachers** and **students**.  
Teachers can assign tasks directly to individual students, while students manage their personalized task lists through a clean, modern, SaaS-style interface.  
The project strictly follows a student–teacher relationship model with protected, role-based access rules.

---

## **Tech Stack**

### **Backend**
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
- bcrypt (password hashing)  
- express-rate-limit  
- CORS  
- dotenv for environment variables  
- Centralized error handling middleware

### **Frontend**
- React (Vite)  
- TailwindCSS  
- ShadCN UI components  
- Axios  
- React Router  
- Context API for global auth state  
- Responsive dashboard layout  

### **Tooling**
- Nodemon  
- Prettier  
- ESLint  
- VS Code Dev Workflow  

---

## **Folder Structure**

```bash
.
├── server/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── apiClient.js
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskRow.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── state/
│   │   │   └── AuthContext.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Environment Variables
# Backend (server/.env)
PORT=5000
MONGO_URI=mongodb://localhost:27017/edtech_task_manager
JWT_SECRET=your_jwt_secret_here
CLIENT_ORIGIN=http://localhost:5173

# Frontend (client/.env)
VITE_API_URL=http://localhost:5000

Dependencies
Backend Dependencies
{
  "dependencies": {
    "bcrypt": "^5.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "express": "^4.x",
    "express-rate-limit": "^6.x",
    "jsonwebtoken": "^9.x",
    "mongoose": "^7.x"
  },
  "devDependencies": {
    "nodemon": "^3.x"
  }
}

Frontend Dependencies
{
  "dependencies": {
    "axios": "^1.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}

Getting Started
1. Install Dependencies
cd server && npm install
cd ../client && npm install

2. Start Backend
cd server
npm run dev

3. Start Frontend
cd client
npm run dev


Open the app at 👉 http://localhost:5173

## Role-Based Functionality##
# Student#

Must select a valid teacher at signup

Can view tasks assigned only to them

Can update task progress

Cannot create or delete tasks

Cannot edit tasks created by the teacher

# Teacher #

Can view all tasks assigned to their students

Can create tasks specifically for individual students

Can edit/delete tasks created by themselves only

Cannot modify student-created tasks

### **Auth Routes**

| Method | Endpoint                   | Description                                |
|--------|-----------------------------|--------------------------------------------|
| POST   | `/auth/signup`             | Register teacher or student                |
| POST   | `/auth/login`              | Authenticate and return JWT                |
| GET    | `/auth/me`                 | Fetch logged-in user info                  |
| GET    | `/auth/teachers-list`      | Get list of all teachers                   |
| GET    | `/auth/students-of-teacher`| Get all students assigned to the teacher   |

### **Task Routes**

| Method | Endpoint      | Description                                                                 |
|--------|----------------|-----------------------------------------------------------------------------|
| GET    | `/tasks`       | Students: view own tasks; Teachers: view their tasks + tasks of their students |
| POST   | `/tasks`       | Teacher creates a new task for a selected student                           |
| PUT    | `/tasks/:id`   | Update a task (only if requester is the task owner)                         |
| DELETE | `/tasks/:id`   | Delete a task (only if requester is the task owner)    

## Frontend Features ##

Modern interface built using TailwindCSS + ShadCN
Dynamic dashboards for teacher and student roles
Task filtering, status updates, and intuitive UI
Automatic logout on expired JWT
Reusable and modular components
Clean forms with proper validation and error handling

## AI Assistance Disclosure ##

AI tools were used selectively to improve productivity in:
boilerplate setup
debugging assistance
documentation drafting
layout and UI suggestions

All critical logic — including backend routes, database models, role-based permissions, task assignment logic, and data validation — was manually implemented and verified by the developer.
AI served purely as a support mechanism, not a replacement for engineering judgment.
