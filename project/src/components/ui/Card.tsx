import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, hover = false, className = '', onClick }: CardProps) => {
  return (
    <div
      className={`${hover ? 'card-hover cursor-pointer' : 'card'} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
