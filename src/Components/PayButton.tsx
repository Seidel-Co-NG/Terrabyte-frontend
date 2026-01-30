import * as React from 'react';

export interface PayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button label. Defaults to "Continue" if neither text nor children provided */
  children?: React.ReactNode;
  /** Button label (overrides children when set). Use "Continue" or "Pay", etc. Default when neither text nor children: "Continue" */
  text?: string;
  /** Show loading state and optional loading text */
  loading?: boolean;
  loadingText?: string;
  /** Full width (e.g. for form submit buttons) */
  fullWidth?: boolean;
}

const PayButton = React.forwardRef<HTMLButtonElement, PayButtonProps>(
  ({ children, text, loading = false, loadingText, fullWidth = false, disabled, className = '', ...props }, ref) => {
    const isDisabled = disabled || loading;
    const label = text ?? 'Continue';

    return (
      <button
        ref={ref}
        type={props.type ?? 'button'}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold text-white
          bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]
          shadow-[0_4px_12px_var(--accent-hover)]
          hover:opacity-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50
          transition-opacity
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `.trim()}
        {...props}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
            {loadingText ?? label}
          </>
        ) : (
          label
        )}
      </button>
    );
  }
);

PayButton.displayName = 'PayButton';

export default PayButton;
