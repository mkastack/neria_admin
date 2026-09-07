'use client';

import { Modal } from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  destructive = true,
  busy = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} subtitle={message} maxWidth="sm">
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} disabled={busy} className="neria-btn-secondary px-4 py-2 text-xs font-semibold">
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors disabled:opacity-60 ${destructive ? 'bg-[#B42318] hover:bg-[#912018]' : 'neria-btn-primary'}`}
        >
          {busy ? 'Working...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
