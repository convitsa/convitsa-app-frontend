'use client';

import { useCallback } from 'react';
import { useAppDispatch } from '../hooks';
import { showToast as showToastAction, Toast } from '../slices/uiSlice';

export function useToast() {
  const dispatch = useAppDispatch();

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'info', duration?: number) => {
      dispatch(showToastAction({ message, type, duration }));
    },
    [dispatch]
  );

  const success = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'success', duration);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'error', duration);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'info', duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'warning', duration);
    },
    [showToast]
  );

  return {
    showToast,
    success,
    error,
    info,
    warning,
  };
}

