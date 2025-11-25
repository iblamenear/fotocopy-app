# 🖨️ Fotocopy Online Web App

A modern, full-stack web application for online photocopy and document printing services. This platform connects customers with printing services and couriers, featuring a seamless ordering process, real-time tracking, and role-based dashboards.

![Project Banner](https://via.placeholder.com/1200x400?text=Fotocopy+Online+Platform)

## ✨ Key Features

### 👤 User Portal
- **Document Upload:** Drag & drop support for PDFs and images.
- **Smart Page Counting:** Automatically detects page counts for PDF files.
- **Custom Print Settings:** Configure copies, paper size (A4/F4), color mode, and binding options.
- **Shopping Cart:** Manage multiple print jobs in a single order.
- **Secure Checkout:** Integrated **Midtrans Gateway** for secure payments.
- **Order Tracking:** Real-time status updates from processing to delivery.

### 🛡️ Admin Dashboard
- **Overview Stats:** Premium glassmorphism cards showing total orders, revenue, and active jobs.
- **Order Management:** Filter orders by status (Pending, Paid, Processing, Shipped).
- **Status Updates:** Update order progress with a single click.
- **Detailed View:** Inspect customer details and downloaded files.

### 🚚 Courier Dashboard
- **Mobile-First Design:** Optimized for on-the-go usage.
- **Active Deliveries:** Clear view of assigned packages.
- **One-Click Actions:** "Start Delivery" and "Complete Delivery" buttons.
- **Navigation:** Direct integration with Google Maps and Phone dialer.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Payment:** [Midtrans Snap](https://midtrans.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **PDF Tools:** [PDF.js](https://mozilla.github.io/pdf.js/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- Midtrans Account (Client & Server Keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iblamenear/fotocopy-app.git
   cd fotocopy-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy the example file and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and update the values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/fotocopy
   NEXTAUTH_SECRET=your_super_secret_key
   MIDTRANS_SERVER_KEY=your_midtrans_server_key
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Visit `http://localhost:3000` in your browser.

## 📂 Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── api/          # Backend API routes
│   ├── (auth)/       # Authentication pages
│   ├── admin/        # Admin dashboard
│   ├── courier/      # Courier dashboard
│   └── ...           # User pages (cart, track, etc.)
├── components/       # Reusable UI components
├── lib/              # Utility functions & DB connection
├── models/           # Mongoose database schemas
└── types/            # TypeScript type definitions
```

## 🎨 UI/UX Highlights
- **Glassmorphism:** Modern, translucent card designs.
- **Dark Mode:** Fully supported across all pages.
- **Responsive:** Optimized for Desktop, Tablet, and Mobile.
- **Animations:** Smooth transitions and hover effects.

## 📄 License
This project is licensed under the MIT License.
