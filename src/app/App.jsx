import { Navigate, Route, Routes } from 'react-router-dom'
import { CatalogPage } from '../features/catalog/pages/CatalogPage'
import { ProductDetailPage } from '../features/catalog/pages/ProductDetailPage'
import { NotFoundPage } from '../pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/catalogo" element={<Navigate to="/servicos" replace />} />
      <Route path="/servicos" element={<CatalogPage />} />
      <Route path="/servicos/:productId" element={<ProductDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
