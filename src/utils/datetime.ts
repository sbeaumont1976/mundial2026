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

// La "jornada" no empieza a medianoche sino a las 03:00 locales: así los
// partidos de madrugada (00:00–02:59) cuentan como el día anterior. Solo afecta
// al marcado de "hoy"; la fecha mostrada (formatDate/formatTime) no cambia.
const DAY_START_HOUR = 3

/** Clave de jornada (año-mes-día) de una fecha, con corte a las 03:00 locales. */
function matchDayKey(d: Date): string {
  const shifted = new Date(d.getTime() - DAY_START_HOUR * 60 * 60 * 1000)
  return `${shifted.getFullYear()}-${shifted.getMonth()}-${shifted.getDate()}`
}

/** ¿El partido pertenece a la jornada de hoy? (ventana 03:00 → 02:59 local) */
export function isToday(iso: string, now: Date = new Date()): boolean {
  return matchDayKey(new Date(iso)) === matchDayKey(now)
}
