import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, children, title, maxWidth = 'md' }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <>
      <div className="overlay animate-fade-in" onClick={onClose} />
      <div className="modal animate-fade-in">
        <div className={`modal-content animate-scale-in ${maxWidthClasses[maxWidth]} w-full`}>
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h3 className="text-xl font-display font-semibold text-neutral-900">{title}</h3>
              <button
                onClick={onClose}
                className="btn-icon"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          {!title && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 btn-icon z-10 text-black"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
