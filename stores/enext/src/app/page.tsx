import HeroSection from '@/components/home/v1/HeroSection';
import InfoSection1 from '@/components/home/v1/InfoSection1';
import InfoSection2 from '@/components/home/v1/InfoSection2';
import AdSection from '@/components/home/v1/AdSection';
import AdSection2 from '@/components/home/v1/AdSection2';
import FeaturedProducts from '@/components/products/FeaturedProducts';
import LatestNews from '@/components/home/v1/LatestNews';
import BrandSection from '@/components/home/v1/BrandSection';
// import NewArrivals from '@/components/home/v1/NewArrivals';
// import CategorySection from '@/components/home/v1/CategorySection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <InfoSection1 />
      <AdSection2 />
      <FeaturedProducts />
      {/* <NewArrivals /> */}
      <InfoSection2 />
      <AdSection />
      <LatestNews />
      {/* <CategorySection /> */}
      <BrandSection />
    </>
  );
}