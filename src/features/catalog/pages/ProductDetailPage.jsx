import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BRAND } from '../../../app/brand'
import { getProductById } from '../services/catalogService'
import '../styles/catalog.css'

const SELLER_WHATSAPP = import.meta.env.VITE_WHATSAPP_SELLER ?? '551161505256'

function formatInputToIso(dateValue, timeValue) {
  if (!dateValue || !timeValue) {
    return ''
  }

  return `${dateValue}T${timeValue}`
}

export function ProductDetailPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestedDate, setRequestedDate] = useState('')
  const [requestedTime, setRequestedTime] = useState('')
  const [customerNote, setCustomerNote] = useState('')
  const [justSent, setJustSent] = useState(false)
  const [validationError, setValidationError] = useState('')
  const selectedSlot = formatInputToIso(requestedDate, requestedTime)

  function handleSendToWhatsApp() {
    if (!selectedSlot) {
      setValidationError('Informe data e horario para solicitar o agendamento.')
      return
    }

    if (!product.inStock) {
      setValidationError('Esse servico esta pausado no momento.')
      return
    }

    const summary = [
      'Ola! Quero agendar este servico:',
      '',
      `Servico: ${product.name}`,
      `Data: ${requestedDate}`,
      `Horario: ${requestedTime}`,
      `Duracao estimada: ${product.durationMinutes} minutos`,
      `Valor: R$ ${product.price.toFixed(2)}`,
      customerNote.trim() ? `Observacao: ${customerNote.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const whatsappUrl = `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(summary)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    setValidationError('')
    setJustSent(true)
    window.setTimeout(() => {
      setJustSent(false)
    }, 900)
  }

  useEffect(() => {
    let isActive = true

    async function loadProduct() {
      if (!productId) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const result = await getProductById(productId)

        if (isActive) {
          setProduct(result)
          setRequestedDate('')
          setRequestedTime('')
        }
      } catch {
        if (isActive) {
          setError('Nao foi possivel carregar esse servico agora.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      isActive = false
    }
  }, [productId])

  if (isLoading) {
    return (
      <main className="catalog-shell">
        <p className="catalog-message">Carregando detalhes do servico...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="catalog-shell">
        <section className="catalog-empty">
          <h1>Erro ao carregar</h1>
          <p>{error}</p>
          <Link to="/servicos">Voltar para os servicos</Link>
        </section>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="catalog-shell">
        <section className="catalog-empty">
          <h1>Servico nao encontrado</h1>
          <p>Esse servico nao existe mais no catalogo.</p>
          <Link to="/servicos">Voltar para os servicos</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="catalog-shell">
      <header className="catalog-header">
        <div>
          <div className="brand-badge">
            <img src={BRAND.logo} alt={`Logo ${BRAND.name}`} />
            <strong>{BRAND.name}</strong>
          </div>
          <p className="catalog-kicker">Agendamento</p>
          <h1>{product.name}</h1>
          <p className="catalog-subtitle">{product.description}</p>
        </div>
        <Link to="/servicos" className="back-link">
          Voltar para os servicos
        </Link>
      </header>

      <section className="product-detail">
        <img src={product.image} alt={product.name} loading="lazy" />
        <p>
          <strong>Categoria:</strong> {product.category}
        </p>
        <p>
          <strong>Valor:</strong> R$ {product.price.toFixed(2)}
        </p>
        <p>
          <strong>Avaliacao:</strong> {product.rating}
        </p>
        <p>
          <strong>Duracao:</strong> {product.durationMinutes} minutos
        </p>
        <p>
          <strong>Tags:</strong> {product.tags.join(', ')}
        </p>

        <label className="field">
          <span>Data desejada</span>
          <input
            type="date"
            value={requestedDate}
            onChange={(event) => setRequestedDate(event.target.value)}
            disabled={!product.inStock}
          />
        </label>

        <label className="field">
          <span>Horario desejado</span>
          <input
            type="time"
            value={requestedTime}
            onChange={(event) => setRequestedTime(event.target.value)}
            disabled={!product.inStock}
          />
        </label>

        <label className="field">
          <span>Observacao (opcional)</span>
          <input
            type="text"
            value={customerNote}
            onChange={(event) => setCustomerNote(event.target.value)}
            placeholder="Ex.: preferencia de atendimento"
            maxLength={120}
            disabled={!product.inStock}
          />
        </label>

        {validationError ? <p className="catalog-message error">{validationError}</p> : null}

        <div className="product-detail-actions">
          <button
            type="button"
            disabled={!product.inStock}
            className={justSent ? 'added' : ''}
            onClick={handleSendToWhatsApp}
          >
            {justSent ? 'Enviado' : 'Solicitar no WhatsApp'}
          </button>
        </div>
      </section>
    </main>
  )
}
