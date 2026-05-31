# Modern HR Management System 🚀

A premium, full-stack HR Management System designed with modern design principles (glassmorphism, dark themes, and smooth animations) to streamline team operations. Built with **Next.js (App Router)**, **MongoDB**, and **Recharts**.

---

## ✨ Features

### 🔒 1. Secure Authentication & Authorization
* Powered by **NextAuth.js** using encrypted credentials (bcryptjs).
* Route protection via Next.js Middleware/Proxy—keeping the dashboard and employee tables secure.
* **Role-Based Access Control (RBAC):** Different navigation paths and views for **Admins** and **Employees**.

### 📊 2. Dynamic Admin Dashboard
* **Key Statistics:** Total Employees count, Today's Attendance rate, and Pending Leave Requests.
* **Interactive Charts:** Real-time data visualizations built with **Recharts** displaying daily attendance trends and department ratios.
* Frosty glassmorphism statistic cards with smooth hover animations.

### 👥 3. Employee Management
* Interactive, responsive data tables displaying employee details, departments, roles, and statuses.
* Add new employees instantly via a clean overlay modal form (powered by Base UI).

### ⏱️ 4. Daily Attendance Module
* **Employees:** One-click **Clock In** and **Clock Out** action widget. Automatically detects and labels "late" arrivals.
* **Admins:** Complete organization-wide logs showing exact clock-in/out times and daily statuses.

### 📅 5. Leave Request & Approval Workflow
* **Employees:** Form to apply for Sick, Casual, or Annual leaves with custom dates and reasons.
* **Admins:** Centralized management system with fast, click-to-approve/reject buttons that update the database dynamically.

---

## 🛠️ Tech Stack
* **Framework:** Next.js (App Router, React)
* **Database:** MongoDB (via Mongoose ODM)
* **Authentication:** NextAuth.js
* **Charts:** Recharts
* **Styling:** Tailwind CSS, Base UI, Lucide Icons, Sonner Toasts

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js (LTS version)](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas cloud database connection URI)

### 2. Clone and Install
Clone this repository to your local system and install the dependencies:
```bash
npm install
```

### 3. Configure Environment Variables
Create a file named `.env.local` in the root directory of the project and add the following:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/hrms
NEXTAUTH_SECRET=a_super_secret_key_change_in_production
NEXTAUTH_URL=http://localhost:3000
```
*(Replace `MONGODB_URI` with your MongoDB connection string if you are using Atlas).*

### 4. Seed the Admin Account
Run the database seeder to create the default Administrator account so you can log in:
```bash
npx tsx scripts/seed.ts
```

### 5. Run the Application
Start the Next.js development server:
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🔑 Default Credentials

Use the default seeded credentials to explore the system:

### Admin Account (HR Manager)
* **Email:** `admin@hr.com`
* **Password:** `admin123`

---

## 📁 Repository Structure
```text
├── public/             # Static assets
├── scripts/            # Database seeder scripts
├── src/
│   ├── app/            # Next.js App Router (Pages, layouts & APIs)
│   ├── components/     # UI Components (Buttons, tables, cards, dialogs)
│   ├── lib/            # Configuration utilities (Database connections, Auth options)
│   ├── models/         # Mongoose Database schemas (User, Attendance, Leave)
│   ├── types/          # TypeScript declarations (Next-Auth extensions)
│   └── proxy.ts        # Next.js route protection proxy
└── .env.local          # Private secrets (ignored by Git)
```
