import { useState, useEffect } from 'react';
import { Gamepad2 } from 'lucide-react';
import Button from '../../ui/CustomButton';
import {
  HeaderWrapper,
  HeaderContainer,
  Logo,
  Nav,
  NavLink,
  HeaderActions,
  DesktopButton,
  MobileMenuButton,
  MobileMenu,
  MobileNavLink,
} from './style';

const navItems = [
  { label: 'О клубе', href: '#about' },
  { label: 'Залы', href: '#zones' },
  { label: 'Цены', href: '#pricing' },
  { label: 'Турниры', href: '#tournaments' },
  { label: 'Галерея', href: '#gallery' },
  { label: 'Контакты', href: '#contact' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <HeaderWrapper $scrolled={scrolled} data-testid="header">
        <HeaderContainer>
          <Logo href="#" data-testid="logo">
            <Gamepad2 />
            <span>CyberArena</span>
          </Logo>

          <Nav>
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                data-testid={`nav-link-${item.href.slice(1)}`}
              >
                {item.label}
              </NavLink>
            ))}
          </Nav>

          <HeaderActions>
            <DesktopButton>
              <Button 
                variant="primary" 
                size="sm"
                onClick={(e) => handleNavClick(e, '#contact')}
                data-testid="button-book"
              >
                Забронировать
              </Button>
            </DesktopButton>
            <MobileMenuButton
              $isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </MobileMenuButton>
          </HeaderActions>
        </HeaderContainer>
      </HeaderWrapper>

      <MobileMenu $isOpen={mobileMenuOpen}>
        {navItems.map((item) => (
          <MobileNavLink
            key={item.href}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            data-testid={`mobile-nav-link-${item.href.slice(1)}`}
          >
            {item.label}
          </MobileNavLink>
        ))}
        <Button
          variant="primary"
          size="lg"
          onClick={(e) => handleNavClick(e, '#contact')}
          data-testid="button-mobile-book"
        >
          Забронировать
        </Button>
      </MobileMenu>
    </>
  );
};

export default Header;
