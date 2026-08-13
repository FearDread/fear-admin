'use client';

import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const typeClasses: Record<ToastType, string> = {
  success: 'alert-success',
  error: 'alert-danger',
  warning: 'alert-warning',
  info: 'alert-info',
};

export const Toast = ({ message, type = 'info', duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`alert ${typeClasses[type]} alert-dismissible fade ${isExiting ? '' : 'show'}`}
      role="alert"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        minWidth: '300px',
        maxWidth: '500px',
        zIndex: 1050,
        transition: 'all 0.3s ease',
        transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
        opacity: isExiting ? 0 : 1,
      }}
    >
      {message}
      <button type="button" className="btn-close" onClick={handleClose} aria-label="Close" />
    </div>
  );
};

export default Toast;
