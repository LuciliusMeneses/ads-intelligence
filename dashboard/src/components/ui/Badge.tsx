/**
 * ADS INTELLIGENCE Components - Badge / StatusBadge
 */
import React from 'react';
import { colors, radius, componentSizes } from '../../styles/tokens';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary' | 'info' | 'outlined' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  dotColor?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot,
  dotColor,
  children,
  className = '',
  ...props
}) => {
  const { height, paddingX, fontSize } = componentSizes.badge[size];

  const variants = {
    default: `bg-${colors.surfaceHover} text-${colors.textSecondary} border border-${colors.border}`,
    success: `bg-${colors.successContainer} text-${colors.successOnContainer} border border-${colors.success}`,
    warning: `bg-${colors.warningContainer} text-${colors.warningOnContainer} border border-${colors.warning}`,
    danger: `bg-${colors.dangerContainer} text-${colors.dangerOnContainer} border border-${colors.danger}`,
    primary: `bg-${colors.primaryContainer} text-${colors.primaryOnContainer} border border-${colors.primary}`,
    info: `bg-${colors.surfaceHover} text-${colors.textPrimary} border border-${colors.border}`,
    outlined: `border-2 border-${colors.border} text-${colors.textPrimary} bg-transparent`,
    secondary: `bg-${colors.surfaceHover} text-${colors.textSecondary} border border-${colors.border}`,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium ${variants[variant]} ${className}`}
      style={{
        height,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        fontSize,
        borderRadius: radius.full,
      }}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor: dotColor || (
              variant === 'success' ? colors.success :
              variant === 'warning' ? colors.warning :
              variant === 'danger' ? colors.danger :
              variant === 'primary' ? colors.primary :
              colors.textSecondary
            )
          }}
        />
      )}
      {children}
    </span>
  );
};

interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'scaling' | 'paused' | 'error' | 'learning' | 'attention' | 'draft' | 'pending';
}

const statusConfig = {
  active: { variant: 'success', label: 'Ativa', dot: true, dotColor: colors.success },
  scaling: { variant: 'primary', label: 'Em escala', dot: true, dotColor: colors.primary },
  paused: { variant: 'default', label: 'Pausada', dot: true, dotColor: colors.textTertiary },
  error: { variant: 'danger', label: 'Erro', dot: true, dotColor: colors.danger },
  learning: { variant: 'info', label: 'Aprendizado', dot: true, dotColor: colors.primary },
  attention: { variant: 'warning', label: 'Atenção', dot: true, dotColor: colors.warning },
  draft: { variant: 'default', label: 'Rascunho', dot: true, dotColor: colors.textTertiary },
  pending: { variant: 'info', label: 'Pendente', dot: true, dotColor: colors.primary },
} as const;

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
  ...props
}) => {
  const config = statusConfig[status] || statusConfig.draft;
  return <Badge variant={config.variant} size={size} dot={config.dot} dotColor={config.dotColor} className={className} {...props}>{config.label}</Badge>;
};