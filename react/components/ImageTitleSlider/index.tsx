import React, { useState, useEffect } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import './styles.css'

interface Slide {
  title: string
  imageDesktop: string
  imageMobile: string
}

interface Props {
  slides: Slide[]
}

const CSS_HANDLES = [
  'sliderContainer',
  'sliderImageContainer',
  'dotsTop',
  'dotButton',
  'imageWrapper',
  'sliderImage',
  'dotsBottom',
  'dotLine',
  'active',
] as const

const AUTOPLAY_INTERVAL = 5000

const ImageTitleSlider: React.FC<Props> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const { handles } = useCssHandles(CSS_HANDLES)
  const { deviceInfo } = useRuntime()
  const isMobile: boolean = Boolean(deviceInfo?.isMobile)

  if (!slides || slides.length === 0) return null

  // Autoplay con loop infinito
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, AUTOPLAY_INTERVAL)

    return () => clearInterval(interval)
  }, [slides.length])

  const currentSlide: Slide = slides[activeIndex]

  return (
    <div className={handles.sliderContainer}>
      {!isMobile && (
        <div className={handles.dotsTop}>
          {slides.map((slide: Slide, index: number) => (
            <button
              key={index}
              className={`${handles.dotButton} ${
                index === activeIndex ? handles.active : ''
              }`}
              onClick={() => setActiveIndex(index)}
            >
              {slide.title}
            </button>
          ))}
        </div>
      )}

      <div className={handles.imageWrapper}>
        <a className={handles.sliderImageContainer} href="#">
          <img
            className={handles.sliderImage}
            src={isMobile ? currentSlide.imageMobile : currentSlide.imageDesktop}
            alt={currentSlide.title}
          />
        </a>
      </div>

      {isMobile && (
        <div className={handles.dotsBottom}>
          {slides.map((_: Slide, index: number) => (
            <span
              key={index}
              className={`${handles.dotLine} ${
                index === activeIndex ? handles.active : ''
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* 👇 SCHEMA */
;(ImageTitleSlider as any).schema = {
  title: 'Slider con títulos',
  description: 'Slider con imágenes Desktop/Mobile',
  type: 'object',
  properties: {
    slides: {
      type: 'array',
      title: 'Slides',
      items: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            title: 'Título',
          },
          imageDesktop: {
            type: 'string',
            title: 'Imagen Desktop',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          imageMobile: {
            type: 'string',
            title: 'Imagen Mobile',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
        },
      },
    },
  },
}

export default ImageTitleSlider
