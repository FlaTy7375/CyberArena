import {
  GalleryWrapper,
  GalleryContainer,
  GalleryHeader,
  GalleryLabel,
  GalleryTitle,
  GallerySubtitle,
  GalleryGrid,
  GalleryItem,
  GalleryOverlay,
  GalleryCaption,
} from './style';

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Турнирная зона',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80',
    caption: 'Игровые ПК',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=800&q=80',
    caption: 'PRO Zone',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80',
    caption: 'Рабочие станции',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=80',
    caption: 'VR Zone',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80',
    caption: 'Console Zone',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
    caption: 'Стрим-студия',
  },
];

const Gallery = () => {
  return (
    <GalleryWrapper id="gallery" data-testid="section-gallery">
      <GalleryContainer>
        <GalleryHeader>
          <GalleryLabel>Фото</GalleryLabel>
          <GalleryTitle data-testid="gallery-title">
            Наша <span>галерея</span>
          </GalleryTitle>
          <GallerySubtitle>
            Загляните внутрь CyberArena и оцените атмосферу нашего клуба
          </GallerySubtitle>
        </GalleryHeader>

        <GalleryGrid>
          {galleryImages.map((image) => (
            <GalleryItem key={image.id} data-testid={`gallery-item-${image.id}`}>
              <img src={image.src} alt={image.caption} loading="lazy" />
              <GalleryOverlay>
                <GalleryCaption>{image.caption}</GalleryCaption>
              </GalleryOverlay>
            </GalleryItem>
          ))}
        </GalleryGrid>
      </GalleryContainer>
    </GalleryWrapper>
  );
};

export default Gallery;
