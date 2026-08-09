import Header from '@/components/Header';
import Hero from '@/components/Hero';
import EducationLevels from '@/components/EducationLevels';
import News from '@/components/News';
import Values from '@/components/Values';
import Stats from '@/components/Stats';
import CTA from '@/components/CTA';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <EducationLevels />
        <Values />
        <Stats />
        <News />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
