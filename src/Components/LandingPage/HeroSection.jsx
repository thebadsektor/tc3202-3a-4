// HeroSection.jsx - Hero section component for the Landing Page
import { Icons } from "./Icons";
import Button from "./Button";

const HeroSection = () => {
  return (
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
              tailored to your style, preferences, and room dimensions. Let AI
              help you create the perfect environment.
            </p>
            <div className="pt-4">
              <Button
                onClick={() =>
                  document
                    .getElementById("demo-video")
                    .scrollIntoView({ behavior: "smooth" })
                }
                variant="primary"
                className="py-2 px-6 flex items-center group cursor-pointer bg-blue-600 hover:bg-blue-700"
              >
                Learn More
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  <Icons.ArrowRight />
                </span>
              </Button>
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
  );
};

export default HeroSection;
