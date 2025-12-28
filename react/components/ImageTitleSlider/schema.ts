const ImageTitleSliderSchema = {
  title: 'Slider con títulos',
  type: 'object',
  properties: {
    slides: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          image: {
            title: 'Imagen',
            type: 'string',
            widget: { 'ui:widget': 'image-uploader' },
          },
          title: {
            title: 'Título',
            type: 'string',
          },
        },
      },
    },
  },
}

export default ImageTitleSliderSchema
