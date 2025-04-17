import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import ProductsSection from "@/components/products-section"
import TestimonialsSection from "@/components/testimonials-section"
import CTASection from "@/components/cta-section"

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ProductsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
