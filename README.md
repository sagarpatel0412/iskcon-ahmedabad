````md
# ISKCON Ahmedabad Monorepo

Monorepo for the ISKCON Ahmedabad platform.

## Apps

```txt
apps/
  api/      NestJS backend API
  web/      Vite React web app
  mobile/   Expo React Native mobile app
````

## Database

```txt
database/
  dumps/      SQL dumps, ignored from Git
  scripts/    DB export/import scripts
```

## Install

```bash
pnpm install
```

## Run Development

Run all supported dev apps:

```bash
pnpm dev
```

Run separately:

```bash
pnpm dev:api
pnpm dev:web
pnpm dev:mobile
```

## Build

```bash
pnpm build
```

## Database Commands

Create schema-only SQL:

```bash
pnpm db:schema
```

Create full database dump:

```bash
pnpm db:dump
```

Create both:

```bash
pnpm db:all
```

Restore schema:

```bash
pnpm db:restore-schema
```

Restore full dump:

```bash
pnpm db:restore-full
```

## Environment Variables

Create `.env` in root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=iskcon_mobile_database
DB_USER=root
DB_PASSWORD=your_password
```

Also create app-specific `.env` files where required:

```txt
apps/api/.env
apps/web/.env
apps/mobile/.env
```

## Git Rules

Do not commit:

```txt
.env
database/dumps/
node_modules/
dist/
build/
android/
ios/
```

Database dumps may contain private user, donation, and payment data, so keep them outside Git.

## Deployment

Usually only these are deployed to server:

```txt
apps/api
apps/web
```

Mobile app is built separately for Play Store / App Store.

## Useful Commands

```bash
pnpm --filter api dev
pnpm --filter web dev
pnpm --filter mobile dev
```

```bash

## Author and Maintainer

### Sagar Patel

Senior Software Engineer & Full Stack Developer

**Tech Stack**

- React.js
- React Native (Expo)
- NestJS
- Node.js
- TypeScript
- MySQL
- PostgreSQL
- MongoDB
- Redis
- Docker
- Kubernetes
- AWS
- Google Cloud

**Projects**

- ISKCON Ahmedabad Platform
- Krishna App
- Event Management System
- Course Management System
- Trip & Yatra Management System
- Donation Platform
- Spiritual Content Platform

**Location**

Ahmedabad, Gujarat, India 🇮🇳

---

Made with ❤️ for ISKCON Ahmedabad and the devotee community.
```