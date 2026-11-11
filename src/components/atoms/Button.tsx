import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type ButtonVariant = 'primary' | 'secondary' | 'subtle' | 'ghost' | 'surface' | 'danger'
/** sm 36px · md 40px (padrão desktop) · lg 48px · xl 56px (alvos de toque mobile). */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
export type ButtonShape = 'rounded' | 'pill'

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  /** Ícone à esquerda (nome Material Symbols). */
  icon?: string
  trailingIcon?: string
  /** Mostra só o ícone. Exige `aria-label`. */
  iconOnly?: boolean
  fullWidth?: boolean
  className?: string
  children?: ReactNode
}

type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined }
type AsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string }

export type ButtonProps = AsButton | AsLink

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary shadow-sm hover:bg-primary-container',
  secondary:
    'bg-surface-container-lowest text-primary ring-1 ring-inset ring-outline-variant hover:bg-surface-container-low',
  subtle:
    'bg-surface-container-low text-on-surface hover:bg-secondary-container hover:text-on-secondary-container',
  ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
  surface: 'bg-surface-container-lowest text-primary shadow-sm hover:bg-white',
  danger: 'bg-error text-on-error shadow-sm hover:bg-error/90',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 gap-1.5 text-label-md',
  md: 'h-10 px-4 gap-2 text-label-lg',
  lg: 'h-12 px-5 gap-2 text-label-lg',
  xl: 'h-14 px-6 gap-2 text-label-lg',
}

const ICON_ONLY_SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-14 w-14',
}

const ICON_PX: Record<ButtonSize, number> = { sm: 18, md: 20, lg: 22, xl: 26 }

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    shape = 'rounded',
    icon,
    trailingIcon,
    iconOnly = false,
    fullWidth = false,
    className,
    children,
    ...rest
  } = props

  const classes = cn(
    'inline-flex shrink-0 items-center justify-center font-semibold transition-all active:scale-[0.98]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant],
    iconOnly ? ICON_ONLY_SIZES[size] : SIZES[size],
    shape === 'pill' || iconOnly ? 'rounded-full' : 'rounded-xl',
    fullWidth && 'w-full',
    className,
  )

  const content = (
    <>
      {icon && <Icon name={icon} size={ICON_PX[size]} />}
      {!iconOnly && children}
      {trailingIcon && !iconOnly && <Icon name={trailingIcon} size={ICON_PX[size] - 2} />}
    </>
  )

  if (rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
}
