import { Cpu, HardDrive, Monitor, Headphones, Keyboard, Mouse } from 'lucide-react';
import {
  SpecsWrapper,
  SpecsContainer,
  SpecsHeader,
  SpecsLabel,
  SpecsTitle,
  SpecsSubtitle,
  SpecsGrid,
  SpecCard,
  SpecIcon,
  SpecValue,
  SpecLabel as SpecLabelText,
  BrandsSection,
  BrandsTitle,
  BrandsGrid,
  BrandLogo,
} from './style';

const specs = [
  {
    icon: Cpu,
    value: 'RTX 4080',
    label: 'Видеокарты',
  },
  {
    icon: HardDrive,
    value: 'i9-14900K',
    label: 'Процессоры',
  },
  {
    icon: HardDrive,
    value: '64GB DDR5',
    label: 'Оперативная память',
  },
  {
    icon: Monitor,
    value: '240Hz',
    label: 'Мониторы',
  },
  {
    icon: Headphones,
    value: 'HyperX',
    label: 'Гарнитуры',
  },
  {
    icon: Keyboard,
    value: 'Механика',
    label: 'Клавиатуры',
  },
];

const brands = [
  'NVIDIA',
  'Intel',
  'ASUS',
  'Logitech',
  'HyperX',
  'SteelSeries',
  'BenQ',
  'Razer',
];

const Specs = () => {
  return (
    <SpecsWrapper id="specs" data-testid="section-specs">
      <SpecsContainer>
        <SpecsHeader>
          <SpecsLabel>Оборудование</SpecsLabel>
          <SpecsTitle data-testid="specs-title">
            Железо <span>PRO-уровня</span>
          </SpecsTitle>
          <SpecsSubtitle>
            Только топовые комплектующие для максимальной производительности в любых играх
          </SpecsSubtitle>
        </SpecsHeader>

        <SpecsGrid>
          {specs.map((spec) => (
            <SpecCard key={spec.label} data-testid={`spec-card-${spec.label}`}>
              <SpecIcon>
                <spec.icon />
              </SpecIcon>
              <SpecValue>{spec.value}</SpecValue>
              <SpecLabelText>{spec.label}</SpecLabelText>
            </SpecCard>
          ))}
        </SpecsGrid>

        <BrandsSection>
          <BrandsTitle>Наши партнеры</BrandsTitle>
          <BrandsGrid>
            {brands.map((brand) => (
              <BrandLogo key={brand} data-testid={`brand-${brand}`}>
                {brand}
              </BrandLogo>
            ))}
          </BrandsGrid>
        </BrandsSection>
      </SpecsContainer>
    </SpecsWrapper>
  );
};

export default Specs;
