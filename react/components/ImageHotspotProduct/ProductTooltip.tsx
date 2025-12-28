import React from 'react'
import { useProductById } from './hooks/useProductById'

interface Props {
  productId: string
}

const ProductTooltip: React.FC<Props> = ({ productId }) => {
  const { product, loading } = useProductById(productId)

  if (loading) return null
  if (!product) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#fff',
        border: '1px solid #ccc',
        padding: '6px 12px',
        borderRadius: '4px',
        zIndex: 200,
        display:"none",
        whiteSpace: 'nowrap',
      }}
    >
      {product.name}
    </div>
  )
}

export default ProductTooltip
