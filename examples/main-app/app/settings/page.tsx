import Link from 'next/link'

export default function Settings() {
  return (
    <main>
      <h1 style={{ color: '#0070f3', marginBottom: '1rem' }}>
        Settings Page
      </h1>
      
      <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
        This is a regular page in the main app that doesn't use rewrites.
      </p>
      
      <div style={{ marginTop: '2rem' }}>
        <Link href="/" style={{ color: '#0070f3' }}>
          Go back to home
        </Link>
      </div>
    </main>
  )
}