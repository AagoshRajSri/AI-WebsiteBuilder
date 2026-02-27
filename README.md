# AI Website Builder

An intelligent, full-stack application that generates production-ready websites (HTML & Tailwind CSS) from simple text prompts. Powered by Hugging Face's Qwen2.5-Coder model, this platform allows users to instantly create, iterate, and publish web projects.

## Features

- **Prompt-to-Website:** Generate fully functional layouts just by describing what you want.
- **Smart Revisions:** Chat with the AI to refine and modify your specific project versions.
- **Version Control:** Automatically track changes, view history, and rollback to previous design iterations.
- **Project Management:** Save your work, preview sites, and publish them to share with the community.
- **Secure Authentication:** User sign-up and login powered by Better-Auth.
- **Credit System & Monetization:** Start with free credits and purchase more via a secure Stripe integration.

## Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS (v4) + Class Variance Authority (CVA) + `clsx` + `tailwind-merge`
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Notifications:** Sonner

### Backend
- **Server:** Node.js + Express
- **Database:** PostgreSQL (Hosted on Neon DB)
- **ORM:** Prisma Client with `@neondatabase/serverless` and HTTP Fetch adapter for maximum stability in restricted environments.
- **Authentication:** Better-Auth (Prisma Adapter)
- **AI Integration:** Hugging Face Inference API (Router Endpoint: `Qwen/Qwen2.5-Coder-32B-Instruct`)
- **Payments:** Stripe API

## Getting Started

### Prerequisites

- Node.js (v20+)
- A Neon PostgreSQL Database
- Hugging Face API Token (with access to the Inference API)
- Stripe Account (for the credit system)

### Environment Variables

**Backend (`server/.env`)**
```env
# Server URLs
TRUSTED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
NODE_ENV=development

# Database 
# Ensure you use the pooled URL with ?pgbouncer=true or standard URL depending on your network.
DATABASE_URL=postgresql://<user>:<password>@<neon_host>/<dbname>?sslmode=require

# Authentication (Better Auth)
BETTER_AUTH_SECRET=your_super_secret_string
BETTER_AUTH_URL=http://localhost:3000

# Hugging Face AI
HF_TOKEN=your_huggingface_token

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Frontend (`client/.env`)**
```env
VITE_BASE_URL=http://localhost:3000
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AagoshRajSri/AI-WebsiteBuilder.git
   cd AI-WebsiteBuilder
   ```

2. **Install dependencies:**
   ```bash
   # Install Client Dependencies
   cd client
   npm install

   # Install Server Dependencies
   cd ../server
   npm install
   ```

3. **Database Setup (Server):**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push # Or use migrations if configured
   ```

### Running the App Locally

Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend development server:
```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`.

## Architecture Highlights
- **Serverless PostgreSQL Adapter:** We utilize Neon's serverless HTTP adapter with Prisma to bypass common Windows/Corporate network firewalls blocking standard PostgreSQL WebSocket/TCP connections.
- **AI Router Proxy:** We point Hugging Face requests to the stable, load-balanced `router.huggingface.co/v1/chat/completions` API endpoint, enhancing reliability over direct model endpoint calls.

## License
MIT License
