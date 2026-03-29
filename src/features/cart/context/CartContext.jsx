import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './cartContext'

const STORAGE_KEY = 'agenda-bookings-v1'

function parseStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => parseStoredCart())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((service, bookingData = {}) => {
    if (!service || !bookingData.slot) {
      return
    }

    setItems((current) => {
      const bookingId = `${service.id}-${bookingData.slot}`
      const existing = current.find((item) => item.id === bookingId)

      if (existing) {
        return current.map((item) =>
          item.id === bookingId
            ? { ...item, note: bookingData.note ?? item.note }
            : item,
        )
      }

      return [
        ...current,
        {
          id: bookingId,
          serviceId: service.id,
          name: service.name,
          price: service.price,
          image: service.image,
          category: service.category,
          durationMinutes: service.durationMinutes,
          slot: bookingData.slot,
          note: bookingData.note ?? '',
        },
      ]
    })
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((current) => current.filter((item) => item.id !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getItemQuantity = useCallback((serviceId) => {
    return items.filter((cartItem) => cartItem.serviceId === serviceId).length
  }, [items])

  const value = useMemo(() => {
    const itemCount = items.length
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0)

    return {
      items,
      itemCount,
      totalAmount,
      addItem,
      removeItem,
      clearCart,
      getItemQuantity,
    }
  }, [addItem, clearCart, getItemQuantity, items, removeItem])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
