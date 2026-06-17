import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Mail, Phone, Users, ArrowLeft, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { VolunteerSignupForm } from '@/components/shared/VolunteerSignupForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getMinistry(slug: string) {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`
  
  const response = await fetch(`${baseUrl}/api/ministries/slug/${slug}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const result = await response.json()
  return result.data as {
    id: string
    name: string
    slug: string
    description?: string | null
    imageUrl?: string | null
    category?: string | null
    status: string
    meetingSchedule?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    volunteerRequired: boolean
    leader?: { id: string; name: string; avatar?: string | null } | null
  } | null
}

async function getRelatedMinistries(category?: string) {
  const params = new URLSearchParams()
  params.set('limit', '4')
  if (category) params.set('category', category)
  
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`
  
  const response = await fetch(`${baseUrl}/api/ministries?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return []
  }

  const result = await response.json()
  return result.data.slice(0, 3)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const ministry = await getMinistry(params.slug)
  
  if (!ministry) {
    return {
      title: 'Ministry Not Found',
    }
  }

  return {
    title: `${ministry.name} — Holy Church Assembly`,
    description: ministry.description || `Learn more about the ${ministry.name} at Holy Church Assembly.`,
    openGraph: {
      title: ministry.name,
      description: ministry.description || undefined,
      type: 'website',
      images: ministry.imageUrl ? [{ url: ministry.imageUrl }] : undefined,
    },
  }
}

export default async function MinistryDetailsPage({ params }: { params: { slug: string } }) {
  const ministry = await getMinistry(params.slug)
  
  if (!ministry) {
    notFound()
  }

  const relatedMinistries = await getRelatedMinistries(ministry.category || undefined)

  const isActive = ministry.status === 'ACTIVE'

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {ministry.imageUrl ? (
        <div className="relative h-64 md:h-80">
          <img
            src={ministry.imageUrl}
            alt={ministry.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <Link href="/ministries" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Ministries
            </Link>
            <div className="flex items-center gap-3 mb-3">
              {ministry.category && (
                <Badge className="bg-[var(--brand-orange)] border-0 text-white">{ministry.category}</Badge>
              )}
              <Badge variant={isActive ? 'default' : 'secondary'}>
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">{ministry.name}</h1>
          </div>
        </div>
      ) : (
        <div className="gradient-hero py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Link href="/ministries" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Ministries
            </Link>
            <div className="flex items-center gap-3 mb-3">
              {ministry.category && (
                <Badge className="bg-[var(--brand-orange)] border-0 text-white">{ministry.category}</Badge>
              )}
              <Badge variant={isActive ? 'default' : 'secondary'}>
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">{ministry.name}</h1>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {ministry.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">About This Ministry</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{ministry.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Meeting Schedule */}
            {ministry.meetingSchedule && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Meeting Schedule</h2>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">{ministry.meetingSchedule}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Volunteer Signup */}
            {ministry.volunteerRequired && isActive && (
              <VolunteerSignupForm ministryId={ministry.id} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leader Info */}
            {ministry.leader && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-foreground mb-4">Ministry Leader</h3>
                  <div className="flex items-center gap-3">
                    {ministry.leader.avatar && (
                      <img
                        src={ministry.leader.avatar}
                        alt={ministry.leader.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{ministry.leader.name}</p>
                      <p className="text-sm text-muted-foreground">Ministry Leader</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Category */}
            {ministry.category && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-foreground mb-4">Category</h3>
                  <Badge className="bg-[var(--brand-orange)] border-0 text-white">{ministry.category}</Badge>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            {(ministry.contactEmail || ministry.contactPhone) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-foreground mb-4">Contact</h3>
                  <div className="space-y-3">
                    {ministry.contactEmail && (
                      <a
                        href={`mailto:${ministry.contactEmail}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {ministry.contactEmail}
                      </a>
                    )}
                    {ministry.contactPhone && (
                      <a
                        href={`tel:${ministry.contactPhone}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {ministry.contactPhone}
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Volunteer Info */}
            {ministry.volunteerRequired && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-foreground mb-4">Volunteer</h3>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {isActive ? 'We are looking for volunteers!' : 'Volunteer applications are currently closed.'}
                      </p>
                      {isActive && (
                        <p className="text-xs text-muted-foreground">Sign up using the form on the left.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Ministries */}
        {relatedMinistries.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Related Ministries</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedMinistries.map((related: { id: string; slug: string; name: string; description?: string | null; imageUrl?: string | null; leader?: { name: string } | null }) => (
                <Link key={related.id} href={`/ministries/${related.slug}`}>
                  <Card className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <h3 className="font-heading font-semibold text-foreground leading-snug mb-2 line-clamp-2">
                        {related.name}
                      </h3>
                      {related.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{related.description}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
