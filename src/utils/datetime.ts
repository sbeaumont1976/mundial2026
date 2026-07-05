// Formateo de fechas/horas en español. Todo se muestra en la zona horaria
// local del navegador del visitante a partir del instante ISO del partido.

const dateFmt = new Intl.DateTimeFormat('es-ES', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
})

const timeFmt = new Intl.DateTimeFormat('es-ES', {
  hour: '2-digit',
  minute: '2-digit',
})

const fullFmt = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
})

/** "vie 03 jul" */
export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso))
}

/** "21:00" */
export function formatTime(iso: string): string {
  return timeFmt.format(new Date(iso))
}

/** "viernes, 3 de julio, 21:00" — para tooltips / accesibilidad */
export function formatFull(iso: string): string {
  return fullFmt.format(new Date(iso))
}
