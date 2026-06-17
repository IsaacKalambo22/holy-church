# Launch Procedure — Holy Church Assembly

**Generated:** Phase 23 - Production Deployment  
**Date:** 2026-06-17

---

## Overview

This document provides step-by-step instructions for launching the Holy Church Assembly platform to production.

---

## Pre-Launch Verification (T-1 Hour)

### 1. System Health Check

```bash
# Check application build
pnpm run build

# Run tests
pnpm run test

# Type check
pnpm exec tsc --noEmit

# Lint check
pnpm run lint
```

**Expected Result:** All checks pass with no errors

### 2. Database Verification

```bash
# Check database connection
docker exec holy-church-db pg_isready -U holychurch

# Run migrations
pnpm run db:migrate

# Verify schema
docker exec holy-church-db psql -U holychurch -d holy_church -c "\dt"
```

**Expected Result:** Database accessible, all tables present

### 3. Environment Verification

```bash
# Verify environment variables
cat .env

# Check required variables:
# - DATABASE_URL
# - NEXT_PUBLIC_APP_URL
# - JWT_SECRET
# - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
# - NEXT_PUBLIC_API_URL
```

**Expected Result:** All required variables set

### 4. Backup Verification

```bash
# Verify latest backup exists
ls -lh /backups/database/

# Test backup integrity
gunzip -t /backups/database/holy_church_latest.sql.gz
```

**Expected Result:** Latest backup exists and is valid

### 5. Team Readiness

- [ ] All team members available
- [ ] Communication channels active
- [ ] Rollback procedure reviewed
- [ ] Emergency contacts confirmed

---

## Launch Execution

### Step 1: Prepare Deployment (T-30 Minutes)

```bash
# Pull latest code
git pull origin main

# Verify version
git log -1

# Build production image
docker-compose build

# Stop existing containers (if migrating)
docker-compose down
```

### Step 2: Deploy Application (T-15 Minutes)

```bash
# Start containers
docker-compose up -d

# Verify containers running
docker ps

# Check application logs
docker logs -f holy-church
```

**Expected Result:** Containers running, no errors in logs

### Step 3: Database Migration (T-10 Minutes)

```bash
# Run any pending migrations
pnpm run db:migrate

# Verify migration success
docker exec holy-church-db psql -U holychurch -d holy_church -c "SELECT * FROM _prisma_migrations ORDER BY started_at DESC LIMIT 1;"
```

**Expected Result:** Migrations applied successfully

### Step 4: Verify Application (T-5 Minutes)

```bash
# Test application health
curl https://holychurch.mw

# Test API health
curl https://api.holychurch.mw/health

# Test database connectivity
curl https://api.holychurch.mw/api/health
```

**Expected Result:** All endpoints return 200 OK

### Step 5: DNS Verification (T-2 Minutes)

```bash
# Check DNS propagation
dig holychurch.mw

# Verify SSL certificate
curl -I https://holychurch.mw
```

**Expected Result:** DNS resolves to correct IP, SSL valid

---

## Post-Launch Validation (T+0 to T+30 Minutes)

### 1. Critical User Journeys

**Visitor Journey:**
- [ ] Homepage loads: https://holychurch.mw
- [ ] Sermons page accessible: https://holychurch.mw/sermons
- [ ] Events page accessible: https://holychurch.mw/events
- [ ] Blog page accessible: https://holychurch.mw/blog
- [ ] Prayer request form works

**Member Journey:**
- [ ] Login page accessible: https://holychurch.mw/login
- [ ] Member login successful
- [ ] Dashboard accessible: https://holychurch.mw/dashboard
- [ ] Profile page works
- [ ] Giving history displays

**Admin Journey:**
- [ ] Admin login page accessible: https://holychurch.mw/admin
- [ ] Admin login successful
- [ ] Admin dashboard accessible: https://holychurch.mw/admin/overview
- [ ] Content management works
- [ ] Member management works

### 2. Integration Verification

**Email:**
- [ ] Test email sent successfully
- [ ] Email received in inbox
- [ ] Email content correct

**Payments:**
- [ ] Donation form accessible
- [ ] Test donation processed
- [ ] Receipt generated
- [ ] Database record created

**WebSocket:**
- [ ] WebSocket server running on port 3002
- [ ] Client connection successful
- [ ] Notification delivery working

**Search:**
- [ ] Public search working
- [ ] Search results accurate
- [ ] Filters working

**SEO:**
- [ ] Sitemap accessible: https://holychurch.mw/sitemap.xml
- [ ] Robots.txt accessible: https://holychurch.mw/robots.txt
- [ ] Metadata correct on homepage
- [ ] Structured data present

### 3. Monitoring Verification

**Application Metrics:**
- [ ] Error rate < 1%
- [ ] Response time < 500ms
- [ ] Uptime 100%

**Database Metrics:**
- [ ] Connection pool healthy
- [ ] Query performance acceptable
- [ ] No slow queries

**System Metrics:**
- [ ] CPU usage < 70%
- [ ] Memory usage < 80%
- [ ] Disk usage < 80%

---

## Rollback Procedure

### Trigger Conditions

Rollback if ANY of the following occur:
- Critical errors affecting all users
- Database corruption
- Payment processing failure
- Security breach detected
- Performance degradation > 50%

### Rollback Steps

```bash
# 1. Stop current deployment
docker-compose down

# 2. Restore previous version
git checkout v1.0.0-previous

# 3. Rebuild
docker-compose build

# 4. Restore database backup
gunzip < /backups/database/holy_church_previous.sql.gz | docker exec -i holy-church-db psql -U holychurch holy_church

# 5. Restart
docker-compose up -d

# 6. Verify
curl https://holychurch.mw
```

### Rollback Verification

- [ ] Application accessible
- [ ] Database operational
- [ ] No critical errors
- [ ] User authentication working

### Post-Rollback Actions

1. Document rollback reason
2. Investigate failure cause
3. Fix issue in staging
4. Re-test thoroughly
5. Schedule new launch attempt

---

## Communication Plan

### Pre-Launch (T-1 Hour)

**Internal:**
- Notify IT team: Launch in 1 hour
- Notify leadership: Launch in 1 hour
- Confirm on-call availability

**External:**
- No communication required

### Launch (T+0)

**Internal:**
- Notify IT team: Launch complete
- Notify leadership: Platform live

**External:**
- Optional: Social media announcement

### Post-Launch (T+30 Minutes)

**Internal:**
- Status update: All systems operational
- Summary of any issues

**External:**
- Optional: Community announcement

---

## Emergency Contacts

**Primary Technical Lead:** [Name] - [Phone] - [Email]  
**Secondary Technical Lead:** [Name] - [Phone] - [Email]  
**Hosting Provider Support:** [Phone] - [Email]  
**Database Provider Support:** [Phone] - [Email]  
**Payment Gateway Support:** [Phone] - [Email]

---

## Launch Summary

**Launch Date:** _______________  
**Launch Time:** _______________  
**Launch Duration:** _______________  
**Launch By:** _______________

**Issues Encountered:**
1. ________________________________________________________
2. ________________________________________________________
3. ________________________________________________________

**Resolution:**
1. ________________________________________________________
2. ________________________________________________________
3. ________________________________________________________

**Rollback Required:** [ ] Yes [ ] No  
**If Yes, Reason:** ________________________________________

**Launch Status:** [ ] SUCCESS [ ] PARTIAL [ ] FAILED

---

## Sign-Off

**Technical Lead:** _______________ Date: _______________  
**Project Manager:** _______________ Date: _______________  
**Senior Pastor:** _______________ Date: _______________
