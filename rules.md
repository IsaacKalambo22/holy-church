# HOLY CHURCH ASSEMBLY — PROJECT RULES

## Vision

Holy Church Assembly is a modern, spiritually uplifting church platform designed to connect people with God, community, sermons, events, prayer, and ministry opportunities.

Every feature, design decision, and line of code must support this mission.

---

# Core Principles

## 1. Church First

This is NOT:

* LMS
* E-commerce platform
* Marketplace
* SaaS Dashboard
* Social Network

This IS:

* Church Website
* Church Management Platform
* Ministry Platform
* Prayer Platform
* Media Platform

All features must align with the church mission.

---

## 2. User Experience First

Every page should feel:

* Warm
* Welcoming
* Spiritual
* Professional
* Modern
* Human

Avoid corporate or cold-looking interfaces.

---

## 3. Mobile First

All pages must be designed for:

1. Mobile
2. Tablet
3. Desktop

Never build desktop-first layouts.

---

## 4. Accessibility

Must support:

* Keyboard navigation
* Screen readers
* Proper semantic HTML
* Sufficient color contrast
* Focus states

WCAG AA compliance is the minimum target.

---

# Technology Stack

## Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Framer Motion
* next-themes

## Backend

* ElysiaJS
* Node.js Runtime
* Server Actions where appropriate

## Database

* PostgreSQL
* Prisma ORM

## Storage

* Supabase Storage

## Validation

* Zod

## State Management

* Zustand

---

# Architecture Rules

## Feature-Based Structure

Organize by feature, not by file type.

Correct:

src/features/sermons
src/features/events
src/features/prayer

Wrong:

components/
pages/
hooks/
everything mixed together

---

## Separation of Concerns

UI must not contain business logic.

Business logic belongs in:

* services
* server actions
* Elysia handlers

---

## Server Components First

Default:

* Server Components

Use Client Components only when needed.

Examples:

* Forms
* Zustand
* Animations
* Interactive UI

---

# Design System Rules

## Brand Identity

The logo is the source of truth.

Never introduce random colors.

---

## Primary Colors

Holy Purple

#6D28D9

Holy Purple Dark

#4C1D95

Holy Orange

#F28C38

Holy Orange Dark

#D9642B

Holy Red Accent

#D64B5F

Deep Indigo

#2E1B63

---

## Design Feel

Inspired by:

* Elevation Church
* Hillsong
* Transformation Church
* Church of the Highlands

Keywords:

* Elegant
* Emotional
* Worship-focused
* Premium
* Authentic

---

## UI Rules

Prefer:

* Large spacing
* Soft shadows
* Rounded corners
* Strong typography
* Subtle animations

Avoid:

* Heavy gradients
* Excessive glassmorphism
* Neon effects
* Excessive motion

---

# Theme Rules

Must support:

* Light Mode
* Dark Mode

Library:

next-themes

Dark mode should feel:

* Deep
* Rich
* Worshipful

Not black.

Use:

* Deep Indigo
* Purple Glow
* Warm Orange Highlights

---

# Component Rules

Use shadcn/ui whenever possible.

Required reusable components:

* Button
* Card
* Dialog
* Sheet
* Dropdown Menu
* Form
* Data Table
* Tabs
* Calendar
* Breadcrumb

Custom components:

* FlameHero
* SermonCard
* EventCard
* PrayerCard
* PastorMessage
* DonationCard
* ChurchStats

---

# State Management Rules

## Zustand Usage

Allowed:

* Theme
* UI State
* User Session
* Preferences

Not Allowed:

* Large server datasets

Use:

* React Query
* Server Components
* Server Actions

for server data.

---

# Validation Rules

All forms MUST use:

* Zod
* React Hook Form

No exceptions.

Examples:

* Login
* Register
* Contact
* Prayer Request
* Donation
* Events

---

# API Rules

Every endpoint must:

* Validate input
* Validate output
* Return typed responses
* Handle errors gracefully

Never trust client data.

---

# Security Rules

## Authentication

Use:

* Auth.js / NextAuth

Never store:

* Passwords in plain text
* Secrets in frontend code

---

## Authorization

Roles:

* SUPER_ADMIN
* ADMIN
* MEMBER

Always validate permissions.

---

## Environment Variables

Never commit:

.env
.env.local
.env.production

Only commit:

.env.example

---

# Database Rules

Use Prisma.

Every model must include:

createdAt
updatedAt

Use soft deletes when possible.

---

# Feature Scope

## Allowed Features

### Public

* Homepage
* About
* Sermons
* Events
* Ministries
* Gallery
* Blog
* Giving
* Contact

### Member

* Prayer Requests
* Saved Sermons
* Profile

### Admin

* Sermons Management
* Events Management
* Blog Management
* Prayer Moderation
* Donations Tracking
* Media Library

---

## Forbidden Features

Do NOT build:

* Course Systems
* LMS Features
* Student Management
* Billing Systems
* Marketplace Features
* Crypto Features
* Trading Features
* Wealth Platforms

This project is church-focused only.

---

# Code Quality Rules

## TypeScript

Strict mode enabled.

Never use:

any

Prefer:

unknown
generics
proper typing

---

## Imports

Use aliases:

@/components
@/features
@/lib
@/server
@/store

Avoid deep relative imports.

---

## Naming

Components:

PascalCase

Example:

SermonCard.tsx

Hooks:

useSomething

Example:

useAuth.ts

Files:

kebab-case

Example:

prayer-request-form.tsx

---

# Performance Rules

Target:

* Lighthouse 95+
* SEO 95+
* Accessibility 95+
* Best Practices 95+

Optimize:

* Images
* Fonts
* Metadata
* Server Rendering

---

# SEO Rules

Every page must have:

* Title
* Description
* Open Graph
* Twitter Metadata
* Structured Data

---

# Animation Rules

Use Framer Motion.

Animations should:

* Guide attention
* Feel natural
* Support storytelling

Never distract users.

---

# Content Tone

The website must sound:

* Loving
* Hopeful
* Welcoming
* Biblical
* Professional

Avoid:

* Aggressive sales language
* Corporate jargon
* Marketing hype

---

# Final Rule

When making any design, architecture, or feature decision:

Ask:

"Does this help people connect with God, community, and church life?"

If the answer is no, it does not belong in Holy Church Assembly.
