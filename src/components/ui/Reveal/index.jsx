import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  opacity: 0;
  transform: translateY(26px);
  transition:
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${({ $delay }) => $delay || '0ms'},
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${({ $delay }) => $delay || '0ms'};

  ${({ $visible }) =>
    $visible &&
    css`
      opacity: 1;
      transform: none;
    `}

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: none;
  }
`;

const Reveal = ({ children, delay = 0, ...props }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') {
      setVisible(true);
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return undefined;
    }

    let revealed = false;
    const show = () => {
      if (revealed) return;
      revealed = true;
      setVisible(true);
    };

    // Проверка «уже во вьюпорте» — мгновенно, без ожидания кадра рендера
    const checkInViewport = () => {
      const rect = el.getBoundingClientRect();
      if (
        rect.top < window.innerHeight * 0.96 &&
        rect.bottom > window.innerHeight * 0.04
      ) {
        show();
      }
    };

    checkInViewport();

    let io = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            show();
            io.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: '0px 0px -48px 0px' }
      );
      io.observe(el);
    }

    // Резервный триггер: покрывает фоновые/приостановленные вебвью,
    // где доставка колбэков IntersectionObserver затягивается
    const onPageScroll = () => checkInViewport();
    window.addEventListener('scroll', onPageScroll, { passive: true });
    window.addEventListener('resize', onPageScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onPageScroll);
      window.removeEventListener('resize', onPageScroll);
      if (io) io.disconnect();
    };
  }, []);

  return (
    <Wrapper ref={ref} $visible={visible} $delay={delay} {...props}>
      {children}
    </Wrapper>
  );
};

export default Reveal;
