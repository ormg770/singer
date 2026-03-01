import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import MusicSection from './components/MusicSection'
import VideoSection from './components/VideoSection'
import ShowsSection from './components/ShowsSection'
import GallerySection from './components/GallerySection'
import MerchSection from './components/MerchSection'
import NewsletterSection from './components/NewsletterSection'
import DonationSection from './components/DonationSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MusicSection />
      <VideoSection />
      <ShowsSection />
      <GallerySection />
      <MerchSection />
      <NewsletterSection />
      <DonationSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
