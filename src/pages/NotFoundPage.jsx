import { Link } from 'react-router-dom'
import './notFound.css'

export function NotFoundPage() {
  return (
    <main className="not-found">
      <p>404</p>
      <h1>Pagina nao encontrada</h1>
      <Link to="/">Voltar para a home</Link>
    </main>
  )
}
