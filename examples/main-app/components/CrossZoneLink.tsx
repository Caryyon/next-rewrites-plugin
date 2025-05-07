import React from 'react';
import Link from 'next/link';

// This component enables proper cross-zone navigation in multi-zone setups
// It falls back to a regular <a> tag when hardNavigation is enabled
// as recommended in Next.js multi-zone documentation

interface CrossZoneLinkProps {
  href: string;
  hardNavigation?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const CrossZoneLink: React.FC<CrossZoneLinkProps> = ({ 
  href, 
  hardNavigation = false,
  children,
  ...props 
}) => {
  // If hardNavigation is enabled, use a regular <a> tag for hard navigation
  if (hardNavigation) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  
  // Otherwise use Next.js Link component for client-side navigation
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
};