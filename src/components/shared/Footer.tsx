import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Church } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const footerSections: FooterSection[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Sermons', href: '/sermons' },
      { label: 'Events', href: '/events' },
      { label: 'Ministries', href: '/ministries' },
    ],
  },
  {
    title: 'Ministries',
    links: [
      { label: 'Worship Ministry', href: '/ministries' },
      { label: 'Youth Ministry', href: '/ministries' },
      { label: "Children's Ministry", href: '/ministries' },
      { label: 'Outreach', href: '/ministries' },
      { label: 'Prayer Team', href: '/ministries' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Prayer Requests', href: '/contact' },
      { label: 'Giving', href: '/giving' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Leadership', href: '/leadership' },
    ],
  },
]

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('bg-muted border-t border-border', className)}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                <Church className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-foreground">Holy Church Assembly</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              A place to worship, grow, serve, and belong. Join us as we pursue God together.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm mb-1">Location</p>
              <p className="text-muted-foreground text-sm">Area 18, Lilongwe, Malawi</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm mb-1">Phone</p>
              <p className="text-muted-foreground text-sm">+265 123 456 789</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm mb-1">Email</p>
              <p className="text-muted-foreground text-sm">info@holychurch.mw</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Holy Church Assembly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
