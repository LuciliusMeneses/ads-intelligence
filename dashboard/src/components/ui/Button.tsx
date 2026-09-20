/**
 * ADS INTELLIGENCE Components - BaseButton
 */
import React from 'react';
import { colors, radius, componentSizes } from '../../styles/tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const { height, paddingX, fontSize } = componentSizes.button[size];

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: `bg-${colors.primary} text-white hover:bg-${colors.primaryHover} shadow-sm`,
    secondary: `bg-${colors.success} text-white hover:bg-${colors.successHover} shadow-sm`,
    outlined: `border border-${colors.border} text-${colors.textPrimary} hover:bg-${colors.surfaceHover}`,
    ghost: `text-${colors.textPrimary} hover:bg-${colors.surfaceHover}`,
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{
        height,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        fontSize,
        borderRadius: radius.DEFAULT,
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? '...' : children}
    </button>
  );
};
