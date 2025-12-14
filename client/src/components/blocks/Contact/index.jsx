import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Map } from 'lucide-react';
import {
  ContactWrapper,
  ContactContainer,
  ContactHeader,
  ContactLabel,
  ContactTitle,
  ContactSubtitle,
  ContactGrid,
  ContactForm,
  FormTitle,
  FormGrid,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  FormButton,
  ContactInfo,
  InfoCard,
  InfoTitle,
  InfoList,
  InfoItem,
  InfoContent,
  MapWrapper,
  MapPlaceholder,
  SuccessMessage,
  ErrorMessage,
} from './style';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    zone: '',
    date: '',
    time: '',
    hours: 1,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          zone: '',
          date: '',
          time: '',
          hours: 1,
          message: '',
        });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        const data = await response.json();
        setError(data.message || 'Произошла ошибка при отправке заявки');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError('Ошибка сети. Попробуйте еще раз.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactWrapper id="contact" data-testid="section-contact">
      <ContactContainer>
        <ContactHeader>
          <ContactLabel>Контакты</ContactLabel>
          <ContactTitle data-testid="contact-title">
            Свяжитесь с <span>нами</span>
          </ContactTitle>
          <ContactSubtitle>
            Забронируйте место онлайн или свяжитесь с нами любым удобным способом
          </ContactSubtitle>
        </ContactHeader>

        <ContactGrid>
          <ContactForm onSubmit={handleSubmit} data-testid="booking-form">
            <FormTitle>Забронировать место</FormTitle>
            
            <FormGrid>
              <FormGroup>
                <FormLabel htmlFor="name">Имя</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ваше имя"
                  required
                  data-testid="input-name"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="phone">Телефон</FormLabel>
                <FormInput
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (___) ___-__-__"
                  required
                  data-testid="input-phone"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  data-testid="input-email"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="zone">Зона</FormLabel>
                <FormSelect
                  id="zone"
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  required
                  data-testid="select-zone"
                >
                  <option value="">Выберите зону</option>
                  <option value="standard">Standard Zone</option>
                  <option value="pro">PRO Zone</option>
                  <option value="vr">VR Zone</option>
                  <option value="console">Console Zone</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="date">Дата</FormLabel>
                <FormInput
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  data-testid="input-date"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="time">Время</FormLabel>
                <FormSelect
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  data-testid="select-time"
                >
                  <option value="">Выберите время</option>
                  <option value="10:00">10:00</option>
                  <option value="12:00">12:00</option>
                  <option value="14:00">14:00</option>
                  <option value="16:00">16:00</option>
                  <option value="18:00">18:00</option>
                  <option value="20:00">20:00</option>
                  <option value="22:00">22:00</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="hours">Длительность (часы)</FormLabel>
                <FormSelect
                  id="hours"
                  name="hours"
                  value={formData.hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, hours: parseInt(e.target.value) }))}
                  required
                  data-testid="select-hours"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                    <option key={h} value={h}>{h} {h === 1 ? 'час' : h < 5 ? 'часа' : 'часов'}</option>
                  ))}
                </FormSelect>
              </FormGroup>

              <FormGroup className="full-width">
                <FormLabel htmlFor="message">Сообщение</FormLabel>
                <FormTextarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Дополнительные пожелания..."
                  data-testid="textarea-message"
                />
              </FormGroup>

              <FormGroup className="full-width">
                <FormButton 
                  type="submit" 
                  disabled={isSubmitting}
                  data-testid="button-submit-booking"
                >
                  {isSubmitting ? 'Отправка...' : 'Забронировать'}
                </FormButton>
                
                {isSuccess && (
                  <SuccessMessage data-testid="success-message">
                    Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
                  </SuccessMessage>
                )}
                
                {error && (
                  <ErrorMessage data-testid="error-message">
                    {error}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormGrid>
          </ContactForm>

          <ContactInfo>
            <InfoCard>
              <InfoTitle>Наши контакты</InfoTitle>
              <InfoList>
                <InfoItem>
                  <MapPin />
                  <InfoContent>
                    <h4>Адрес</h4>
                    <p>г. Москва, ул. Киберспортивная, 42</p>
                  </InfoContent>
                </InfoItem>
                <InfoItem>
                  <Phone />
                  <InfoContent>
                    <h4>Телефон</h4>
                    <p><a href="tel:+74951234567">+7 (495) 123-45-67</a></p>
                  </InfoContent>
                </InfoItem>
                <InfoItem>
                  <Mail />
                  <InfoContent>
                    <h4>Email</h4>
                    <p><a href="mailto:info@cyberarena.ru">info@cyberarena.ru</a></p>
                  </InfoContent>
                </InfoItem>
                <InfoItem>
                  <Clock />
                  <InfoContent>
                    <h4>Режим работы</h4>
                    <p>Ежедневно: 10:00 - 02:00</p>
                  </InfoContent>
                </InfoItem>
              </InfoList>
            </InfoCard>

            <MapWrapper>
              <MapPlaceholder>
                <Map />
                <span>Карта загружается...</span>
              </MapPlaceholder>
            </MapWrapper>
          </ContactInfo>
        </ContactGrid>
      </ContactContainer>
    </ContactWrapper>
  );
};

export default Contact;
