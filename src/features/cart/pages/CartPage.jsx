import { Link } from 'react-router-dom'
import { BRAND } from '../../../app/brand'
import { useCart } from '../context/useCart'
import '../styles/cart.css'

const SELLER_WHATSAPP = import.meta.env.VITE_WHATSAPP_SELLER ?? '5511948551437'

function formatSlot(slot) {
  const date = new Date(slot)

  if (Number.isNaN(date.getTime())) {
    return slot
  }

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function CartPage() {
  const { items, totalAmount, removeItem, clearCart } = useCart()

  function handleFinishPurchase() {
    if (!items.length) {
      return
    }

    const summaryLines = items.map((item) => {
      const noteLine = item.note ? ` | obs: ${item.note}` : ''
      return `- ${item.name} | horario: ${formatSlot(item.slot)} | valor: R$ ${item.price.toFixed(2)}${noteLine}`
    })

    const message = [
      'Ola! Quero confirmar estes agendamentos:',
      '',
      ...summaryLines,
      '',
      `Total estimado: R$ ${totalAmount.toFixed(2)}`,
    ].join('\n')

    const whatsappUrl = `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="cart-shell">
      <header className="cart-header">
        <div>
          <div className="brand-badge">
            <img src={BRAND.logo} alt={`Logo ${BRAND.name}`} />
            <strong>{BRAND.name}</strong>
          </div>
          <p className="cart-kicker">Agenda</p>
          <h1>Revise seus horarios</h1>
        </div>
        <Link to="/servicos" className="cart-back-link">
          Voltar para os servicos
        </Link>
      </header>

      {items.length === 0 ? (
        <section className="cart-empty">
          <h2>Sua agenda esta vazia</h2>
          <p>Adicione servicos com horario para iniciar seus agendamentos.</p>
          <Link to="/servicos">Ir para servicos</Link>
        </section>
      ) : (
        <>
          <section className="cart-list" aria-label="Itens da agenda">
            {items.map((item) => (
              <article key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="cart-item-content">
                  <h2>{item.name}</h2>
                  <p>R$ {item.price.toFixed(2)}</p>
                  <p>{item.durationMinutes} min</p>
                </div>
                <div className="cart-qty" aria-label={`Detalhes de ${item.name}`}>
                  <span>Horario</span>
                  <strong>{formatSlot(item.slot)}</strong>
                  {item.note ? <small>Obs: {item.note}</small> : null}
                </div>
                <strong className="cart-line-total">R$ {item.price.toFixed(2)}</strong>
                <button type="button" className="remove-btn" onClick={() => removeItem(item.id)}>
                  Remover
                </button>
              </article>
            ))}
          </section>

          <section className="cart-summary">
            <p>
              <span>Total</span>
              <strong>R$ {totalAmount.toFixed(2)}</strong>
            </p>
            <div className="cart-summary-actions">
              <button type="button" onClick={clearCart}>
                Limpar agenda
              </button>
              <button type="button" className="checkout" onClick={handleFinishPurchase}>
                Confirmar no WhatsApp
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  )
}
