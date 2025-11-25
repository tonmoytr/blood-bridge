# BloodBridge

Bangladesh-focused emergency blood logistics platform built with the latest web technologies.

## Tech Stack

- **Next.js**: 16.0.3 (with Turbopack)
- **React**: 19.0.0
- **TypeScript**: 5.x
- **Tailwind CSS**: 4.0
- **MongoDB**: 8.2 (with Mongoose 9.0.0)
- **Socket.io**: 4.8.1
- **shadcn/ui**: 3.5.0

## Getting Started

### Prerequisites

- Node.js 20.9+ 
- npm or yarn
- MongoDB Atlas account (free tier)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file (see `.env.example`)

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
blood-bridge/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── donor/             # Donor dashboard & pages
│   ├── seeker/            # Seeker dashboard & pages
│   ├── request/           # Request pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── features/          # Feature-specific components
├── lib/                   # Utilities & helpers
│   ├── db/                # Database connection
│   ├── utils.ts           # Utility functions
│   └── mock-data.ts       # Mock data for UI development
├── models/                # Mongoose models
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Development Roadmap

See `implementation_plan.md` for detailed week-by-week breakdown.

- **Week 1-2**: Complete UI prototype with mock data
- **Week 3**: Database setup & models
- **Week 4**: Request system & matching API
- **Week 5**: Real-time chat with Socket.io
- **Week 6**: Authentication & user management
- **Week 7**: Mission mode & completion flow
- **Week 8**: Anti-dalal features, chronic care, PWA

## Features

- Emergency blood request system
- Smart donor matching (blood group + location)
- Secure chat before phone reveal
- Mission mode tracking (Uber-style)
- Donor cooldown management (90/120 days)
- Trust score & fake request detection
- Chronic patient adoption
- Badge system for donors

## License

MIT
