export default function BlogHome() {
  return (
    <main>
      <h1 style={{ color: '#3b82f6', marginBottom: '1rem' }}>
        Blog App Home
      </h1>
      
      <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
        This is the blog application running on port 3002.
        It's part of the multi-zone setup and is accessed via rewrites from the main app.
      </p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #dbeafe' }}>
        <p>
          <strong>Direct URL:</strong> <code>http://localhost:3002/blog</code><br />
          <strong>Via rewrite:</strong> <code>http://localhost:3000/blog</code>
        </p>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#3b82f6', marginBottom: '1rem' }}>Recent Posts</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <a href="/blog/posts/1" style={{ color: '#3b82f6' }}>
              Getting Started with Next.js
            </a>
          </li>
          <li>
            <a href="/blog/posts/2" style={{ color: '#3b82f6' }}>
              Understanding Multi-Zone Applications
            </a>
          </li>
          <li>
            <a href="/blog/posts/3" style={{ color: '#3b82f6' }}>
              Middleware in Next.js 15
            </a>
          </li>
        </ul>
      </div>
    </main>
  )
}