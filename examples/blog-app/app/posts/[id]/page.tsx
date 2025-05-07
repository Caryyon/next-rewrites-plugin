export default function BlogPost({ params }: { params: { id: string } }) {
  // Get the post ID from the URL
  const { id } = params;
  
  // Mock post data
  const posts = {
    '1': {
      title: 'Getting Started with Next.js',
      content: 'Next.js is a React framework for building production-grade applications that scale. This guide will help you understand the basics...'
    },
    '2': {
      title: 'Understanding Multi-Zone Applications',
      content: 'Multi-zone applications allow you to split your Next.js application into smaller, more manageable pieces while still presenting a unified experience to users...'
    },
    '3': {
      title: 'Middleware in Next.js 15',
      content: 'Next.js 15 introduces powerful middleware capabilities that enable you to run code before a request is completed. This opens up new possibilities for authentication, logging, and more...'
    }
  };
  
  // Get the post data or default if not found
  const post = posts[id] || { 
    title: 'Post Not Found', 
    content: 'The requested post could not be found.'
  };

  return (
    <main>
      <h1 style={{ color: '#3b82f6', marginBottom: '1rem' }}>
        {post.title}
      </h1>
      
      <div style={{ 
        marginBottom: '1.5rem',
        padding: '0.5rem',
        backgroundColor: '#eff6ff',
        borderRadius: '0.25rem',
        display: 'inline-block'
      }}>
        Post ID: {id}
      </div>
      
      <p style={{ fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '2rem' }}>
        {post.content}
      </p>
      
      <div>
        <a href="/blog" style={{ color: '#3b82f6' }}>
          &larr; Back to all posts
        </a>
      </div>
    </main>
  );
}