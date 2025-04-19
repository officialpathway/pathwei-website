// src/components/LanguageSwitcher.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
  const pathname = usePathname()
  
  const redirectedPathName = (locale: string) => {
    if (!pathname) return '/'
    const segments = pathname.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  return (
    <div className="flex gap-2">
      <Link href={redirectedPathName('en')}>English</Link>
      <Link href={redirectedPathName('es')}>Español</Link>
    </div>
  )
}