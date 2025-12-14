import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import GlobalStyles from '../styles/GlobalStyles';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/blocks/Hero';
import About from '../components/blocks/About';
import GamingZones from '../components/blocks/GamingZones';
import Pricing from '../components/blocks/Pricing';
import Tournaments from '../components/blocks/Tournaments';
import Specs from '../components/blocks/Specs';
import Gallery from '../components/blocks/Gallery';
import Contact from '../components/blocks/Contact';

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Header />
      <main>
        <Hero />
        <About />
        <GamingZones />
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
