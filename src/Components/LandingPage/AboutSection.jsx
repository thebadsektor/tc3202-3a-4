// AboutSection.jsx - About section component for the Landing Page
import { Icons } from "./Icons";

const AboutSection = () => {
  const features = [
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
  ];

  return (
    <>
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
            {features.map((feature, index) => (
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
                onClick={() => (window.location.href = "/login")}
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
    </>
  );
};

export default AboutSection;
