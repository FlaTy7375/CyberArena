import { Cpu, MonitorPlay, Wifi } from 'lucide-react';
import {
  ZonesWrapper,
  ZonesContainer,
  ZonesHeader,
  ZonesLabel,
  ZonesTitle,
  ZonesSubtitle,
  ZonesGrid,
  ZoneCard,
  ZoneImage,
  ZoneBadge,
  ZoneContent,
  ZoneName,
  ZoneDescription,
  ZoneSpecs,
  ZoneSpec,
} from './style';

const zones = [
  {
    id: 1,
    name: 'PRO Zone',
    badge: 'Premium',
    description: 'Эксклюзивная зона для профессиональных игроков. Максимальная производительность и комфорт.',
    image: 'https://salavatgg.ru/assets/b26a8bf0/images/azinogg/photos/066.jpg',
    specs: ['RTX 4090', 'Intel i9-14900K', '64GB DDR5', '360Hz'],
  },
  {
    id: 2,
    name: 'Standard Zone',
    badge: 'Популярное',
    description: 'Оптимальный баланс цены и качества. Мощные ПК для любых современных игр.',
    image: 'https://bushidox.by/storage/elementor/thumbs/XXXL-1-qziibm7ssajue5u49mb7a39j5oepmxrs3xha9udc00.webp',
    specs: ['RTX 4080', 'Intel i7-14700K', '32GB DDR5', '240Hz'],
  },
  {
    id: 3,
    name: 'VR Zone',
    badge: 'Новинка',
    description: 'Погрузитесь в виртуальную реальность. Лучшие VR-шлемы и игры.',
    image: 'https://www.loft2rent.ru/upload_data/2023/9124/upldJ4gUMC.webp.900x600.jpg',
    specs: ['Meta Quest 3', 'Valve Index', 'HP Reverb G2', 'Full Body'],
  },
  {
    id: 4,
    name: 'Console Zone',
    badge: 'Для всех',
    description: 'PlayStation 5 и Xbox Series X на больших экранах. Идеально для компаний.',
    image: 'https://checkpointclub.by/wp-content/uploads/2024/06/IMG_8916-scaled.jpg',
    specs: ['PS5', 'Xbox Series X', '65" 4K TV', 'Диваны'],
  },
  {
    id: 5,
    name: 'Tournament Hall',
    badge: 'Киберспорт',
    description: 'Арена для проведения турниров. 20 мест с идентичными конфигурациями.',
    image: 'https://avatars.mds.yandex.net/get-altay/14021521/2a00000193da475c17be7179732c65988c66/orig',
    specs: ['20 ПК', 'Стриминг', 'Комментаторы', 'Призы'],
  },
  {
    id: 6,
    name: 'Stream Studio',
    badge: 'Стримеры',
    description: 'Профессиональная студия для стримов. Звукоизоляция, освещение, хромакей.',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
    specs: ['Green Screen', '4K Камера', 'GoXLR', 'Elgato'],
  },
];

const GamingZones = () => {
  return (
    <ZonesWrapper id="zones" data-testid="section-zones">
      <ZonesContainer>
        <ZonesHeader>
          <ZonesLabel>Наши залы</ZonesLabel>
          <ZonesTitle data-testid="zones-title">
            Игровые <span>зоны</span>
          </ZonesTitle>
          <ZonesSubtitle>
            Выберите зону под ваши потребности: от казуального гейминга до профессионального киберспорта
          </ZonesSubtitle>
        </ZonesHeader>

        <ZonesGrid>
          {zones.map((zone) => (
            <ZoneCard key={zone.id} data-testid={`zone-card-${zone.id}`}>
              <ZoneImage>
                <img src={zone.image} alt={zone.name} />
                <ZoneBadge>{zone.badge}</ZoneBadge>
              </ZoneImage>
              <ZoneContent>
                <ZoneName>{zone.name}</ZoneName>
                <ZoneDescription>{zone.description}</ZoneDescription>
                <ZoneSpecs>
                  {zone.specs.map((spec) => (
                    <ZoneSpec key={spec}>
                      <Cpu />
                      {spec}
                    </ZoneSpec>
                  ))}
                </ZoneSpecs>
              </ZoneContent>
            </ZoneCard>
          ))}
        </ZonesGrid>
      </ZonesContainer>
    </ZonesWrapper>
  );
};

export default GamingZones;
