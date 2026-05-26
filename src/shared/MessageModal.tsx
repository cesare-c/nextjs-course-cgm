import { useEffect } from 'react';

export type ModalType = 'success' | 'error' | 'info';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: ModalType;
  showCancel?: boolean;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function MessageModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  showCancel = false,
  onConfirm,
  confirmLabel,
  cancelLabel
}: MessageModalProps) {
  // Listen for Escape key to close the modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Determine icon and color based on the type
  const renderIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg
            style={{ width: '48px', height: '48px', color: '#10b981', marginBottom: '16px' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'error':
        return (
          <svg
            style={{ width: '48px', height: '48px', color: '#ef4444', marginBottom: '16px' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg
            style={{ width: '48px', height: '48px', color: 'var(--accent, #aa3bff)', marginBottom: '16px' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  // Get color for type-based top border or highlights
  const getTypeColor = () => {
    if (type === 'success') return '#10b981';
    if (type === 'error') return '#ef4444';
    return 'var(--accent, #aa3bff)';
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
    >
      {/* Backdrop with fade-in and backdrop-blur */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          animation: 'modal-fade-in 0.2s ease-out forwards',
        }}
      />

      {/* Modal Card with slide-up and fade-in */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--bg, #fff)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow, 0 10px 25px rgba(0, 0, 0, 0.15))',
          padding: '28px 24px',
          textAlign: 'center',
          border: '1px solid var(--border, #e5e4e7)',
          borderTop: `6px solid ${getTypeColor()}`,
          animation: 'modal-slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          boxSizing: 'border-box',
        }}
      >
        {/* Close Icon (Top-right corner) */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: 'var(--text, #6b6375)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background-color 0.2s',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-bg, rgba(170, 59, 255, 0.1))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Chiudi modale"
        >
          <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l18 18" />
          </svg>
        </button>

        {/* Icon & Title */}
        {renderIcon()}
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-h, #08060d)',
            fontFamily: 'var(--heading, sans-serif)',
          }}
        >
          {title}
        </h3>

        {/* Message */}
        <p
          style={{
            margin: '0 0 24px 0',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            color: 'var(--text, #6b6375)',
            fontFamily: 'var(--sans, sans-serif)',
          }}
        >
          {message}
        </p>

        {/* Action Buttons */}
        {showCancel ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: 'var(--text, #6b6375)',
                border: '1px solid var(--border, #e5e4e7)',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--code-bg, #f4f3ec)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {cancelLabel || 'Annulla'}
            </button>
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: getTypeColor(),
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'opacity 0.2s, transform 0.1s',
                outline: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {confirmLabel || 'Conferma'}
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: getTypeColor(),
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'opacity 0.2s, transform 0.1s',
              outline: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            OK
          </button>
        )}
      </div>

      {/* Inline styles for keyframe animations */}
      <style>{`
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
