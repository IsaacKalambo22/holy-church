import Link from 'next/link'
import Image from 'next/image'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <Image
        src="/logo.png"
        alt="Holy Church Assembly"
        width={72}
        height={72}
        className="mb-6 h-16 w-16 object-contain opacity-90"
      />
      <p className="text-gradient-brand text-6xl font-extrabold tracking-tight sm:text-7xl">404</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        Let&apos;s get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <Link
          href="/sermons"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Sermons
        </Link>
      </div>
    </div>
  )
}
