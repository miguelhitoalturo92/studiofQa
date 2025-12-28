import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import './styles.css'

const CSS_HANDLES = [
  'customImageGrid',
  'desktopGrid',
  'gridItem',
  'itemLink',
  'itemDisabled',
  'futureDate',
  'mobileSlider',
  'sliderItem',
  'sliderControls',
  'showMoreButton',
  'sliderButton',
] as const

interface Item {
  imageDesktop: string
  imageMobile: string
  title: string
  description: string
  link: string
  date: string // formato ISO "YYYY-MM-DD"
}

interface Props {
  items: Item[]
}

const isActive = (dateStr: string) => {
  const today = new Date()
  const itemDate = new Date(dateStr)
  return itemDate <= today
}

const CustomImageGrid: React.FC<Props> = ({ items }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % items.length)
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length)

  return (
    <div className={handles['customImageGrid']}>
      {/* Desktop Grid */}
      <div className={handles['desktopGrid']}>
        {items.map((item, index) => {
          const active = isActive(item.date)
          return (
            <div key={index} className={handles['gridItem']}>
              {active ? (
                <div className={handles['itemLink']}>
                  <img src={item.imageDesktop} alt={item.title} />
                  <a href={item.link} className={handles['showMoreButton']}>
                    SHOW MORE
                  </a>
                </div>
              ) : (
                <div className={handles['itemDisabled']}>
                  <img
                    src={item.imageDesktop}
                    alt={item.title}
                    className="bw"
                  />
                  <span className={handles['futureDate']}>
                    {new Date(item.date).toLocaleDateString('es-CO', {
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          )
        })}
      </div>

      {/* Mobile Slider */}
      <div className={handles['mobileSlider']}>
        {items.map((item, index) => {
          if (index !== currentSlide) return null
          const active = isActive(item.date)
          return (
            <div key={index} className={handles['sliderItem']}>
              {active ? (
                <a href={item.link} className={handles['itemLink']}>
                  <img src={item.imageMobile} alt={item.title} />
                  <button className={handles['showMoreButton']}>
                    SHOW MORE
                  </button>
                </a>
              ) : (
                <div className={handles['itemDisabled']}>
                  <img src={item.imageMobile} alt={item.title} className="bw" />
                  <span className={handles['futureDate']}>
                    {new Date(item.date).toLocaleDateString('es-CO', {
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          )
        })}

        {items.length > 1 && (
          <div className={handles['sliderControls']}>
            <button onClick={prevSlide} className={handles['sliderButton']}>
              ‹
            </button>
            <button onClick={nextSlide} className={handles['sliderButton']}>
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Schema ajustado
;(CustomImageGrid as any).schema = {
  title: 'custom-image-grid.title',
  description: 'custom-image-grid.description',
  type: 'object',
  properties: {
    items: {
      title: 'Items',
      type: 'array',
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
          title: { type: 'string', title: 'Título' },
          description: { type: 'string', title: 'Descripción' },
          link: { type: 'string', title: 'Link de redirección' },
          date: { type: 'string', title: 'Fecha de habilitación (YYYY-MM-DD)' },
        },
      },
    },
  },
}

export default CustomImageGrid
