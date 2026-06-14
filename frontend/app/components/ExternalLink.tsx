import React from 'react'

interface ExternalLinkProps {
  href: string
  children: React.ReactNode
}

export default function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={'text-foreground hover:text-foreground/70 underline'}
    >
      {children}
    </a>
  )
}
