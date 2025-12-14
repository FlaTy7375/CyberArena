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
    src: 'https://minsknews.by/wp-content/uploads/2022/09/Pavel-Rusak-18-of-44-kopiya.jpg',
    caption: 'Турнирная зона',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80',
    caption: 'Игровые ПК',
  },
  {
    id: 3,
    src: 'https://p1.zoon.ru/preview/m75QVck7faIHPOeBaVG8Xw/630x384x85/1/6/7/original_62b9e60b300c81aaa0036fae_62c2a466b77b80.44278523.jpg',
    caption: 'PRO Zone',
  },
  {
    id: 4,
    src: 'https://avatars.mds.yandex.net/get-altay/9831576/2a000001915b3bc32f115fdc116d1ad01f6c/orig',
    caption: 'Рабочие станции',
  },
  {
    id: 5,
    src: 'https://mayak.app/media/65/65152437c6099331570086.webp?nocache=1&size=3',
    caption: 'VR Zone',
  },
  {
    id: 6,
    src: 'https://checkpointclub.by/wp-content/uploads/2023/09/IMG_4664-scaled-e1695325944185.jpg',
    caption: 'Console Zone',
  },
  {
    id: 7,
    src: 'https://avatars.mds.yandex.net/get-altay/16379675/2a0000019aba8de636b31abe03432b51a85f/orig',
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
