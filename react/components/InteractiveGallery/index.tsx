import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import './styles.css'

const CSS_HANDLES = [
  'interactiveGallery',
  'mainImageWrapper',
  'mainImage',
  'infoBox',
  'infoTitle',
  'infoDescription',
  'infoLink',
  'thumbnailList',
  'thumbnailItem',
  'thumbnailImage',
] as const

interface Item {
  image: string
  title: string
  description: string
  link: string
}

interface Props {
  items: Item[]
}

const InteractiveGallery: React.FC<Props> = ({ items }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className={handles['interactiveGallery']}>
      {/* Imagen principal */}
      <div className={handles['mainImageWrapper']}>
        <img
          src={items[activeIndex].image}
          alt={items[activeIndex].title}
          className={handles['mainImage']}
        />
        <div className={handles['infoBox']}>
          <h3 className={handles['infoTitle']}>{items[activeIndex].title}</h3>
          <p className={handles['infoDescription']}>
            {items[activeIndex].description}
          </p>
          <a href={items[activeIndex].link} className={handles['infoLink']}>
            Ver más
          </a>
        </div>
      </div>

      {/* Miniaturas */}
      <div className={handles['thumbnailList']}>
        {items.map((item, index) => (
          <div
            key={index}
            className={handles['thumbnailItem']}
            onClick={() => setActiveIndex(index)}
          >
            <img
              src={item.image}
              alt={item.title}
              className={handles['thumbnailImage']}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

;(InteractiveGallery as any).schema = {
  title: 'interactive-gallery.title',
  description: 'interactive-gallery.description',
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
          title: { type: 'string', title: 'Título' },
          description: { type: 'string', title: 'Descripción' },
          link: { type: 'string', title: 'Link de redirección' },
        },
      },
    },
  },
}


export default InteractiveGallery
