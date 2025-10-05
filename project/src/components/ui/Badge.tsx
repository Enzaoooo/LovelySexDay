import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'featured' | 'promo' | 'new' | 'default';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    featured: 'badge-featured',
    promo: 'badge-promo',
    new: 'badge-new',
    default: 'badge bg-neutral-200 text-neutral-700',
  };

  return (
    <span className={`${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
