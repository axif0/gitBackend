import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        className={`peer w-full px-4 py-3 bg-cream border rounded-xl text-ink font-bengali transition-all duration-200 outline-none placeholder-transparent
          ${error ? 'border-red-400' : 'border-sakura-200/60 focus:border-sakura-600 focus:ring-2 focus:ring-sakura-600/10'}
          ${className}`}
        placeholder={label || ' '}
        {...props}
      />
      {label && (
        <label className="absolute left-4 top-3 text-sm text-sakura-400 pointer-events-none transition-all duration-200
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
          peer-focus:top-0.5 peer-focus:text-xs peer-focus:text-sakura-600
          peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-sakura-600
          bg-cream px-1">
          {label}
        </label>
      )}
      {error && <p className="text-red-500 text-xs mt-1 font-bengali">{error}</p>}
    </div>
  );
}
