# Holy Church Platform

A modern church management platform built with Elysia JS, featuring sermons, events, gallery, donations, blog, prayer requests, and podcasts.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Elysia JS
- **Database:** PostgreSQL with Prisma ORM
- **Frontend:** React with Server-Side Rendering (SSR)
- **Styling:** Tailwind CSS
- **File Storage:** Supabase Storage
- **Email:** Resend
- **Authentication:** JWT with bcrypt
- **Package Manager:** pnpm

## Features

- **Sermons:** Video/audio sermon management with preacher information
- **Events:** Church event scheduling and management
- **Gallery:** Image galleries for church events and activities
- **Donations:** Online donation tracking
- **Blog:** Church blog with author management
- **Prayer Requests:** Anonymous and member prayer request submissions
- **Podcasts:** Audio/video podcast management
- **User Authentication:** Registration, login, password reset
- **Admin Panel:** Dashboard for managing all content
- **Role-Based Access:** SUPER_ADMIN, ADMIN, MEMBER roles

## Project Structure

```
holy-church/
├── src/
│   ├── routes/           # Elysia routes (API + SSR)
│   │   ├── auth/         # Authentication routes
│   │   ├── sermons/      # Sermon routes
│   │   ├── events/       # Event routes
│   │   ├── gallery/      # Gallery routes
│   │   ├── donations/    # Donation routes
│   │   ├── blog/         # Blog routes
│   │   ├── prayer/       # Prayer request routes
│   │   ├── podcasts/     # Podcast routes
│   │   ├── admin/        # Admin routes
│   │   └── pages/        # Public pages (SSR)
│   ├── components/       # React components (for SSR)
│   ├── lib/              # Utilities (S3, email, auth)
│   ├── prisma/           # Prisma client
│   └── index.ts          # Entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── public/              # Static assets
├── package.json
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Bun installed
- PostgreSQL database
- AWS S3 bucket (for file storage)
- Resend API key (for email)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `AWS_ACCESS_KEY_ID`: AWS access key
   - `AWS_SECRET_ACCESS_KEY`: AWS secret key
   - `AWS_REGION`: AWS region
   - `AWS_S3_BUCKET`: S3 bucket name
   - `RESEND_API_KEY`: Resend API key
   - `RESEND_FROM_EMAIL`: Sender email address
   - `PORT`: Server port (default: 3000)

4. Generate Prisma client:
   ```bash
   bun run db:generate
   ```

5. Run database migrations:
   ```bash
   bun run db:migrate
   ```

### Development

Run the development server:
```bash
bun run dev
```

The server will start at `http://localhost:3000`

### Production

Build the application:
```bash
bun run build
```

Start the production server:
```bash
bun run start
```

### Docker

Build and run with Docker Compose:
```bash
docker-compose up --build
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Sermons
- `GET /api/sermons` - Get all sermons
- `GET /api/sermons/:id` - Get sermon by ID
- `POST /api/sermons` - Create sermon (admin only)
- `PUT /api/sermons/:id` - Update sermon (admin only)
- `DELETE /api/sermons/:id` - Delete sermon (admin only)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Gallery
- `GET /api/gallery` - Get all galleries
- `GET /api/gallery/:id` - Get gallery by ID
- `POST /api/gallery` - Create gallery (admin only)
- `PUT /api/gallery/:id` - Update gallery (admin only)
- `DELETE /api/gallery/:id` - Delete gallery (admin only)

### Donations
- `GET /api/donations` - Get user donations
- `GET /api/donations/all` - Get all donations (admin only)
- `POST /api/donations` - Create donation

### Blog
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/:id` - Get blog post by ID
- `GET /api/blog/admin/all` - Get all blog posts (admin only)
- `POST /api/blog` - Create blog post (admin only)
- `PUT /api/blog/:id` - Update blog post (admin only)
- `DELETE /api/blog/:id` - Delete blog post (admin only)

### Prayer Requests
- `GET /api/prayer` - Get user prayer requests
- `GET /api/prayer/all` - Get all prayer requests (admin only)
- `POST /api/prayer` - Create prayer request

### Podcasts
- `GET /api/podcasts` - Get published podcasts
- `GET /api/podcasts/:id` - Get podcast by ID
- `GET /api/podcasts/admin/all` - Get all podcasts (admin only)
- `POST /api/podcasts` - Create podcast (admin only)
- `PUT /api/podcasts/:id` - Update podcast (admin only)
- `DELETE /api/podcasts/:id` - Delete podcast (admin only)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (super admin only)

## Pages (SSR)

- `/` - Home page
- `/sermons` - Sermons page
- `/events` - Events page
- `/gallery` - Gallery page
- `/give` - Donation page
- `/blog` - Blog page
- `/prayer-requests` - Prayer requests page
- `/podcasts` - Podcasts page
- `/about-us` - About us page
- `/services` - Services page

## Database Schema

### User
- id, email, password, phoneNumber, name, avatar, about, role, lastLogin, isVerified, resetPasswordToken, resetPasswordExpiresAt, verificationToken, verificationTokenExpiresAt, createdAt, updatedAt

### Sermon
- id, title, description, date, videoUrl, audioUrl, thumbnailUrl, preacher (relation to User), preacherId, createdAt, updatedAt

### Event
- id, title, description, date, location, imageUrl, createdAt, updatedAt

### Gallery
- id, caption, imageUrls (array), createdAt, updatedAt

### Donation
- id, amount, donor (relation to User), donorId, message, createdAt

### Blog
- id, title, content, author (relation to User), authorId, thumbnailUrl, published, createdAt, updatedAt

### PrayerRequest
- id, request, isAnonymous, user (relation to User), userId, createdAt

### Podcast
- id, title, description, audioUrl, videoUrl, thumbnailUrl, duration, speaker (relation to User), speakerId, published, publishedAt, createdAt, updatedAt

## License

MIT
