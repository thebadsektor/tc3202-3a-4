// StylesSection.jsx - Design styles section component for the Landing Page

const StylesSection = () => {
  const styles = [
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
  ];

  return (
    <section className="py-16 bg-[#1A1F2A]" id="styles">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Popular Design Styles
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our collection of trending interior design styles that can
            transform your space into something extraordinary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {styles.map((style, index) => (
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
  );
};

export default StylesSection;
