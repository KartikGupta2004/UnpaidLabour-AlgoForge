import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination, Autoplay } from "swiper/modules"
import { ItemGrid } from "../components/CardsGrid"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <ImpactSection />
      <DonationSection />
      <PartnersCarousel />
    </div>
  )
}

// HERO SECTION

function HeroSection() {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden">
      {/* Background with overlay pattern */}
      <div className="absolute inset-0 z-0">
        <img
          src="/placeholder.svg"
          alt="Food donation impact"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/85 to-green-900/80" />
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-block mb-2 px-4 py-1 bg-green-600/20 rounded-full animate-fade-in">
          <span className="text-green-400 text-sm font-semibold tracking-wider">FIGHTING FOOD WASTE TOGETHER</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">How FoodHero Works</h1>
        <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto animate-slide-up">
          Our platform creates a sustainable ecosystem that connects food suppliers with those in need,
          making it easy to reduce waste and address hunger in your community.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-stagger-in">
          {[
            {
              role: "Donate",
              icon: "🍽️",
              description: "Share surplus food easily",
              details: "Restaurants and food providers can quickly list excess food for donation. Our platform handles verification, logistics, and distribution to ensure nothing goes to waste."
            },
            {
              role: "Connect",
              icon: "🔄",
              description: "Smart matching technology",
              details: "Our intelligent system connects available food with the right recipients based on location, quantity, dietary needs, and urgency to create efficient distribution networks."
            },
            {
              role: "Impact",
              icon: "📊",
              description: "Track your contributions",
              details: "Monitor your impact with real-time metrics showing how your donations have helped reduce waste and fight hunger. Share your achievements and inspire others to join."
            }
          ].map((item) => (
            <div
              key={item.role}
              className="group relative rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center"
            >
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">{item.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.role}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {item.description}
              </p>
              <ArrowRight className="w-5 h-5 mx-auto text-green-600 group-hover:translate-x-1 transition-transform duration-300" />
              
              {/* Hover details window - scaled to 110% */}
              <div className="absolute top-0 left-0 right-0 w-full h-auto p-6 bg-green-600 rounded-xl opacity-0 
                  group-hover:opacity-100 transition-all duration-300 
                  transform origin-center scale-0 group-hover:scale-110 z-20
                  flex flex-col justify-center items-center shadow-xl">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl text-white">{item.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{item.role}</h3>
                <p className="text-sm text-white">
                  {item.details}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes staggerIn {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 1s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        .animate-stagger-in > div:nth-child(1) {
          animation: staggerIn 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }
        
        .animate-stagger-in > div:nth-child(2) {
          animation: staggerIn 0.8s ease-out 0.8s forwards;
          opacity: 0;
        }
        
        .animate-stagger-in > div:nth-child(3) {
          animation: staggerIn 0.8s ease-out 1s forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}


// IMPACT SECTION

function ImpactSection() {
  return (
    <section className="py-20 bg-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 text-center relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-green-600/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-600/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <h2 className="text-3xl font-bold mb-4 text-gray-800 relative">
          Our Impact
          <span className="block h-1 w-24 bg-green-600 mx-auto mt-2 rounded-full"></span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Every meal shared and every partnership formed contributes to our mission of reducing food waste and fighting hunger.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ImpactCard 
            title="Total Food Served" 
            value={2500} 
            unit="meals" 
            icon="🍽️"
            delay={0} 
          />
          <ImpactCard 
            title="Total Donations" 
            value={1500} 
            unit="donations" 
            icon="🤲"
            delay={200} 
          />
          <ImpactCard 
            title="Restaurants Partnered" 
            value={350} 
            unit="partners" 
            icon="🍲"
            delay={400} 
          />
          <ImpactCard 
            title="NGOs Partnered" 
            value={120} 
            unit="organizations" 
            icon="🏢"
            delay={600} 
          />
        </div>
      </div>
    </section>
  );
}

function ImpactCard({ title, value, unit, icon, delay }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Delay the animation start based on the delay prop
    const visibleTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(visibleTimer);
  }, [delay]);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const end = value;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / (end / 25)));
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <div 
      className={`p-8 shadow-lg rounded-lg text-center bg-white border-t-4 border-green-600 
                 transform transition-all duration-700 hover:shadow-xl 
                 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <div className="relative">
        <div className="text-4xl font-bold text-green-600 mb-2 flex items-center justify-center">
          {count.toLocaleString()}
          <span className="absolute -right-2 top-0 h-2 w-2 bg-green-600 rounded-full animate-ping"></span>
        </div>
      </div>
      <p className="text-sm text-gray-500 uppercase tracking-wider">{unit}</p>
      
      {/* Progress circle animation */}
      <svg className="w-full h-1 mt-4" viewBox="0 0 100 1">
        <line 
          x1="0" y1="0.5" x2="100" y2="0.5" 
          stroke="#e5e7eb" 
          strokeWidth="1" 
        />
        <line 
          x1="0" y1="0.5" x2={(count / value) * 100} y2="0.5" 
          stroke="#059669" 
          strokeWidth="1" 
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
    </div>
  );
}

import { ArrowRight, Heart, ShoppingCart } from 'lucide-react';

function DonationSection() {
  const role = localStorage.getItem('userType');
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gray-50 skew-y-3 transform origin-top-left -z-10"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-gray-800">Support Our Mission</h2>
          <div className="h-1 w-20 bg-green-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Together we can create a world where no food goes to waste and no one goes hungry.
          </p>
        </div>
        
        <div className={`${role !== 'ngo' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'flex justify-center items-center'}`}>
          {/* Donation Card */}
          <div 
            className={`bg-white rounded-2xl p-8 shadow-lg border-l-4 border-green-600 
                      transform transition-all duration-700 hover:shadow-xl
                      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Heart className="text-green-600 w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Make a Difference Today</h2>
                <div className="h-1 w-16 bg-green-600 rounded-full"></div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your donation helps us fight food waste and hunger in communities across the country. 
              Every contribution matters in our mission to create sustainable food systems.
            </p>
            
            <div className="flex justify-between items-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                  <span className="text-xs font-medium">🙏</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-300 flex items-center justify-center">
                  <span className="text-xs font-medium">🍎</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                  <span className="text-xs font-medium">150+</span>
                </div>
              </div>
              
              <Link to='/donation'>
                <button className="rounded-full bg-green-600 text-white px-6 py-3 text-lg font-medium
                                  hover:bg-green-700 transition-colors duration-300 flex items-center">
                  {role !== 'ngo' ? 'Donate Now' : 'Request Donation'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
          
          {/* Marketplace Card */}
          {role !== 'ngo' && (
            <div 
              className={`bg-white rounded-2xl p-8 shadow-lg border-l-4 border-black 
                        transform transition-all duration-700 hover:shadow-xl
                        ${isVisible ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-10 opacity-0'}`}
            >
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <ShoppingCart className="text-gray-800 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">Food Marketplace</h2>
                  <div className="h-1 w-16 bg-black rounded-full"></div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Buy & sell surplus food at affordable prices, reducing waste and helping the community.
                Connect directly with local restaurants and food suppliers.
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-medium">💰</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium">🥗</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-xs font-medium">200+</span>
                  </div>
                </div>
                
                <Link to='/marketplace'>
                  <button className="rounded-full bg-black text-white px-6 py-3 text-lg font-medium
                                    hover:bg-gray-800 transition-colors duration-300 flex items-center">
                    Explore Marketplace
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          )}

{role === 'individual' && (
            <div 
              className={`bg-white rounded-2xl p-8 shadow-lg border-l-4 border-black 
                        transform transition-all duration-700 hover:shadow-xl
                        ${isVisible ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-10 opacity-0'}`}
            >
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <ShoppingCart className="text-gray-800 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">Earn Free Rewards</h2>
                  <div className="h-1 w-16 bg-black rounded-full"></div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Share a photo of you volunteering to donate people to the needy and earn virtue points in FoodHero.
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-medium"> </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium"> </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-xs font-medium"> </span>
                  </div>
                </div>
                
                <Link to='/facerecognition'>
                  <button className="rounded-full bg-black text-white px-6 py-3 text-lg font-medium
                                    hover:bg-gray-800 transition-colors duration-300 flex items-center">
                    Earn Rewards
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

function PartnersCarousel() {
  const partners = Array.from({ length: 10 }, (_, i) => `/partners/rest-${i + 1}.png`);
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-70"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-50 rounded-full translate-x-1/3 translate-y-1/3 opacity-70"></div>
      
      <div className="container mx-auto px-4 text-center relative">
        <h2 className="text-3xl font-bold mb-3 text-gray-800">Our Trusted Partners</h2>
        <div className="h-1 w-20 bg-green-600 mx-auto rounded-full mb-6"></div>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          We're proud to work with these amazing organizations committed to reducing food waste and fighting hunger.
        </p>
        
        <div className="relative">
          {/* Gradient overlays for carousel edges */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          <Swiper
            modules={[Autoplay]}
            slidesPerView={2}
            spaceBetween={30}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="pb-8"
          >
            {partners.map((src, index) => (
              <SwiperSlide key={index} className="flex justify-center items-center h-40">
                <div className="transform transition-all duration-300 hover:scale-110 p-4 bg-white rounded-xl shadow-md">
                  <img 
                    src={src} 
                    alt={`Partner ${index + 1}`} 
                    className="w-24 h-24 object-contain hover: transition-all duration-300" 
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <div className="mt-10">
          
        </div>
      </div>
    </section>
  );
}
