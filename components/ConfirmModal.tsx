'use client';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
}

export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmText = 'মুছে ফেলুন' }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative card p-6 max-w-md w-full animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-2 font-bengali" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="mb-6 font-bengali" style={{ color: 'var(--text-secondary)' }}>{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary text-sm">বাতিল</button>
          <button onClick={onConfirm} className="btn-danger text-sm">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
