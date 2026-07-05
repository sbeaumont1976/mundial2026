interface FlagProps {
  /** Código flag-icons: 'es', 'ar', 'gb-eng'… */
  code?: string
  title?: string
}

/**
 * Bandera SVG vía flag-icons. Se renderiza igual en todos los sistemas
 * (los emoji de bandera no funcionan en Windows).
 */
export function Flag({ code, title }: FlagProps) {
  if (!code) {
    return <span className="flag flag--empty" aria-hidden="true" />
  }
  return (
    <span
      className={`flag fi fi-${code}`}
      role="img"
      aria-label={title ?? code}
      title={title}
    />
  )
}
