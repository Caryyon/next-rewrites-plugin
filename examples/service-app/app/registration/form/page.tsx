'use client'
import Link from 'next/link'

export default function RegistrationForm() {
  return (
    <main>
      <h1 style={{ color: '#22c55e', marginBottom: '1rem' }}>
        Registration Form
      </h1>
      
      <p style={{ fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
        This is a nested route in the registration section that demonstrates dynamic path pattern matching.
      </p>
      
      <div style={{ 
        padding: '2rem', 
        backgroundColor: '#f0fdf4', 
        borderRadius: '0.5rem', 
        border: '1px solid #dcfce7' 
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Sign Up Form</h2>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
            <input 
              type="text" 
              id="name" 
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                borderRadius: '0.25rem', 
                border: '1px solid #ccc' 
              }} 
            />
          </div>
          
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
            <input 
              type="email" 
              id="email" 
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                borderRadius: '0.25rem', 
                border: '1px solid #ccc' 
              }} 
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
          >
            Submit
          </button>
        </form>
      </div>
      
      <div style={{ marginTop: '1.5rem' }}>
        <Link href="/registration" style={{ color: '#22c55e' }}>
          &larr; Back to Registration
        </Link>
      </div>
    </main>
  )
}