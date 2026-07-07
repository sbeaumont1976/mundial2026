import { Bracket } from './components/Bracket'
import { useBracket } from './hooks/useBracket'

export function App() {
  const { bracket, loading, error, source, live } = useBracket()

  return (
    <div className="app">
      <div className="app__bg" aria-hidden="true" />

      <header className="app__header">
        <div className="app__brand">
          <span className="app__kicker">FIFA World Cup</span>
          <h1 className="app__title">
            Mundial <span className="app__year">2026</span>
          </h1>
          <p className="app__subtitle">
            Cuadro de fases finales · Estados Unidos · Canadá · México
          </p>
        </div>

        <div className="app__status">
          {live && !error && (
            <span className="badge badge--live">
              <span className="pulse" aria-hidden="true" />
              En directo
            </span>
          )}
          {loading && <span className="badge badge--loading">Cargando…</span>}
          {error && (
            <span className="badge badge--error" title={error}>
              Datos de ejemplo (Supabase no disponible)
            </span>
          )}
          {!loading && !error && (
            <span className={`badge badge--${source}`}>
              {source === 'supabase' ? 'Conectado' : 'Datos de ejemplo'}
            </span>
          )}
        </div>
      </header>

      <main className="app__main">
        <Bracket data={bracket} />
      </main>

      <footer className="app__footer">
        <span className="legend">
          <span className="legend__dot legend__dot--live" /> En directo
        </span>
        <span className="legend">
          <span className="legend__dot legend__dot--win" /> Clasificado
        </span>
        <span className="app__note">
          Horarios en tu zona horaria local · Desliza para ver todo el cuadro
        </span>
      </footer>
    </div>
  )
}
