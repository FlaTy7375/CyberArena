import { Check } from 'lucide-react';
import {
  PricingWrapper,
  PricingContainer,
  PricingHeader,
  PricingLabel,
  PricingTitle,
  PricingSubtitle,
  PricingGrid,
  PriceCard,
  PopularBadge,
  PriceName,
  PriceDescription,
  PriceAmount,
  PriceValue,
  PricePeriod,
  PriceFeatures,
  PriceFeature,
  PriceButton,
} from './style';

const pricingPlans = [
  {
    id: 1,
    name: 'Базовый',
    description: 'Для казуального гейминга',
    price: '150',
    period: '/час',
    features: [
      'Standard Zone',
      'Доступ к библиотеке игр',
      'Базовая периферия',
      'Бесплатный Wi-Fi',
    ],
    featured: false,
  },
  {
    id: 2,
    name: 'Про',
    description: 'Для требовательных игроков',
    price: '250',
    period: '/час',
    features: [
      'PRO Zone (RTX 4080)',
      'Премиум периферия',
      '240Hz мониторы',
      'Напитки включены',
      'Приоритетное бронирование',
    ],
    featured: true,
  },
  {
    id: 3,
    name: 'Ночной',
    description: 'Играй всю ночь',
    price: '900',
    period: '/ночь',
    features: [
      'С 23:00 до 08:00',
      'PRO Zone',
      'Безлимитные напитки',
      'Завтрак включен',
    ],
    featured: false,
  },
  {
    id: 4,
    name: 'VIP',
    description: 'Максимум возможностей',
    price: '5000',
    period: '/месяц',
    features: [
      'Безлимитный доступ',
      'Личный шкафчик',
      'Скидка 20% в баре',
      'Бесплатные турниры',
      'VIP-поддержка',
    ],
    featured: false,
  },
];

const Pricing = () => {
  const handleClick = (e) => {
    e.preventDefault();
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PricingWrapper id="pricing" data-testid="section-pricing">
      <PricingContainer>
        <PricingHeader>
          <PricingLabel>Тарифы</PricingLabel>
          <PricingTitle data-testid="pricing-title">
            Выберите свой <span>тариф</span>
          </PricingTitle>
          <PricingSubtitle>
            Гибкие тарифные планы для любых потребностей — от часовой игры до месячной подписки
          </PricingSubtitle>
        </PricingHeader>

        <PricingGrid>
          {pricingPlans.map((plan) => (
            <PriceCard 
              key={plan.id} 
              $featured={plan.featured}
              data-testid={`price-card-${plan.id}`}
            >
              {plan.featured && <PopularBadge>Популярный</PopularBadge>}
              <PriceName>{plan.name}</PriceName>
              <PriceDescription>{plan.description}</PriceDescription>
              
              <PriceAmount>
                <PriceValue>{plan.price}₽</PriceValue>
                <PricePeriod>{plan.period}</PricePeriod>
              </PriceAmount>

              <PriceFeatures>
                {plan.features.map((feature) => (
                  <PriceFeature key={feature}>
                    <Check />
                    {feature}
                  </PriceFeature>
                ))}
              </PriceFeatures>

              <PriceButton 
                $featured={plan.featured}
                onClick={handleClick}
                data-testid={`button-select-${plan.id}`}
              >
                Выбрать
              </PriceButton>
            </PriceCard>
          ))}
        </PricingGrid>
      </PricingContainer>
    </PricingWrapper>
  );
};

export default Pricing;
