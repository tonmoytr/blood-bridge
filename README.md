# 🩸 Blood Bridge

## 📌 Description

Blood Bridge is a full-stack web application designed to connect blood donors with recipients efficiently. It provides a centralized platform where users can request blood, donate, and track real-time status while admins manage the entire system.

🔗 **Live Site:** [https://blood-bridge-lac.vercel.app/](https://blood-bridge-lac.vercel.app/)
💻 **Repository:** [https://github.com/tonmoytr/blood-bridge](https://github.com/tonmoytr/blood-bridge)

### 🚀 Tech Stack

* Frontend: React.js, Tailwind CSS
* Backend: Node.js, Express.js
* Database: MongoDB
* Authentication: JWT

---

# 📖 README

## 🔍 Overview

Blood Bridge is a Blood Bank Management System that simplifies the process of blood donation and requests. The platform connects donors and patients through a user-friendly interface and provides an admin dashboard to manage users, requests, and blood inventory.

It aims to reduce delays and improve accessibility in emergency situations by digitizing the blood donation workflow and enabling real-time tracking. ([GitHub][1])


```
![Blood Bridge Screenshot](./screenshots/home.png)
```

---

## ⚙️ Technologies Used

### Frontend

* React.js
* Tailwind CSS
* DaisyUI
* React Query
* React Icons
* SweetAlert2

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication & Security

* JSON Web Token (JWT)

---

## ✨ Key Features

### 👤 User (Donor & Patient)

* Register and login securely
* Request blood
* Donate blood
* Track request & donation status (Pending / Approved / Rejected)
* View personal dashboard

### 🛠️ Admin

* Manage donors and patients
* Approve/reject blood requests
* Manage blood inventory
* Monitor system via dashboard

### 🌟 General Features

* Role-based authentication system
* Real-time status updates
* Responsive UI
* Clean and modern design
* Efficient data fetching with React Query

---

## 📦 Dependencies

### Frontend Dependencies

* react
* react-dom
* react-router-dom
* @tanstack/react-query
* tailwindcss
* daisyui
* sweetalert2
* react-icons

### Backend Dependencies

* express
* mongoose
* jsonwebtoken
* cors
* dotenv

---

## 🧑‍💻 Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/tonmoytr/blood-bridge.git
cd blood-bridge
```

---

### 2️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

### 3️⃣ Setup Backend

```bash
cd server
npm install
npm run dev
```

---

### 4️⃣ Environment Variables

Create `.env` file in backend:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

Create `.env` file in frontend:

```
VITE_API_URL=http://localhost:5000
```

---

### 5️⃣ Run the App

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:5000](http://localhost:5000)

---

## 🔗 Relevant Links

* 🌐 Live Site: [https://blood-bridge-lac.vercel.app/](https://blood-bridge-lac.vercel.app/)
* 💻 GitHub Repo: [https://github.com/tonmoytr/blood-bridge](https://github.com/tonmoytr/blood-bridge)

---

## 🎯 Conclusion

Blood Bridge is a practical solution for real-world healthcare challenges, helping bridge the gap between blood donors and recipients. By combining modern web technologies with an efficient workflow, it ensures faster and more reliable blood donation management.


[1]: https://github.com/Rakesh01999/BloodBridge-Frontend?utm_source=chatgpt.com "GitHub - Rakesh01999/BloodBridge-Frontend: 🩸BloodBridge - Blood Bank Management System : A web app for managing blood donations and requests. Provides real-time blood data, secure authentication, and streamlined processes for donors, patients, and admins."
