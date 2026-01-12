# 🎓 Study Flux

📚 **Study Flux** is a **MERN-based web application** that helps students **find courses**, **enroll**, and **collaborate** through **course-specific study groups** 🤝.  Users can 
**join or create study groups**, **schedule study sessions**, and **track upcoming and past sessions** using a simple **planner** 📅.  By organizing **courses, groups, and 
sessions** in one place, Study Flux supports **structured collaboration** and **consistent study habits** ✨.

---

## 📚 Table of Contents

- [🧰 Tech Stack](#-tech-stack)
- [✨ Features](#-features)
- [🎨 UI Highlights](#-ui-highlights)
- [🖼️ Screenshots](#-screenshots)
- [📦 Installation & Setup](#-installation--setup)
- [🚀 Usage](#-usage)
- [🏗 App Structure](#-app-structure)
- [🔌 API Reference](#-api-reference)
- [🗺️ Application Map](#-application-map)
- [🛡️ Security & Rules](#-security--rules)
- [🏛️ System Architecture](#-system-architecture)
- [🗃️ Database Schema & Relationships](#-database-schema--relationships)
- [📈 Future Enhancements](#-future-enhancements)
- [❤️ Built With Love](#-built-with-love)

---

## 🧰 Tech Stack

### 🖥️ Frontend

- ⚡ **React 19 (Vite)** – Used for building a fast and interactive user interface.  
- 🎨 **Material-UI (MUI)** – Provides ready-made components for a clean and consistent design.  
- 🛣️ **React Router DOM (v7)** – Handles page navigation smoothly across the app.  
- 📡 **Axios** – Used to communicate with the backend APIs.  
- 🔔 **React Toastify** – Shows real-time notifications for user actions.  

### ⚙️ Backend

- 🟢 **Node.js** – Javascript runtime environment which runs the server-side code and handles requests.  
- 🚀 **Express** – Lightweight framework for building RESTful APIs.  
- 🍃 **MongoDB & Mongoose (ODM)** – Stores app data and provides schema-based data modeling.  
- 🔑 **JWT (JSON Web Token)** – Secure, stateless authentication for user sessions.  
- 🛡️ **Bcryptjs** – Hashes passwords for secure user authentication.

---

## ✨ Features

- 🔒 **Enrollment-Gated Access** – Study groups are private communities. You can only view and participate if you are officially enrolled in the parent course.  
- 🧹 **Smart Cascade Delete** – Keeps the database clean. If a user deletes a Study Group, all related Study Sessions are automatically removed.  
- 📊 **Motivation Dashboard** – The Planner shows your study history and calculates total study hours to help gamify your learning.  
- 🔍 **Advanced Discovery** – The Resources page highlights trending courses based on member count and supports full-text search with filters.  
- 📱 **Persistent Navigation** – A unified Sidebar keeps Planner, Profile, and Resources just one click away across the app.  

- 🔐 **Authentication** – Signup & Login with JWT for secure access.  
- 📘 **Courses** – Browse, enroll, and create courses.  
- 👥 **Study Groups** – Join, create, and leave course-specific study groups.  
- 📅 **Study Sessions** – Schedule, track, and manage study sessions.  
- 🧭 **Planner** – View upcoming agenda, study history, and overall stats.  
- 🔍 **Resources** – Search and filter trending courses efficiently.  
- 👤 **Profile** – Update your name and password easily.

---

## 🎨 UI Highlights

- ✨ **Clean Design** – Built with Material-UI for a modern and consistent look.  
- 📱 **Responsive Layout** – Works smoothly on desktops, tablets, and mobile devices.  
- 🔔 **Toast Notifications** – Real-time alerts for user actions and feedback.  
- 🧭 **Intuitive Navigation** – Easy-to-use Sidebar and menu for seamless app navigation.  

---

## 📦 Installation & Setup

To get started with **Study Flux**, follow these steps:

### 1. Clone the repository

   ```bash
   git clone [https://github.com/sandeepmukku12/student_course_planner_mern.git](https://github.com/sandeepmukku12/student_course_planner_mern.git)
   cd study-flux
   ```

### 2. Backend Setup
   
   Navigate to the server directory and install dependencies:

   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```
   Run the server:

   ```bash
   npm start
   ```

### 3. Frontend Setup

   Navigate to the client directory and install dependencies:

   ```bash
   cd client
   npm install
   ```

   Start the Vite development server:

   ```bash
   npm run dev
   ```

### ✅ Notes

- After running the frontend, open your browser at [http://localhost:5173](http://localhost:5173) (Vite default) to access the app.  
- Make sure the backend server is running before using the frontend.

---
