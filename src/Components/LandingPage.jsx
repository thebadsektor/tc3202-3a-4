import { useNavigate } from "react-router-dom";
import Header from "./LandingPage/Header";
import HeroSection from "./LandingPage/HeroSection";
import DemoSection from "./LandingPage/DemoSection";
import StylesSection from "./LandingPage/StylesSection";
import AboutSection from "./LandingPage/AboutSection";
import Footer from "./LandingPage/Footer";
import Button from "./LandingPage/Button";
import { Icons } from "./LandingPage/Icons";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-[#1A1F2A]">
      <Header handleLogin={handleLogin} handleSignUp={handleSignUp} />
      <main>
        <HeroSection />
        <DemoSection />
        <StylesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

// Main app export
export default LandingPage;
