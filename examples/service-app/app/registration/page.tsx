'use client'
import Link from 'next/link'

export default function Registration() {
  return (
    <main>
      <h1 style={{ color: '#22c55e', marginBottom: '1rem' }}>
        Registration Page
      </h1>
      
      <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
        This is the registration page in the service app. It should be accessible via a rewrite
        from the main app if the feature flag is enabled.
      </p>
      
      <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
        <Link href="/registration/form" style={{ 
          display: 'inline-block',
          backgroundColor: '#22c55e',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.25rem',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Go to Registration Form
        </Link>
        <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#666' }}>
          This link should work both directly and through rewrites if configured properly
        </p>
      </div>
      
      <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #dcfce7' }}>
        <p>
          <strong>Direct URL:</strong> <code>http://localhost:3001/registration</code><br />
          <strong>Via rewrite:</strong> <code>http://localhost:3000/registration</code> (if feature flag enabled)
        </p>
      </div>
    </main>
  )
}