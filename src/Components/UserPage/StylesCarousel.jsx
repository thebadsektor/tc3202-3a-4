import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const StylesCarousel = ({ questions }) => {
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-white mb-8">
        Popular Design Styles
      </h2>
      <style>
        {`
         @import 'swiper/css';
         @import 'swiper/css/pagination';
         @import 'swiper/css/autoplay';

         .swiper {
           width: 100%;
           padding-bottom: 40px;
         }

         .swiper-slide {
           width: 33.333%;
           height: auto;
         }

         .swiper-pagination {
           bottom: 0;
         }

         .swiper-pagination-bullet {
           background: #ffffff;
           opacity: 0.5;
         }

         .swiper-pagination-bullet-active {
           background: #ffffff;
           opacity: 1;
         }
       `}
      </style>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className="mb-8"
      >
        {questions[0].images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative group cursor-pointer">
              <img
                src={image}
                alt={questions[0].options[index]}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-xl font-semibold">
                  {questions[0].options[index]}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default StylesCarousel;
