# SENTRA – Incident Reporting & Response Dashboard for Educational Institutions

Sentra is a web-based platform designed to improve safety and communication within educational institutions. The system allows students and staff to securely report incidents, track the progress of their reports, and access awareness resources related to campus safety.

---

## 📌 Project Overview

Sentra is a web-based platform designed to improve safety and communication within educational institutions. The system enables students and staff to report incidents securely, track their status, and access awareness resources. Administrators can monitor and manage these reports through a dedicated dashboard, ensuring that issues are addressed promptly and transparently. The goal is to promote accountability, reduce hesitation in reporting, and build a culture of trust and safety on campus. 

---

## 🚀 Features

- 🔐 User authentication (Student & Staff)
- 📝 Online complaint reporting
- 📊 Dashboard for students and staff
- 🛡 Secure data handling
- 📱 Responsive design (mobile + desktop)
- 🤖 Chatbot integration (for help & guidance)
- 📢 Awareness pages with Campus Policies and information

---

## 🧱 Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### Tools & Platforms
- Git & GitHub
- Vercel (Frontend)
- Render (Backend)

---

## 📂 Project Structure

sentra-project/
│
├── Backend/
│ ├── config/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── server.js
│ └── .env
│
├── Frontend/
│ ├── src/
│ ├── public/
│ └── package.json
│
├── README.md
└── package.json

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/pritig-15/sentra-project.git
cd sentra-project

cd Backend
npm install

cd ../Frontend
npm install

5️⃣ Run the Project
Start Backend
cd Backend
node server.js

Start Frontend
cd Frontend
npm start


Now open browser:

http://localhost:5000


| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/auth/register | Register user    |
| POST   | /api/auth/login    | Login user       |
| POST   | /api/report        | Submit report    |
| GET    | /api/report        | View all reports |

