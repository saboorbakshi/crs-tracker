import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <span className="text-7xl sm:text-8xl mb-3">404</span>
      <p className="text-lg sm:text-xl mb-6">Page not found</p>
      <Link href="/" className="underline hover:text-foreground/70">
        Go home
      </Link>
    </div>
  )
}
