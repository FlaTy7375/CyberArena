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

/** Фото 14–20: после About, зон и турниров (фон Hero — стоковое фото) */
const galleryImages = [
  { id: 1, src: '/images/gallery-14.jpg', caption: 'Фото клуба 14' },
  { id: 2, src: '/images/gallery-15.jpg', caption: 'Фото клуба 15' },
  { id: 3, src: '/images/gallery-16.jpeg', caption: 'Фото клуба 16' },
  { id: 4, src: '/images/gallery-17.jpeg', caption: 'Фото клуба 17' },
  { id: 5, src: '/images/gallery-18.avif', caption: 'Фото клуба 18' },
  { id: 6, src: '/images/gallery-19.avif', caption: 'Фото клуба 19' },
  { id: 7, src: '/images/gallery-20.jpg', caption: 'Фото клуба 20' },
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
