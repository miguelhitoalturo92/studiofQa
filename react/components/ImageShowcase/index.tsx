import React, { useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import './styles.css'

const CSS_HANDLES = [
  'imageShowcase',
  'desktopGridShowcase',
  'gridItem',
  'itemLink',
  'mobileSlider',
  'sliderItem',
  'sliderControlShowcase',
  'sliderButton',
  'mobileSlideGrid',
] as const

interface Item {
  image: string
  title: string
  link: string
}

interface Props {
  items: Item[]
}

const SLIDE_SIZE = 4
const AUTOPLAY_INTERVAL = 4000

const ImageShowcase: React.FC<Props> = ({ items }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { deviceInfo } = useRuntime()
  const isMobile: boolean = Boolean(deviceInfo?.isMobile)

  const [currentSlide, setCurrentSlide] = useState(0)

  const totalSlides = Math.max(1, Math.ceil(items.length / SLIDE_SIZE))

  // Autoplay y loop solo en mobile
  useEffect(() => {
    if (!isMobile) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, AUTOPLAY_INTERVAL)

    return () => clearInterval(interval)
  }, [isMobile, totalSlides])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides)
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)

  // Solo en mobile: obtener 4 imágenes con repetición si hace falta
  const getSlideItems = () => {
    if (!isMobile) return []

    const start = currentSlide * SLIDE_SIZE
    const slideItems: Item[] = []

    for (let i = 0; i < SLIDE_SIZE; i++) {
      const index = (start + i) % items.length
      slideItems.push(items[index])
    }
    return slideItems
  }

  return (
    <div className={handles['imageShowcase']}>
      {/* Desktop Grid: solo si NO es mobile */}
      {!isMobile && (
        <div className={handles['desktopGridShowcase']}>
          {items.map((item, index) => (
            <a key={index} href={item.link} className={handles['itemLink']}>
              <img src={item.image} alt={item.title} />
            </a>
          ))}
        </div>
      )}

      {/* Mobile Slider solo si es mobile */}
      {isMobile && (
        <div className={handles['mobileSlider']}>
          <div className={handles['mobileSlideGrid']}>
            {getSlideItems().map((item, index) => (
              <a key={index} href={item.link} className={handles['itemLink']}>
                <img src={item.image} alt={item.title} />
              </a>
            ))}
          </div>
          {items.length > SLIDE_SIZE && (
            <div className={handles['sliderControlShowcase']}>
              <button onClick={prevSlide} className={handles['sliderButton']}>
                ‹
              </button>
              <button onClick={nextSlide} className={handles['sliderButton']}>
                ›
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Schema
;(ImageShowcase as any).schema = {
  title: 'image-showcase.title',
  description: 'image-showcase.description',
  type: 'object',
  properties: {
    items: {
      title: 'Items',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            title: 'Imagen',
            widget: { 'ui:widget': 'image-uploader' },
          },
          title: {
            type: 'string',
            title: 'Título (alt)',
          },
          link: {
            type: 'string',
            title: 'URL de redirección',
          },
        },
      },
    },
  },
}

export default ImageShowcase
