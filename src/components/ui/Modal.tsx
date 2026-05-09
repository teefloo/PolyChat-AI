import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  children,
  className = '',
}) => {
  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [onClose, closeOnEscape]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    fullscreen: 'max-w-full h-full rounded-none',
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Overlay background for closing */}
      <div
        className="absolute inset-0"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`modal-container ${sizes[size]} ${className}`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="modal-header">
            <div className="flex items-center gap-3">
              {icon && (
                <div
                  className="polychat-logo-sm"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(127, 163, 198, 0.12)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                  }}
                >
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h2 id="modal-title" className="modal-title">
                    {title}
                  </h2>
                )}
                {subtitle && <p className="text-sm text-tertiary">{subtitle}</p>}
              </div>
            </div>
            {showCloseButton && (
              <button onClick={onClose} className="modal-close-btn" aria-label="Fermer">
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="modal-body">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="modal-footer" style={{ background: 'var(--hover-overlay)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
