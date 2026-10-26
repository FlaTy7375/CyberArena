import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import GlobalStyles from '../styles/GlobalStyles';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/blocks/Hero';
import About from '../components/blocks/About';
import GamingZones from '../components/blocks/GamingZones';
import Interlude from '../components/blocks/Interlude';
import Pricing from '../components/blocks/Pricing';
import Tournaments from '../components/blocks/Tournaments';
import Specs from '../components/blocks/Specs';
import Gallery from '../components/blocks/Gallery';
import Contact from '../components/blocks/Contact';
import Marquee from '../components/ui/Marquee';
import Noise from '../components/ui/Noise';
import CustomCursor from '../components/ui/CustomCursor';

const tickerItems = [
  'CS2',
  'Dota 2',
  'Valorant',
  'Fortnite',
  'Apex Legends',
  'FC 25',
  'League of Legends',
  'Overwatch 2',
  'Forza Horizon 6',
];

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Noise />
      <CustomCursor />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Marquee items={tickerItems} />
        <About />
        <GamingZones />
        <Interlude />
        <Pricing />
        <Tournaments />
        <Specs />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  );
};

export default Home;
