export default function ServiceHome() {
  return (
    <main>
      <h1 style={{ color: '#22c55e', marginBottom: '1rem' }}>
        Service Application Home
      </h1>
      
      <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
        This is the service application running on a different port (3001).
        It's part of the multi-zone setup and is accessed via rewrites from the main app.
      </p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #dcfce7' }}>
        <p>
          <strong>Direct URL:</strong> <code>http://localhost:3001</code>
        </p>
      </div>
    </main>
  )
}