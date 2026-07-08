import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Phone, Youtube, Facebook, Instagram, Twitter } from 'lucide-react'

const footerLinks = {
  Church: [
    { href: '/about', label: 'About Us' },
    { href: '/leadership', label: 'Leadership' },
    { href: '/ministries', label: 'Ministries' },
    { href: '/services', label: 'Service Times' },
  ],
  Resources: [
    { href: '/sermons', label: 'Sermons' },
    { href: '/blog', label: 'Blog' },
    { href: '/events', label: 'Events' },
    { href: '/gallery', label: 'Gallery' },
  ],
  Connect: [
    { href: '/prayer-requests', label: 'Prayer Requests' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/giving', label: 'Give Online' },
    { href: '/newsletter', label: 'Newsletter' },
  ],
}

const socialLinks = [
  { href: '#', icon: Youtube, label: 'YouTube' },
  { href: '#', icon: Facebook, label: 'Facebook' },
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Twitter, label: 'Twitter/X' },
]

export function Footer() {
  return (
    <footer className="bg-[var(--brand-indigo)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <Image
                src="/logo.png"
                alt="Holy Church Assembly"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <div>
                <p className="font-heading font-bold text-lg">Holy Church Assembly</p>
                <p className="text-xs text-white/60">A House of Prayer for All Nations</p>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs mb-6">
              Welcome home. A place where every soul finds grace, every heart finds healing,
              and every life finds purpose.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="flex flex-col md:flex-row gap-4 py-8 border-b border-white/10 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--brand-orange)] flex-shrink-0" />
            123 Faith Avenue, Lilongwe, Malawi
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[var(--brand-orange)] flex-shrink-0" />
            +265 999 000 000
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[var(--brand-orange)] flex-shrink-0" />
            hello@holychurch.mw
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-sm text-white/40">
          <p>© {new Date().getFullYear()} Holy Church Assembly. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
