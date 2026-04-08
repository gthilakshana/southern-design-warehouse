import { Hero } from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import { InfoSections } from "@/components/sections/InfoSections";
import WhyChoose from "@/components/sections/WhyChoose";
import ShowroomSection from "@/components/sections/Showroom";
import QuotationForm from "@/components/sections/QuotationForm";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { getProductCategories } from '@/lib/actions';

export default async function Home() {
  const categories = await getProductCategories();

  return (
    <>
      <Hero />
      <Categories categories={categories} />
      <InfoSections />
      <ShowroomSection />
      <WhyChoose />
      <QuotationForm />

      <ScrollToTop />
    </>
  );
}