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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
        <h3 className="text-lg font-semibold mb-2 font-bangla">{title}</h3>
        <p className="text-gray-600 mb-6 font-bangla">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary text-sm">বাতিল</button>
          <button onClick={onConfirm} className="btn-danger text-sm">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
