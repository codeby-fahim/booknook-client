<div align="center">

# 📚 BookNook

### Your little corner of books.

A modern, responsive online library where readers can discover, share, borrow, and return books.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-173F35?style=for-the-badge)](https://booknook-client-beta-pink.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/codeby-fahim/booknook-client.git)

![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Better Auth](https://img.shields.io/badge/Auth-Better%20Auth-6C47FF)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)

</div>

---

## 📖 Overview

**BookNook** is a full-stack online library application built with **Next.js 16** and **TypeScript**. Visitors can browse the catalogue without an account, while signed-in members can add books, manage their own collection, borrow available books, and return them when finished.

The client is protected by a server-side route guard and communicates with a companion **Express + MongoDB** API using **JWT authentication** issued by Better Auth.

---

## 🌐 Live Demo

| Resource | Link |
| --- | --- |
| 🚀 Live Application | [booknook-client-beta-pink.vercel.app](https://booknook-client-beta-pink.vercel.app) |
| 💻 GitHub Repository | [github.com/codeby-fahim/booknook-client](https://github.com/codeby-fahim/booknook-client.git) |

> The application requires the companion BookNook API server to be running. Configure its URL with `NEXT_PUBLIC_API_URL`.

---

## ✨ Features

### Public
- 🏠 Beautiful landing page with hero carousel, new arrivals, and feature sections
- 📚 Browse the full book catalogue
- 🔍 View detailed information for any book
- 🌙 Fully responsive layout for mobile, tablet, and desktop
- 🧭 Clean navigation with active link states

### Authentication
- 🔐 Email & password registration and login
- 🔑 Google OAuth sign-in
- 🛡️ Server-side route protection with `proxy.ts`
- ↩️ Redirect back to the originally requested page after login
- 👤 Profile page with account details

### For Members
- ➕ Add new books to the library
- 📗 Manage your own books (edit and delete)
- 📖 Borrow available books with a single click
- 🔄 Return borrowed books
- 📋 Track all active borrows in a dedicated dashboard
- 📉 Live availability updates as copies are borrowed and returned

---

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| UI Library | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Components | [Base UI](https://base-ui.com/), shadcn-style primitives |
| Icons | [Lucide React](https://lucide.dev/) |
| Authentication | [Better Auth](https://www.better-auth.com/) (email/password, Google, JWT plugin) |
| Database | [MongoDB](https://www.mongodb.com/) |
| API | Express + MongoDB driver (companion service) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Carousel | [Swiper](https://swiperjs.com/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 20.9.0`
- **npm** (or pnpm / yarn / bun)
- A **MongoDB** database (local or MongoDB Atlas)
- The **BookNook API server** running locally or deployed
- Google OAuth credentials (optional, only for Google sign-in)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/codeby-fahim/booknook-client.git

# 2. Move into the project directory
cd booknook-client

# 3. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Public URL of the Next.js app
BETTER_AUTH_URL=http://localhost:3000

# Secret used by Better Auth (use a long, random value in production)
BETTER_AUTH_SECRET=your-super-secret-key

# MongoDB connection string
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>/booknook

# Base URL of the BookNook Express API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

| Variable | Required | Description |
| --- | --- | --- |
| `BETTER_AUTH_URL` | ✅ | Public URL of the Next.js application |
| `BETTER_AUTH_SECRET` | ✅ | Secret used to sign and encrypt auth data |
| `MONGODB_URL` | ✅ | MongoDB connection string |
| `NEXT_PUBLIC_API_URL` | ✅ | Base URL of the BookNook API server |
| `GOOGLE_CLIENT_ID` | ⚙️ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ⚙️ | Google OAuth client secret |

> ⚠️ Never commit real credentials. Keep `.env` out of version control.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Make sure the companion API server is running at the URL specified by `NEXT_PUBLIC_API_URL`.

---

## 📜 Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server with Turbopack |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

---

## 📁 Project Structure

```text
booknook-client/
├── public/
│   ├── heroImage/                  # Hero carousel images
│   └── booklogo.png
├── src/
│   ├── app/
│   │   ├── add-books/              # Add a new book (protected)
│   │   ├── all-books/              # Public catalogue
│   │   │   └── [id]/               # Public book details
│   │   ├── api/auth/[...all]/      # Better Auth route handler
│   │   ├── my-books/               # Manage own books (protected)
│   │   ├── my-borrows/             # Borrowed books dashboard (protected)
│   │   ├── my-profile/             # Account profile (protected)
│   │   ├── sign-in/                # Login page
│   │   ├── sign-up/                # Registration page
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page
│   │   ├── loading.tsx             # Global loading UI
│   │   └── not-found.tsx           # Custom 404 page
│   ├── components/
│   │   ├── books/                  # Book cards
│   │   ├── home/                   # Home page sections
│   │   ├── shared/                 # Navbar and footer
│   │   └── ui/                     # Reusable UI primitives
│   ├── lib/
│   │   ├── auth.ts                 # Better Auth server config
│   │   ├── auth-client.ts          # Better Auth client
│   │   ├── getTokenFromClient.ts   # JWT helper (client)
│   │   ├── getTokenFromServer.ts   # JWT helper (server)
│   │   └── type/                   # Shared TypeScript types
│   └── proxy.ts                    # Route protection (Next.js 16 proxy)
├── .env
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🗺️ Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Landing page with new arrivals |
| `/all-books` | Public | Browse the full catalogue |
| `/all-books/[id]` | Public | Book details and borrow action |
| `/sign-in` | Public | Email/password and Google login |
| `/sign-up` | Public | Create a new account |
| `/add-books` | 🔒 Protected | Add a book to the library |
| `/my-books` | 🔒 Protected | Edit or delete books you added |
| `/my-borrows` | 🔒 Protected | View and return borrowed books |
| `/my-profile` | 🔒 Protected | View your account details |

Unauthenticated visitors are redirected to `/sign-in?callbackUrl=<requested-path>` and returned after a successful login.

---

## 🔌 API Reference

Base URL: `NEXT_PUBLIC_API_URL`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/all-books` | Public | Get all books |
| `GET` | `/all-books/:id` | Public | Get a single book |
| `GET` | `/arrival-books` | Public | Get the latest six books |
| `POST` | `/add-books` | 🔒 Bearer | Add a new book |
| `GET` | `/my-books/:email` | 🔒 Bearer | Get books added by a user |
| `PATCH` | `/my-books/:email` | 🔒 Bearer | Update a user's book |
| `DELETE` | `/my-books/:email` | 🔒 Bearer | Delete a user's book |
| `POST` | `/borrows/:email` | 🔒 Bearer | Borrow a book |
| `GET` | `/my-borrows/:email` | 🔒 Bearer | Get active borrows |
| `PATCH` | `/my-borrows/:email/:borrowId` | 🔒 Bearer | Return a borrowed book |

Authenticated requests must include:

```http
Authorization: Bearer <jwt-token>
```

---

## 🔐 Authentication & Security

- **Better Auth** manages sessions, credentials, and Google OAuth.
- The **JWT plugin** issues access tokens used by the Express API.
- The API verifies tokens against the app's **JWKS** endpoint (`/api/auth/jwks`).
- **`src/proxy.ts`** runs before protected routes render and redirects guests to sign-in.
- Callback URLs are validated to prevent open redirects (`//evil.com` is rejected).
- Tokens are fetched on demand and sent only to the configured API.

---

## 📱 Responsive Design

BookNook is built mobile-first:

- Responsive navigation with a dedicated mobile menu
- Fluid grids for book cards and profile details
- Tables switch to stacked cards on small screens
- Touch-friendly buttons and readable typography at every breakpoint
- Full support for desktop, tablet, and mobile

---

## ☁️ Deployment

The app is deployed on **Vercel**.

### Deploy your own

1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. Add all environment variables from the table above.
4. Set `BETTER_AUTH_URL` to your production URL.
5. Add the production callback URL to your Google OAuth credentials:
   ```
   https://your-domain.com/api/auth/callback/google
   ```
6. Deploy 🚀

---

## 👨‍💻 Author

**Md Rakibul Islam Fahim**

- GitHub: [@codeby-fahim](https://github.com/codeby-fahim)
- Live Project: [BookNook](https://booknook-client-beta-pink.vercel.app)

---

<div align="center">

**BookNook** — discover stories, explore new worlds. 📚

If you like this project, consider giving it a ⭐ on GitHub!

</div>
