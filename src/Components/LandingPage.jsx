import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };
  // Custom icons as inline SVG components
  const Icons = {
    Menu: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="4" y1="12" x2="20" y2="12"></line>
        <line x1="4" y1="6" x2="20" y2="6"></line>
        <line x1="4" y1="18" x2="20" y2="18"></line>
      </svg>
    ),
    X: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    ),
    ArrowRight: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-horizontal-bounce"
      >
        <path d="M5 12h14"></path>
        <path d="M12 5l7 7-7 7"></path>
      </svg>
    ),
    Facebook: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    ),
    Twitter: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
      </svg>
    ),
    Instagram: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    Linkedin: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
    CheckCircle: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4285F4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    Lightbulb: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4285F4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
      </svg>
    ),
    Clock: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4285F4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    Palette: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4285F4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="13.5" cy="6.5" r=".5"></circle>
        <circle cx="17.5" cy="10.5" r=".5"></circle>
        <circle cx="8.5" cy="7.5" r=".5"></circle>
        <circle cx="6.5" cy="12.5" r=".5"></circle>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
      </svg>
    ),
    LogIn: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
        <polyline points="10 17 15 12 10 7"></polyline>
        <line x1="15" y1="12" x2="3" y2="12"></line>
      </svg>
    ),
    UserPlus: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <line x1="20" y1="8" x2="20" y2="14"></line>
        <line x1="23" y1="11" x2="17" y2="11"></line>
      </svg>
    ),
  };

  // Custom button component
  const Button = ({ children, className, variant }) => {
    const baseClasses = "py-2 px-4 rounded-md font-medium transition-all";
    const variantClasses = {
      primary: "bg-[#3B82F6] hover:bg-[#2563EB] text-white",
      outline: "border border-[#1E293B] hover:bg-[#1E293B] text-white",
    };

    return (
      <button
        className={`${baseClasses} ${
          variantClasses[variant] || variantClasses.primary
        } ${className || ""}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#1A1F2A]">
      {/* Header */}
      <header className="py-2.5 bg-gray-800 shadow-lg fixed top-0 w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="mr-2">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5 4L4 9V23L10.5 28L26 28L26 4L10.5 4Z"
                      stroke="#4285F4"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path d="M17 16L21 16" stroke="#4285F4" strokeWidth="2" />
                    <circle cx="14" cy="16" r="2" fill="#4285F4" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#4285F4] to-[#4285F4] bg-clip-text text-transparent">
                  IntelCor
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="#styles"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Styles
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </a>
              <div className="flex space-x-4">
                <button
                  onClick={handleLogin}
                  className="py-2 px-4 rounded-md font-medium text-white transition-all flex items-center hover:text-[#3B82F6] cursor-pointer"
                >
                  <span className="mr-2">
                    <Icons.LogIn />
                  </span>{" "}
                  Login
                </button>
                <button
                  onClick={handleSignUp}
                  className="py-2 px-4 rounded-md font-medium bg-[#3B82F6] hover:bg-[#2563EB] text-white transition-all flex items-center cursor-pointer"
                >
                  <span className="mr-2">
                    <Icons.UserPlus />
                  </span>{" "}
                  Sign Up
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-200 focus:outline-none"
              >
                {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4">
              <nav className="flex flex-col space-y-4 py-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </a>
                <a
                  href="#styles"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Design Styles
                </a>
                <a
                  href="#about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About
                </a>
                <div className="flex flex-col space-y-3 pt-3">
                  <button
                    onClick={handleLogin}
                    className="w-full py-2 px-4 rounded-md font-medium text-white transition-all flex items-center justify-center hover:text-[#3B82F6]"
                  >
                    <span className="mr-2">
                      <Icons.LogIn />
                    </span>{" "}
                    Login
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="w-full py-2 px-4 rounded-md font-medium bg-[#3B82F6] hover:bg-[#2563EB] text-white transition-all flex items-center justify-center"
                  >
                    <span className="mr-2">
                      <Icons.UserPlus />
                    </span>{" "}
                    Sign Up
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        <section className="relative pt-24 pb-12 md:pt-32 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6 md:pr-12">
                <h1 className="text-4xl md:text-5xl font-bold leading-[1.5] bg-gradient-to-r from-white to-[#4285F4] bg-clip-text text-transparent">
                  Transform Your Space with
                  <span className="text-blue-500"> AI-Powered</span> Design
                </h1>
                <p className="text-xl text-gray-300">
                  Transform your living space with intelligent recommendations
                  tailored to your style, preferences, and room dimensions. Let
                  AI help you create the perfect environment.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() =>
                      document
                        .getElementById("demo-video")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                    className="py-2 px-6 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md transition-all cursor-pointer flex items-center group"
                  >
                    Learn More
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">
                      <Icons.ArrowRight />
                    </span>
                  </button>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <div className="relative pt-[56.25%] w-full">
                  <img
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80"
                    alt="Modern stylish living room"
                    className="object-cover absolute inset-0 w-full h-full rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0C10]/70 to-transparent rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#1A1F2A]" id="demo-video">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Watch Our Demo Video
              </h2>
              <div className="relative pt-[56.25%] w-full rounded-lg overflow-hidden shadow-xl">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/5pifLt7brpw"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#1A1F2A]" id="styles">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Popular Design Styles
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Explore our collection of trending interior design styles that
                can transform your space into something extraordinary.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Minimalist",
                  image:
                    "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  description:
                    "Simplicity in form and function, with neutral colors and clean, uncluttered spaces.",
                },
                {
                  name: "Modern",
                  image:
                    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  description:
                    "Clean lines, a simple color palette, and minimalist design elements.",
                },
                {
                  name: "Traditional",
                  image:
                    "https://images.unsplash.com/photo-1597218868981-1b68e15f0065?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  description:
                    "Rich colors, ornate details, and symmetrical arrangements of furniture.",
                },
                {
                  name: "Industrial",
                  image:
                    "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  description:
                    "Raw materials, exposed architectural elements, and vintage-inspired fixtures.",
                },
              ].map((style, index) => (
                <div
                  key={index}
                  className="bg-[#0D1117] border border-gray-800 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-lg transition-transform hover:scale-[1.02]"
                >
                  <div className="relative h-60">
                    <img
                      src={style.image}
                      alt={`${style.name} design style`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] to-transparent"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {style.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{style.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16" id="about">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Why Choose IntelCor
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our intelligent design assistant combines cutting-edge AI with
                interior design expertise to help you create your dream space.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Icons.Lightbulb />,
                  title: "AI-Powered Recommendations",
                  description:
                    "Our advanced AI analyzes your preferences and room specifications to recommend the perfect design elements.",
                },
                {
                  icon: <Icons.Palette />,
                  title: "Comprehensive Product Inventory",
                  description:
                    "Access to a vast collection of interior design elements such as floorings, furnitures, etc.",
                },
                {
                  icon: <Icons.CheckCircle />,
                  title: "Personalized Experience",
                  description:
                    "Get recommendations tailored specifically to your taste, space dimensions, and functional needs.",
                },
                {
                  icon: <Icons.Clock />,
                  title: "Time-Saving Solutions",
                  description:
                    "Transform your space in minutes instead of weeks with instant AI-generated design recommendations.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-[#0D1117] rounded-lg shadow-lg border border-gray-800"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#1A1F2A]" id="ready">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Transform Your Space?
              </h2>
              <p className="text-gray-300 text-lg">
                Join thousands of homeowners who have discovered their perfect
                design with IntelCor's AI-powered room design assistant.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleLogin}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-lg px-8 py-3 rounded-md text-white font-medium inline-flex items-center cursor-pointer"
                >
                  Get Started
                  <span className="ml-2">
                    <Icons.ArrowRight />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 shadow-lg py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-5xl justify-items-center text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-2">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5 4L4 9V23L10.5 28L26 28L26 4L10.5 4Z"
                      stroke="#4285F4"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path d="M17 16L21 16" stroke="#4285F4" strokeWidth="2" />
                    <circle cx="14" cy="16" r="2" fill="#4285F4" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#4285F4] to-[#4285F4] bg-clip-text text-transparent">
                  IntelCor
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Smart Room Design Assistant - creating
                <br />
                perfect spaces through AI technology.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#4285F4] transition-colors"
                >
                  <Icons.Facebook />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#4285F4] transition-colors"
                >
                  <Icons.Twitter />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#4285F4] transition-colors"
                >
                  <Icons.Instagram />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#4285F4] transition-colors"
                >
                  <Icons.Linkedin />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <h href="#" className="text-gray-400">
                    AI-Powered Design
                  </h>
                </li>
                <li>
                  <h href="#" className="text-gray-400">
                    Room Visualization
                  </h>
                </li>
                <li>
                  <h href="#" className="text-gray-400">
                    Style Recommendations
                  </h>
                </li>
                <li>
                  <h href="#" className="text-gray-400">
                    Furniture Selection
                  </h>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <p className="text-gray-500 text-sm text-center">
              &copy; {new Date().getFullYear()} IntelCor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main app export
export default LandingPage;
