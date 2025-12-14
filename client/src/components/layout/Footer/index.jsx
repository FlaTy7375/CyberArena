import { Gamepad2, MapPin, Phone, Clock, Mail } from 'lucide-react';
import { SiVk, SiTelegram, SiDiscord, SiYoutube } from 'react-icons/si';
import {
  FooterWrapper,
  FooterContainer,
  FooterGrid,
  FooterBrand,
  FooterLogo,
  FooterDescription,
  SocialLinks,
  SocialLink,
  FooterColumn,
  FooterTitle,
  FooterLinks,
  FooterLink,
  FooterInfo,
  FooterInfoItem,
  FooterBottom,
  Copyright,
  LegalLinks,
} from './style';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper data-testid="footer">
      <FooterContainer>
        <FooterGrid>
          <FooterBrand>
            <FooterLogo href="#">
              <Gamepad2 />
              <span>CyberArena</span>
            </FooterLogo>
            <FooterDescription>
              Премиальный компьютерный клуб нового поколения. 
              Мощные ПК, комфортная атмосфера и киберспортивные 
              турниры каждую неделю.
            </FooterDescription>
            <SocialLinks>
              <SocialLink 
                href="https://vk.com" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="social-vk"
                aria-label="VK"
              >
                <SiVk />
              </SocialLink>
              <SocialLink 
                href="https://t.me" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="social-telegram"
                aria-label="Telegram"
              >
                <SiTelegram />
              </SocialLink>
              <SocialLink 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="social-discord"
                aria-label="Discord"
              >
                <SiDiscord />
              </SocialLink>
              <SocialLink 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="social-youtube"
                aria-label="YouTube"
              >
                <SiYoutube />
              </SocialLink>
            </SocialLinks>
          </FooterBrand>

          <FooterColumn>
            <FooterTitle>Навигация</FooterTitle>
            <FooterLinks>
              <FooterLink>
                <a href="#about">О клубе</a>
              </FooterLink>
              <FooterLink>
                <a href="#zones">Игровые залы</a>
              </FooterLink>
              <FooterLink>
                <a href="#pricing">Цены</a>
              </FooterLink>
              <FooterLink>
                <a href="#tournaments">Турниры</a>
              </FooterLink>
              <FooterLink>
                <a href="#gallery">Галерея</a>
              </FooterLink>
              <FooterLink>
                <a href="#contact">Контакты</a>
              </FooterLink>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Контакты</FooterTitle>
            <FooterInfo>
              <FooterInfoItem>
                <MapPin />
                <span>г. Москва, ул. Киберспортивная, 42</span>
              </FooterInfoItem>
              <FooterInfoItem>
                <Phone />
                <span>+7 (495) 123-45-67</span>
              </FooterInfoItem>
              <FooterInfoItem>
                <Mail />
                <span>info@cyberarena.ru</span>
              </FooterInfoItem>
              <FooterInfoItem>
                <Clock />
                <span>Ежедневно: 10:00 - 02:00</span>
              </FooterInfoItem>
            </FooterInfo>
          </FooterColumn>
        </FooterGrid>

        <FooterBottom>
          <Copyright>
            © {currentYear} CyberArena. Все права защищены.
          </Copyright>
          <LegalLinks>
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Правила клуба</a>
          </LegalLinks>
        </FooterBottom>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footer;
