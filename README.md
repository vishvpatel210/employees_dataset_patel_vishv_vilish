# 👨‍💼 EmployeeSphere

### Manage Employees. Streamline Operations. Simplify Workforce Management.

![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

# 🚀 Full Stack Employee Management System

EmployeeSphere is a modern **Employee Management Web Application** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)** to simplify employee record management, authentication, analytics, and workforce operations.

This platform replaces manual employee tracking systems with a secure, scalable, and modern digital solution.

---

# 🔗 Important Links

| Resource | Link |
|----------|------|
| 🌐 Live Project | [EmployeeSphere](https://employees-sphere-vishv-patel.onrender.com/) |
| ⚙️ Backend API | [Backend API](https://employees-dataset-patel-vishv-vilish.onrender.com/) |
| 📄 Postman Documentation | [Postman Docs](https://documenter.getpostman.com/view/50841229/2sBXwtqptY) |

---

# 📖 Problem Statement

Many organizations still manage employee records manually using spreadsheets or disconnected systems. This creates:

- Employee data management issues
- Difficult employee tracking
- Poor department management
- Time-consuming HR operations
- No centralized dashboard
- Lack of analytics and reporting

---

# 💡 Solution

EmployeeSphere provides one centralized employee management platform where organizations can:

- Manage employees easily
- Track employee records
- Organize departments
- Search and filter employees
- View analytics and reports
- Improve HR workflow efficiency

---

# ✨ Key Features

## 🔐 Authentication

- Secure Login & Signup
- JWT Authentication
- Protected Routes
- Role-Based Access

## 👨‍💼 Employee Management

- Add Employee
- Edit Employee
- Delete Employee
- Employee Profile Management
- Search & Filter Employees

## 🏢 Department Management

- Department-wise Employee Listing
- Employee Status Tracking
- Designation Management

## 📊 Dashboard & Analytics

- Employee Statistics
- Department Analytics
- Active vs Inactive Employees
- Employee Growth Insights

## ⚙️ System Features

- Pagination
- Sorting
- Filtering
- Error Handling
- Middleware System
- REST API Architecture
- MongoDB Aggregation
- Responsive Dashboard UI

---

# 💻 Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- Redux Toolkit
- React Router DOM

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication
- JWT Authentication
- bcrypt.js

## Deployment
- Vercel
- Render

## API Testing
- Postman

---

# 📂 Folder Structure

```bash
employee-management-system/
│── README.md
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Employees/
│   │   │   ├── Departments/
│   │   │   ├── Analytics/
│   │   │   └── Settings/
│   │   ├── services/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validations/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── .env
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone <your-repository-link>
```

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Install Backend Dependencies

```bash
cd backend
npm install
```

---

# 🔑 Environment Variables

Create `.env` file inside backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# ▶️ Run Project

## Start Backend

```bash
cd backend
npm run dev
```

## Start Frontend

```bash
cd frontend
npm run dev
```

---

# 🌐 API Base URL

```bash
http://localhost:5000/api/v1
```

---

# 📡 Main API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /employees | Get all employees |
| GET | /employees/:id | Get employee by ID |
| POST | /employees | Create employee |
| PUT | /employees/:id | Replace employee |
| PATCH | /employees/:id | Update employee |
| DELETE | /employees/:id | Delete employee |
| GET | /employees/exists/:id | Check whether employee exists |
| POST | /employees/bulk-create | Create multiple employees |
| PATCH | /employees/bulk-update | Update multiple employees |
| DELETE | /employees/bulk-delete | Delete multiple employees |

---

# 🔐 Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login user |
| GET | /auth/profile | Get user profile |

---

# 📸 Project Screenshots

### 🔐 Login Page

![Login](https://via.placeholder.com/1200x700.png?text=Login+Page)

### 📊 Dashboard

![Dashboard](https://via.placeholder.com/1200x700.png?text=Dashboard)

### 👨‍💼 Employees Page

![Employees](https://via.placeholder.com/1200x700.png?text=Employees+Management)

### 🏢 Departments Page

![Departments](https://via.placeholder.com/1200x700.png?text=Departments)

### 📈 Analytics Dashboard

![Analytics](https://via.placeholder.com/1200x700.png?text=Analytics+Dashboard)

### ⚙️ Settings Page

![Settings](https://via.placeholder.com/1200x700.png?text=Settings+Page)

---

# 📊 Future Improvements

- Attendance Management System
- Payroll Integration
- Leave Management
- Email Notifications
- Advanced Role Permissions
- File Upload System
- Export Reports (PDF/Excel)
- Real-Time Notifications

---

# 📄 Documentation

- Backend APIs tested using Postman
- MVC Architecture followed
- RESTful API structure implemented
- Clean and scalable folder structure maintained
- JWT Authentication implemented
- MongoDB Aggregation pipelines integrated



---

# 👨‍💻 Author

## Vishv Patel

Full Stack Developer | MERN Stack Enthusiast

Passionate about building scalable MERN stack applications, clean backend architectures, and modern user experiences.

---

# 🙌 Thank You

Thank you for visiting this project.

If you found this project helpful, please consider giving it a ⭐ on GitHub and connecting with me.

---
