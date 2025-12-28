import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import './styles.css'

const CSS_HANDLES = [
  'socialContainer',
  'socialLink',
  'socialIcon',
] as const

interface SocialItem {
  name: string
  url: string
  icon?: string // opcional, puedes usar un SVG predeterminado si no se pasa
}

interface Props {
  items: SocialItem[]
}

const SocialIcons: React.FC<Props> = ({ items }) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.socialContainer}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={handles.socialLink}
          aria-label={item.name}
        >
          {item.icon ? (
            <img src={item.icon} alt={item.name} className={handles.socialIcon} />
          ) : (
            <span className={handles.socialIcon}>{item.name[0]}</span> // fallback: primera letra
          )}
        </a>
      ))}
    </div>
  )
}

// Schema editable desde Site Editor
;(SocialIcons as any).schema = {
  title: 'Social Icons',
  description: 'Iconos de redes sociales configurables dinámicamente',
  type: 'object',
  properties: {
    items: {
      title: 'Redes sociales',
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Nombre de la red social',
          },
          url: {
            type: 'string',
            title: 'URL de la red social',
          },
          icon: {
            type: 'string',
            title: 'URL del icono (opcional)',
            widget: { 'ui:widget': 'image-uploader' },
          },
        },
      },
    },
  },
}

export default SocialIcons
