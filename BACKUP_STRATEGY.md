# Backup Strategy — Holy Church Assembly

**Generated:** Phase 23 - Production Deployment  
**Date:** 2026-06-17

---

## Overview

This document outlines the backup strategy for the Holy Church Assembly platform to ensure data integrity and business continuity.

---

## Backup Components

### 1. Database Backups

**Type:** PostgreSQL  
**Location:** Container volume `postgres_data`  
**Backup Method:** pg_dump

**Backup Schedule:**
- **Daily Full Backups:** 2:00 AM UTC
- **Hourly Incremental Backups:** Every 6 hours
- **Real-time WAL Archiving:** Continuous

**Retention Policy:**
- Daily backups: Retain 7 days
- Weekly backups: Retain 4 weeks
- Monthly backups: Retain 12 months
- Yearly backups: Retain 7 years

**Backup Storage:**
- Local: `/backups/database/`
- Remote: Cloud storage (S3-compatible) - Recommended for production

**Backup Command:**
```bash
# Full backup
docker exec holy-church-db pg_dump -U holychurch holy_church > /backups/database/holy_church_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
docker exec holy-church-db pg_dump -U holychurch holy_church | gzip > /backups/database/holy_church_$(date +%Y%m%d_%H%M%S).sql.gz
```

**Restore Procedure:**
```bash
# Restore from backup
docker exec -i holy-church-db psql -U holychurch holy_church < /backups/database/holy_church_YYYYMMDD_HHMMSS.sql

# Restore from compressed backup
gunzip < /backups/database/holy_church_YYYYMMDD_HHMMSS.sql.gz | docker exec -i holy-church-db psql -U holychurch holy_church
```

---

### 2. Media Backups

**Type:** User-uploaded images, videos, documents  
**Location:** `public/uploads/` (if local) or cloud storage

**Backup Schedule:**
- **Daily Full Backups:** 3:00 AM UTC

**Retention Policy:**
- Daily backups: Retain 30 days
- Monthly backups: Retain 12 months

**Backup Method:**
```bash
# If using local storage
rsync -avz /path/to/public/uploads/ /backups/media/uploads_$(date +%Y%m%d)/

# If using cloud storage (S3)
aws s3 sync s3://holychurch-uploads /backups/media/uploads_$(date +%Y%m%d)/
```

**Restore Procedure:**
```bash
# Restore from local backup
rsync -avz /backups/media/uploads_YYYYMMDD/ /path/to/public/uploads/

# Restore from cloud storage
aws s3 sync /backups/media/uploads_YYYYMMDD/ s3://holychurch-uploads
```

---

### 3. Configuration Backups

**Type:** Environment variables, configuration files  
**Location:** `.env`, `next.config.ts`, `prisma/schema.prisma`

**Backup Schedule:**
- **Before any configuration change**
- **Weekly automated backup**

**Retention Policy:**
- Retain 90 days

**Backup Method:**
```bash
# Backup configuration
tar -czf /backups/config/config_$(date +%Y%m%d_%H%M%S).tar.gz .env next.config.ts prisma/schema.prisma
```

**Restore Procedure:**
```bash
# Restore configuration
tar -xzf /backups/config/config_YYYYMMDD_HHMMSS.tar.gz
```

---

### 4. Application Code Backups

**Type:** Source code, dependencies  
**Location:** Git repository

**Backup Method:**
- Git repository serves as primary backup
- Remote repository (GitHub/GitLab) required
- Tag releases for production deployments

**Retention Policy:**
- Indefinite (Git history)

**Backup Procedure:**
```bash
# Tag production release
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

---

## Backup Validation

### Weekly Validation Tasks

1. **Database Backup Integrity**
   - Restore latest backup to test environment
   - Verify data integrity
   - Run critical queries to validate

2. **Media Backup Integrity**
   - Verify backup file count matches source
   - Random sample verification of files
   - Check file sizes

3. **Configuration Backup Integrity**
   - Verify backup files are not corrupted
   - Compare with current configuration

### Monthly Validation Tasks

1. **Full Restore Test**
   - Perform full database restore to staging
   - Verify application functionality
   - Test critical user journeys

2. **Backup Performance Test**
   - Measure backup duration
   - Measure restore duration
   - Identify performance bottlenecks

---

## Backup Monitoring

### Alerts Required

- **Backup Failure:** Immediate alert
- **Backup Duration Exceeded:** Warning if > 2x normal duration
- **Backup Size Anomaly:** Warning if > 2x normal size
- **Restore Failure:** Immediate alert

### Monitoring Metrics

- Backup success rate
- Backup duration
- Backup size
- Restore success rate
- Restore duration

---

## Disaster Recovery Integration

This backup strategy is part of the broader disaster recovery plan documented in `DISASTER_RECOVERY.md`.

---

## Backup Automation

### Recommended Cron Jobs

```bash
# Daily database backup at 2:00 AM UTC
0 2 * * * /scripts/backup_database.sh

# Hourly incremental backup
0 */6 * * * /scripts/backup_database_incremental.sh

# Daily media backup at 3:00 AM UTC
0 3 * * * /scripts/backup_media.sh

# Weekly configuration backup on Sunday at 4:00 AM UTC
0 4 * * 0 /scripts/backup_config.sh

# Weekly backup cleanup on Sunday at 5:00 AM UTC
0 5 * * 0 /scripts/cleanup_old_backups.sh
```

---

## Cloud Storage Integration (Recommended for Production)

### AWS S3 Configuration

```bash
# Create S3 bucket
aws s3 mb s3://holychurch-backups

# Enable versioning
aws s3api put-bucket-versioning --bucket holychurch-backups --versioning-configuration Status=Enabled

# Enable lifecycle policy (90-day retention)
aws s3api put-bucket-lifecycle-configuration --bucket holychurch-backups --lifecycle-configuration file://lifecycle.json
```

### Backup to S3

```bash
# Upload database backup to S3
aws s3 cp /backups/database/holy_church_YYYYMMDD_HHMMSS.sql.gz s3://holychurch-backups/database/

# Upload media backup to S3
aws s3 sync /backups/media/uploads_YYYYMMDD/ s3://holychurch-backups/media/
```

---

## Security Considerations

1. **Encryption:** Backups should be encrypted at rest
2. **Access Control:** Restrict backup access to authorized personnel
3. **Secure Transfer:** Use encrypted transfer (SFTP, HTTPS)
4. **Backup Keys:** Store encryption keys separately from backups

---

## Compliance

This backup strategy supports:
- Data retention requirements
- Data recovery requirements
- Business continuity requirements

---

## Next Steps

1. Implement backup scripts
2. Configure cron jobs
3. Set up cloud storage (recommended)
4. Configure monitoring and alerts
5. Perform initial backup validation
6. Document backup locations and access procedures
