export interface BannerItem {
  image: string
  title: string
  description: string
  link: string
}

export interface BannerGalleryProps {
  banners: BannerItem[]
}
