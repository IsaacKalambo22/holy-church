import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data (in development)
  await prisma.newsletterSubscriber.deleteMany()
  await prisma.contactMessage.deleteMany()
  await prisma.ministry.deleteMany()
  await prisma.podcast.deleteMany()
  await prisma.prayerRequest.deleteMany()
  await prisma.blog.deleteMany()
  await prisma.donation.deleteMany()
  await prisma.gallery.deleteMany()
  await prisma.event.deleteMany()
  await prisma.sermon.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Cleaned existing data')

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@holychurch.mw',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isVerified: true,
    },
  })

  const admin = await prisma.user.create({
    data: {
      email: 'pastor@holychurch.mw',
      password: hashedPassword,
      name: 'Pastor John Banda',
      role: 'ADMIN',
      isVerified: true,
    },
  })

  const member = await prisma.user.create({
    data: {
      email: 'member@example.com',
      password: hashedPassword,
      name: 'Grace Phiri',
      role: 'MEMBER',
      isVerified: true,
    },
  })

  console.log('✅ Created users')

  // Create sermons
  const sermon1 = await prisma.sermon.create({
    data: {
      title: 'Walking in the Spirit',
      slug: 'walking-in-the-spirit',
      description: 'A powerful message about living by the Holy Spirit',
      series: 'Faith Series',
      published: true,
      views: 150,
      preacherId: admin.id,
    },
  })

  const sermon2 = await prisma.sermon.create({
    data: {
      title: 'The Grace of God',
      slug: 'the-grace-of-god',
      description: 'Understanding God\'s unmerited favor',
      series: 'Grace Series',
      published: true,
      views: 200,
      preacherId: admin.id,
    },
  })

  console.log('✅ Created sermons')

  // Create events
  await prisma.event.createMany({
    data: [
      {
        title: 'Annual Church Convention',
        slug: 'annual-church-convention',
        description: 'Three days of powerful worship and teaching',
        excerpt: 'Join us for three days of powerful worship, teaching, and fellowship.',
        date: new Date('2026-07-04'),
        endDate: new Date('2026-07-06'),
        location: 'Main Sanctuary',
        venue: 'Main Sanctuary',
        category: 'Convention',
        status: 'PUBLISHED',
        registrationRequired: true,
        registrationDeadline: new Date('2026-07-01'),
      },
      {
        title: 'Youth Worship Night',
        slug: 'youth-worship-night',
        description: 'An electric night of worship for the next generation',
        excerpt: 'An electric night of worship, spoken word, and community for youth.',
        date: new Date('2026-06-27'),
        location: 'Youth Center',
        venue: 'Youth Center',
        category: 'Youth',
        status: 'PUBLISHED',
        registrationRequired: false,
      },
      {
        title: 'Community Outreach Day',
        slug: 'community-outreach-day',
        description: 'Serving our city with love and practical help',
        excerpt: 'Join us as we serve our city with free food, medical checkups, and community care.',
        date: new Date('2026-06-22'),
        location: 'Area 18, Lilongwe',
        venue: 'Area 18 Community Center',
        category: 'Outreach',
        status: 'PUBLISHED',
        registrationRequired: false,
      },
    ],
  })

  console.log('✅ Created events')

  // Create ministries
  await prisma.ministry.createMany({
    data: [
      {
        name: 'Worship Ministry',
        slug: 'worship-ministry',
        description: 'Leading hearts into the presence of God through music',
        category: 'Worship',
        status: 'ACTIVE',
        meetingSchedule: 'Sundays 2:00 PM, Thursdays 6:00 PM',
        contactEmail: 'worship@holychurch.mw',
        volunteerRequired: true,
        leaderId: admin.id,
      },
      {
        name: 'Young Adults',
        slug: 'young-adults',
        description: 'A vibrant community for ages 18–35',
        category: 'Youth',
        status: 'ACTIVE',
        meetingSchedule: 'Fridays 7:00 PM',
        contactEmail: 'youngadults@holychurch.mw',
        volunteerRequired: true,
        leaderId: admin.id,
      },
      {
        name: "Children's Ministry",
        slug: 'childrens-ministry',
        description: 'Building faith foundations for kids ages 3–12',
        category: 'Children',
        status: 'ACTIVE',
        meetingSchedule: 'Sundays 10:00 AM',
        contactEmail: 'children@holychurch.mw',
        volunteerRequired: true,
        leaderId: admin.id,
      },
    ],
  })

  console.log('✅ Created ministries')

  // Create blog posts
  await prisma.blog.createMany({
    data: [
      {
        title: 'Finding Peace in Uncertain Times',
        content: 'Discover how Scripture guides us through life\'s most challenging seasons...',
        slug: 'finding-peace-in-uncertain-times',
        published: true,
        publishedAt: new Date('2026-06-15'),
        authorId: admin.id,
      },
      {
        title: 'Why Community is Essential to Faith',
        content: 'We were never designed to do life alone...',
        slug: 'why-community-is-essential-to-faith',
        published: true,
        publishedAt: new Date('2026-06-10'),
        authorId: admin.id,
      },
    ],
  })

  console.log('✅ Created blog posts')

  // Create prayer requests
  await prisma.prayerRequest.createMany({
    data: [
      {
        request: 'Please pray for my family as we navigate a difficult health situation.',
        status: 'PENDING',
        userId: member.id,
      },
      {
        request: 'Pray for wisdom as I make an important career decision.',
        status: 'PENDING',
        userId: member.id,
      },
    ],
  })

  console.log('✅ Created prayer requests')

  // Create donations
  await prisma.donation.createMany({
    data: [
      {
        amount: 5000,
        category: 'general',
        donorId: member.id,
        message: 'Thank you for all you do.',
      },
      {
        amount: 10000,
        category: 'missions',
        donorId: member.id,
      },
    ],
  })

  console.log('✅ Created donations')

  // Create gallery
  await prisma.gallery.create({
    data: {
      caption: 'Sunday Worship Service',
      imageUrls: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    },
  })

  console.log('✅ Created gallery')

  // Create newsletter subscribers
  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: 'subscriber1@example.com' },
      { email: 'subscriber2@example.com' },
    ],
  })

  console.log('✅ Created newsletter subscribers')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
