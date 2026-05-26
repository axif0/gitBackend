import React from 'react';

type Variant = 'primary' | 'gold' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-deep-rose text-cream hover:bg-sakura-600 active:scale-[0.97] shadow-sm hover:shadow-md',
  gold: 'bg-gold-primary text-cream hover:bg-[#9A7009] active:scale-[0.97] shadow-sm hover:shadow-md',
  outline: 'bg-transparent border-[1.5px] border-sakura-400 text-sakura-600 hover:bg-sakura-100 active:scale-[0.97]',
  ghost: 'bg-transparent text-sakura-600 hover:bg-sakura-100 active:scale-[0.97]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 font-bengali disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
