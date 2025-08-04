import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CoursePreview from "@/components/CoursePreview";
import ErrorChallenge from "@/components/ErrorChallenge";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <CoursePreview />
        <ErrorChallenge />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
