import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; as?: 'button' };

type LinkButtonProps = CommonProps & Omit<LinkProps, 'children'> & { as: 'link' };

function classes({ variant = 'primary', size = 'md', fullWidth }: CommonProps, extra?: string) {
  return ['btn', `btn--${variant}`, `btn--${size}`, fullWidth && 'btn--block', extra]
    .filter(Boolean)
    .join(' ');
}

export function Button(props: ButtonProps | LinkButtonProps) {
  if (props.as === 'link') {
    const { as: _as, variant, size, fullWidth, className, children, ...rest } = props;
    return (
      <Link className={classes({ variant, size, fullWidth, children }, className)} {...rest}>
        {children}
      </Link>
    );
  }

  const { as: _as, variant, size, fullWidth, loading, className, children, disabled, type, ...rest } = props;
  return (
    <button
      type={type ?? 'button'}
      className={classes({ variant, size, fullWidth, children }, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}