import { useEffect, useState } from 'react'

export const useProductById = (productId: string) => {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!productId) return

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `/api/catalog_system/pub/products/search?fq=productId:${productId}`
        )
        const data = await res.json()
        console.log('Product: ',data);
        
        setProduct(data?.[0] ?? null)
      } catch (e) {
        console.error('Error fetching product', e)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  return { product, loading }
}
