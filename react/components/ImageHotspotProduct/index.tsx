import React, { useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import ProductTooltip from './ProductTooltip'
import SizeSelector from './SizeSelector'
import './styles.css'
import { useProductById } from './hooks/useProductById'

const CSS_HANDLES = ['container', 'imageWrapper', 'image', 'hotspot', 'bottomArea', 'linkProduct'] as const

interface Hotspot {
  productId: string
  x: number
  y: number
}

interface ImageItem {
  imageDesktop: string
  imageMobile?: string
  hotspots?: Hotspot[]
  urlProduct?: string
}

interface Props {
  images?: ImageItem[]
}

const ImageHotspotProduct: React.FC<Props> = ({ images = [] }) => {
  const { deviceInfo } = useRuntime()
  const isMobile = Boolean(deviceInfo?.isMobile)
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.container}>
      {images.map((img, index) => {
        // Estado individual por imagen para el producto seleccionado
        const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

        return (
          <div key={index} className={handles.imageWrapper} style={{ position: 'relative' }}>
            <img
              className={handles.image}
              src={isMobile && img.imageMobile ? img.imageMobile : img.imageDesktop}
              alt=""
              style={{ width: '100%' }}
            />

            {/* Hotspots */}
            {(img.hotspots || []).map((spot, i) => (
              <button
                key={i}
                className={handles.hotspot}
                style={{
                  position: 'absolute',
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: '#4C2B08',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
                onClick={() => setSelectedProductId(spot.productId)}
              >
                +
              </button>
            ))}

            {/* Tooltip con nombre del producto */}
            {selectedProductId && <ProductTooltip productId={selectedProductId} />}

            {/* Área inferior solo para la imagen seleccionada */}
            {selectedProductId && (
              <div
                className={handles.bottomArea}
                style={{
                  position: 'absolute',
                  bottom: '3rem',
                  left: '0',
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(255,255,255,0.9)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <SizeSelectorWrapper productId={selectedProductId} />
              </div>
            )}
            <a className={handles.linkProduct} href={img.urlProduct}>COMPRAR</a>
          </div>
        )
      })}
    </div>
  )
}

// Wrapper para pasar items del producto al SizeSelector
const SizeSelectorWrapper: React.FC<{ productId: string }> = ({ productId }) => {
  const { product, loading } = useProductById(productId)

  if (loading) return <div>Cargando tallas...</div>
  if (!product) return null

  return <SizeSelector items={product.items} name={product.productName} />
}

;(ImageHotspotProduct as any).schema = {
  title: 'Imagen con productos interactivos',
  type: 'object',
  properties: {
    images: {
      type: 'array',
      title: 'Imágenes',
      items: {
        type: 'object',
        properties: {
          imageDesktop: {
            type: 'string',
            title: 'Imagen desktop',
            widget: { 'ui:widget': 'image-uploader' },
          },
          imageMobile: {
            type: 'string',
            title: 'Imagen mobile',
            widget: { 'ui:widget': 'image-uploader' },
          },
          urlProduct: {
            type: 'string',
            title: 'URL del producto',
          },
          hotspots: {
            type: 'array',
            title: 'Puntos de producto',
            items: {
              type: 'object',
              properties: {
                productId: {
                  type: 'string',
                  title: 'Product ID',
                },
                x: {
                  type: 'number',
                  title: 'Posición X (%)',
                },
                y: {
                  type: 'number',
                  title: 'Posición Y (%)',
                },
              },
              required: ['productId', 'x', 'y'],
            },
          },
        },
        required: ['imageDesktop'],
      },
    },
  },
}


export default ImageHotspotProduct
