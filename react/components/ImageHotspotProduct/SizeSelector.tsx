import React, { useState } from 'react'
import imageBuy from './assets/addCart.png'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'
import './styles.css'


interface Seller {
  sellerId: string
}

interface SKUItem {
  itemId: string
  name: string
  sellers: Seller[]
}

interface Props {
  name: string
  items: SKUItem[]
}

const CSS_HANDLES = ['sizeSelector', 'selectorTitle', 'sizeButtons', 'containerSize'] as const

const SizeSelector: React.FC<Props> = ({ items, name }) => {
  const { orderForm, setOrderForm } = useOrderForm()
  const [selectedItem, setSelectedItem] = useState<SKUItem | null>(null)
  const [loading, setLoading] = useState(false)

  const { handles } = useCssHandles(CSS_HANDLES)  

  console.log('Available items for size selection: ', items);
  const handleAddToCart = async () => {
    if (!orderForm || !selectedItem) return

    setLoading(true)

    const body = {
      orderItems: [
        {
          id: selectedItem.itemId,
          quantity: 1,
          seller: selectedItem.sellers[0].sellerId,
        },
      ],
    }

    try {
      const response = await fetch(
        `/api/checkout/pub/orderForm/${orderForm.id}/items`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )

      const updatedOrderForm = await response.json()
      setOrderForm(updatedOrderForm)
      setSelectedItem(null) // opcional: deselecciona la talla después de agregar
    } catch (e) {
      console.error('Error adding to cart', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={handles.sizeSelector}>
      <div className={handles.containerSize}>
        <div className={handles.selectorTitle} style={{ marginBottom: '8px', fontWeight: 'bold' }}>
              <p>Selecciona tu talla: </p>
              <p>{name}</p>
            </div>

            <div className={handles.sizeButtons} style={{ display: 'flex', gap: '8px' }}>
              {items.map((item) => {
                // Extrae solo el número de la talla del nombre del SKU
                // Ej: "Talla 42" -> "42"
                const sizeNumber = item.name.match(/\d+/)?.[0] ?? item.name

                return (
                  <button
                    key={item.itemId}
                    onClick={() => setSelectedItem(item)}
                    style={{
                      padding: '3px 6px',
                      fontSize: '.6rem',
                      border:
                        selectedItem?.itemId === item.itemId
                          ? '2px solid #4C2B08'
                          : '1px solid #ccc',
                      background:
                        selectedItem?.itemId === item.itemId ? '#4C2B08' : '#fff',
                      cursor: 'pointer',
                      color:
                        selectedItem?.itemId === item.itemId ? '#fff' : '#000',
                    }}
                  >
                    {sizeNumber}
                  </button>
                )
              })}
            </div>
      </div>
    

      <button
        onClick={handleAddToCart}
        disabled={!selectedItem || loading}
        style={{
          marginTop: '10px',
          padding: '0.5rem 1rem',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
          fontSize: '.6rem',
          gap: '4px',
          background: '#fff6',
          color: '#000',
          border: 'none',
          cursor: selectedItem && !loading ? 'pointer' : 'not-allowed',
        }}
      >
         <img src={imageBuy} alt="Comprar" />
        {loading ? 'Agregando...' : 'Añadir'}
      </button>
    </div>
  )
}

export default SizeSelector
