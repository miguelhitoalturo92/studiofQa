import React, { useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { BannerGalleryProps } from './types'

import './styles.css'

const CSS_HANDLES = [
  'galleryContainer',
  'mainBanner',
  'mainBannerActive',
  'bannerImage',
  'bannerOverlay',
  'overlay',
  'title',
  'description',
  'thumbnailsWrapper',
  'thumbnails',
  'thumbnail',
  'thumbnailActive',
  'arrow',
  'arrowLeft',
  'arrowRight',
] as const

const VISIBLE_THUMBNAILS = 3
const THUMBNAIL_WIDTH = 120
const AUTOPLAY_INTERVAL = 5000

const BannerGallery: React.FC<BannerGalleryProps> = ({ banners = [] }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const [activeIndex, setActiveIndex] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  if (!banners.length) return null

  // Autoplay
  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length
      handleSelect(nextIndex)
    }, AUTOPLAY_INTERVAL)
    return () => clearInterval(interval)
  }, [activeIndex, isHovered, banners.length])

  // Función central para seleccionar un banner y ajustar slider
  const handleSelect = (index: number) => {
    setActiveIndex(index)

    // Ajustar slider para que la miniatura seleccionada esté visible
    if (index < slideIndex) {
      setSlideIndex(index)
    } else if (index >= slideIndex + VISIBLE_THUMBNAILS) {
      setSlideIndex(index - VISIBLE_THUMBNAILS + 1)
    }
  }

  // Flechas
  const handlePrev = () => {
    const newIndex = activeIndex - 1 >= 0 ? activeIndex - 1 : banners.length - 1
    handleSelect(newIndex)
  }

  const handleNext = () => {
    const newIndex = (activeIndex + 1) % banners.length
    handleSelect(newIndex)
  }

  const activeBanner = banners[activeIndex]

  return (
    <div
      className={handles.galleryContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner principal */}
      <a
        href={activeBanner.link}
        className={`${handles.mainBanner} ${handles.mainBannerActive}`}
      >
        <div
          className={handles.bannerImage}
          style={{ backgroundImage: `url(${activeBanner.image})` }}
        />
        <div className={handles.bannerOverlay} />
        <div className={handles.overlay}>
          <h2 className={handles.title}>{activeBanner.title}</h2>
          <p className={handles.description}>{activeBanner.description}</p>
        </div>
      </a>

      {/* Thumbnails slider */}
      <div className={handles.thumbnailsWrapper}>
        <button className={`${handles.arrow} ${handles.arrowLeft}`} onClick={handlePrev}>
          ‹
        </button>

        <div className={handles.thumbnails}>
          <div
            style={{
              transform: `translateX(-${slideIndex * THUMBNAIL_WIDTH}px)`,
            }}
          >
            {banners.map((banner, index) => (
              <button
                key={index}
                className={
                  index === activeIndex
                    ? `${handles.thumbnail} ${handles.thumbnailActive}`
                    : handles.thumbnail
                }
                onClick={() => handleSelect(index)}
                style={{ backgroundImage: `url(${banner.image})` }}
                aria-label={banner.title}
              />
            ))}
          </div>
        </div>

        <button className={`${handles.arrow} ${handles.arrowRight}`} onClick={handleNext}>
          ›
        </button>
      </div>
    </div>
  )
}

/* ===========================
   Schema Site Editor
=========================== */
;(BannerGallery as any).schema = {
  title: 'Banner Gallery',
  description: 'Galería de banners con autoplay, miniaturas grandes y overlay oscuro',
  type: 'object',
  properties: {
    banners: {
      title: 'Banners',
      type: 'array',
      minItems: 1,
      items: {
        title: 'Banner',
        type: 'object',
        properties: {
          image: {
            title: 'Imagen',
            type: 'string',
            widget: { 'ui:widget': 'image-uploader' },
          },
          title: { title: 'Título', type: 'string' },
          description: { title: 'Descripción', type: 'string', widget: { 'ui:widget': 'textarea' } },
          link: { title: 'Link de redirección', type: 'string' },
        },
      },
    },
  },
}

export default BannerGallery
