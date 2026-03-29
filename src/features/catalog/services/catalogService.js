import { products } from '../data/products'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
const MOCK_DELAY_MS = 220

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function requestJson(path) {
  if (!API_BASE_URL) {
    return null
  }

  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Falha na API: ${response.status}`)
  }

  return response.json()
}

function normalizePagedResult(rawData, page, perPage, totalFromHeader) {
  const fallbackItems = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.data)
      ? rawData.data
      : Array.isArray(rawData?.items)
        ? rawData.items
        : []

  const knownPages = Number(rawData?.pages)
  const knownTotal = Number(rawData?.total)
  const total = Number.isFinite(totalFromHeader)
    ? totalFromHeader
    : Number.isFinite(knownTotal)
      ? knownTotal
      : Number.isFinite(knownPages)
        ? knownPages * perPage
        : fallbackItems.length

  return {
    items: fallbackItems,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  }
}

function applyLocalFilters(items, { search, category, activeOnly, sortBy }) {
  const term = search.trim().toLowerCase()

  const filtered = items.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category
    const isActive = product.inStock
    const matchesActive = activeOnly ? isActive : true
    const haystack = `${product.name} ${product.description} ${product.tags.join(' ')}`.toLowerCase()
    const matchesSearch = term.length === 0 || haystack.includes(term)

    return matchesCategory && matchesActive && matchesSearch
  })

  if (sortBy === 'price-asc') {
    return [...filtered].sort((a, b) => a.price - b.price)
  }

  if (sortBy === 'price-desc') {
    return [...filtered].sort((a, b) => b.price - a.price)
  }

  if (sortBy === 'rating') {
    return [...filtered].sort((a, b) => b.rating - a.rating)
  }

  if (sortBy === 'duration') {
    return [...filtered].sort((a, b) => a.durationMinutes - b.durationMinutes)
  }

  return filtered
}

function buildLocalPagedResult({ safePage, safePerPage, search, category, activeOnly, sortBy }) {
  const filtered = applyLocalFilters(products, { search, category, activeOnly, sortBy })
  const start = (safePage - 1) * safePerPage
  const items = filtered.slice(start, start + safePerPage)

  return {
    items,
    total: filtered.length,
    page: safePage,
    perPage: safePerPage,
    totalPages: Math.max(1, Math.ceil(filtered.length / safePerPage)),
  }
}

export async function listProducts({
  page = 1,
  perPage = 6,
  search = '',
  category = 'all',
  activeOnly = false,
  sortBy = 'relevance',
} = {}) {
  const safePage = Math.max(1, Number(page) || 1)
  const safePerPage = Math.max(1, Number(perPage) || 6)

  if (API_BASE_URL) {
    try {
      const params = new URLSearchParams()
      params.set('_page', String(safePage))
      params.set('_per_page', String(safePerPage))

      if (search.trim()) {
        params.set('q', search.trim())
      }

      if (category !== 'all') {
        params.set('category', category)
      }

      if (activeOnly) {
        params.set('inStock', 'true')
      }

      if (sortBy === 'price-asc') {
        params.set('_sort', 'price')
        params.set('_order', 'asc')
      }

      if (sortBy === 'price-desc') {
        params.set('_sort', 'price')
        params.set('_order', 'desc')
      }

      if (sortBy === 'rating') {
        params.set('_sort', 'rating')
        params.set('_order', 'desc')
      }

      if (sortBy === 'duration') {
        params.set('_sort', 'durationMinutes')
        params.set('_order', 'asc')
      }

      const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Falha na API: ${response.status}`)
      }

      const rawData = await response.json()
      const totalHeader = Number(response.headers.get('x-total-count'))
      return normalizePagedResult(rawData, safePage, safePerPage, totalHeader)
    } catch {
      await sleep(MOCK_DELAY_MS)
      return buildLocalPagedResult({
        safePage,
        safePerPage,
        search,
        category,
        activeOnly,
        sortBy,
      })
    }
  }

  await sleep(MOCK_DELAY_MS)
  return buildLocalPagedResult({
    safePage,
    safePerPage,
    search,
    category,
    activeOnly,
    sortBy,
  })
}

export async function getProductById(productId) {
  if (API_BASE_URL) {
    try {
      const remoteData = await requestJson(`/products/${productId}`)

      if (remoteData) {
        return remoteData
      }
    } catch {
      // Falls back to local data when API is down or unreachable.
    }
  }

  await sleep(MOCK_DELAY_MS)
  return products.find((product) => product.id === productId) ?? null
}
