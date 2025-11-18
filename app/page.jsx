
import CategorySection from "./components/CategorySection";
import Herosection from "./components/Herosection";
import BestsellersSection from "./components/BestsellersSection";
import AdSection from "./components/AdSection";
import FeatureSection from "./components/FeatureSection";
import WatchAndShopSlider from "./components/WatchAndShopSlider";
import OfferSection from "./components/OfferSection";
import NewArrivalProduct from "./components/NewArrivalProduct";
import MissionSection from "./components/MissionSection";
import FAQ from "./components/FAQ";
import TestimonialSlider from "./components/TestimonialSlider";




export default function Home() {
  return (
    <>
    <CategorySection />
    <Herosection />
    <BestsellersSection />
    <AdSection />
    <FeatureSection />  
    <WatchAndShopSlider />
    <OfferSection />
    <NewArrivalProduct />
    <MissionSection />
    <FAQ />
    <TestimonialSlider/>
    </>
  );
}
