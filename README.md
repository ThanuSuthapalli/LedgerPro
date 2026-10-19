# LedgerPro 💼

A modern, full-stack **expense management and financial tracking** web application built with Next.js 16, PostgreSQL, and a clean role-based access system.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle-336791?style=flat-square&logo=postgresql)
![Better Auth](https://img.shields.io/badge/Auth-Better--Auth-green?style=flat-square)

---

## ✨ Features

- **Role-Based Dashboards** – Separate views for **Admins**, **Managers**, and **Employees**
- **Expense Submission** – Employees can submit expenses with bill/receipt uploads
- **Approval Workflow** – Managers approve or reject submitted expenses
- **Analytics & Charts** – Visual expense breakdowns with Recharts
- **File Uploads** – Secure bill/receipt storage via Vercel Blob
- **Authentication** – Session-based auth using Better Auth
- **Responsive UI** – Built with shadcn/ui components and Tailwind CSS v4

---

## 🛠 Tech Stack

| Layer        | Technology                            |
|--------------|---------------------------------------|
| Framework    | [Next.js 16](https://nextjs.org/)     |
| Language     | TypeScript 5.7                        |
| Styling      | Tailwind CSS v4 + shadcn/ui           |
| Database     | PostgreSQL via [Drizzle ORM](https://orm.drizzle.team/) |
| Auth         | [Better Auth](https://better-auth.com/) |
| File Storage | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| Charts       | [Recharts](https://recharts.org/)     |
| Deployment   | Docker / Vercel                       |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ / pnpm
- PostgreSQL database

### Installation

```bash
# Clone the repo
git clone https://github.com/ThanuSuthapalli/LedgerPro.git
cd LedgerPro

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, AUTH_SECRET, and BLOB_READ_WRITE_TOKEN
```

### Database Setup

```bash
# Generate and push schema
pnpm db:generate
pnpm db:push

# Seed with sample data
pnpm db:seed
```

### Run Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker

```bash
docker-compose up --build
```

---

## 📁 Project Structure

```
LedgerPro/
├── app/
│   ├── admin/          # Admin dashboard pages
│   ├── manager/        # Manager dashboard pages
│   ├── employee/       # Employee dashboard pages
│   ├── login/          # Authentication page
│   └── api/            # API routes
├── components/
│   ├── dashboards/     # Role-specific dashboard components
│   ├── ui/             # shadcn/ui base components
│   └── ...             # Shared components (charts, modals, tables)
├── lib/                # Utilities, DB config, auth setup
├── scripts/            # DB seed scripts
└── drizzle.config.ts   # Drizzle ORM configuration
```

---

## 🔐 Roles

| Role     | Capabilities                                          |
|----------|-------------------------------------------------------|
| Admin    | Full access – manage users, view all expenses         |
| Manager  | Approve/reject team expenses, view team analytics     |
| Employee | Submit expenses, upload bills, track personal history |

---

## 📄 Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:5432/ledgerpro
AUTH_SECRET=your-auth-secret
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ by <a href="https://github.com/ThanuSuthapalli">ThanuSuthapalli</a></p>
