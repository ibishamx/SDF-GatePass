/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Desktop Keyboard Shortcuts Manager
 */

import { useEffect } from 'react';

interface ShortcutOptions {
  onNewPass?: () => void;
  onSave?: () => void;
  onPrint?: () => void;
  onSearch?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  onEscape?: () => void;
}

export const useKeyboardShortcuts = (options: ShortcutOptions) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Ctrl + N -> New Pass
      if (isCtrlOrCmd && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        options.onNewPass?.();
      }

      // Ctrl + S -> Save
      if (isCtrlOrCmd && e.key.toLowerCase() === 's') {
        e.preventDefault();
        options.onSave?.();
      }

      // Ctrl + P -> Print
      if (isCtrlOrCmd && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        options.onPrint?.();
      }

      // Ctrl + F or Ctrl + K -> Search
      if (isCtrlOrCmd && (e.key.toLowerCase() === 'f' || e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        options.onSearch?.();
      }

      // Ctrl + E -> Export
      if (isCtrlOrCmd && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        options.onExport?.();
      }

      // F5 -> Refresh
      if (e.key === 'F5') {
        e.preventDefault();
        options.onRefresh?.();
      }

      // Escape -> Close
      if (e.key === 'Escape') {
        options.onEscape?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options]);
};
