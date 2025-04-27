// DemoSection.jsx - Demo video section component for the Landing Page

const DemoSection = () => {
  return (
    <section className="py-16 bg-[#1A1F2A]" id="demo-video">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Watch Our Demo Video
          </h2>
          <div className="relative pt-[56.25%] w-full rounded-lg overflow-hidden shadow-xl">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/TWQGO2Fj4zA?si=f7sNPYBc8ZDUPC_7"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
