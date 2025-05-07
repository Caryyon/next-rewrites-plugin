'use client'

import { CrossZoneLink } from '../components/CrossZoneLink'
import { useState, useEffect } from 'react'

export default function Home() {
  const [featureFlag, setFeatureFlag] = useState(false)
  
  // Check current feature flag state on load
  useEffect(() => {
    fetch('/api/feature-flags')
      .then(response => response.json())
      .then(data => {
        if (data.NEW_REGISTRATION) {
          setFeatureFlag(true);
        }
      })
      .catch(error => console.error('Error fetching feature flags:', error));
  }, [])
  
  const toggleFeatureFlag = async () => {
    const newValue = !featureFlag;
    setFeatureFlag(newValue);
    
    // Update the feature flag via API
    try {
      const response = await fetch('/api/feature-flags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ NEW_REGISTRATION: newValue })
      });
      
      if (response.ok) {
        console.log('Feature flag updated. You may need to reload the page to see the effect.');
      } else {
        console.error('Failed to update feature flag');
      }
    } catch (error) {
      console.error('Error updating feature flag:', error);
    }
  }

  return (
    <main>
      <h1 style={{ color: '#0070f3', marginBottom: '1rem' }}>
        Main Application
      </h1>
      
      <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
        This is the main application in the multi-zone setup. It uses <code>next-rewrites-plugin</code> to 
        dynamically handle rewrites to the service app.
      </p>
      
      <div style={{ margin: '2rem 0', padding: '1.5rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Test Rewrites</h2>
        <p>Try these links to test the rewrites:</p>
        
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <CrossZoneLink href="/registration" hardNavigation={true} style={{ color: '#0070f3' }}>
              Registration
            </CrossZoneLink> 
            {' '} - Should rewrite to service app on port 3001
          </li>
          <li>
            <CrossZoneLink href="/blog" hardNavigation={true} style={{ color: '#0070f3' }}>
              Blog
            </CrossZoneLink> 
            {' '} - Should rewrite to blog app on port 3002
          </li>
          <li>
            <CrossZoneLink href="/settings" style={{ color: '#0070f3' }}>
              Settings
            </CrossZoneLink>
            {' '} - Regular page in this app (not rewritten)
          </li>
        </ul>
        
        <button 
          onClick={toggleFeatureFlag}
          style={{
            backgroundColor: featureFlag ? '#10b981' : '#9ca3af',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          {featureFlag ? 'Disable' : 'Enable'} NEW_REGISTRATION Feature Flag
        </button>
      </div>
    </main>
  )
}