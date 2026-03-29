import { Link } from 'react-router-dom'

export function ProductGrid({ items }) {
  if (items.length === 0) {
    return (
      <section className="catalog-empty" role="status" aria-live="polite">
        <h2>Nenhum servico encontrado</h2>
        <p>Tente ajustar os filtros para ampliar os resultados.</p>
      </section>
    )
  }

  return (
    <section className="catalog-grid" aria-label="Lista de servicos">
      {items.map((product) => (
        <article key={product.id} className="product-card">
          <Link to={`/servicos/${product.id}`} className="product-media-link" aria-label={`Abrir detalhes de ${product.name}`}>
            <img src={product.image} alt={product.name} loading="lazy" />
          </Link>
          <span className="product-category">{product.category}</span>
          <h2>
            <Link to={`/servicos/${product.id}`} className="product-title-link">
              {product.name}
            </Link>
          </h2>
          <p>{product.description}</p>
          <div className="product-meta">
            <strong>R$ {product.price.toFixed(2)}</strong>
            <span>{product.durationMinutes} min</span>
          </div>
          <div className="product-actions">
            <span className={product.inStock ? 'stock in' : 'stock out'}>
              {product.inStock ? 'Atendimento ativo' : 'Atendimento pausado'}
            </span>
            <div className="product-actions-links">
              <Link to={`/servicos/${product.id}`}>Agendar horario</Link>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
