import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination, Autoplay } from "swiper/modules"
import { ItemGrid } from "../components/CardsGrid"
import ChatBot from "../components/ChatBot";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <HeroSection />
      <ImpactSection />
      <DonationSection />
      <PartnersCarousel /> */}
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Available Items</h1>
        <ItemGrid />
      </div>
    </div>
  )
}

// HERO SECTION
function HeroSection() {
  return (
    <section className="relative w-full py-20 md:py-32">
      <div className="absolute inset-0 z-0">
        <img
          src="/placeholder.svg"
          alt="Food donation impact"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-700/70" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">What We Do</h1>
        <p className="text-lg text-gray-300 mb-8">
          FoodHero connects surplus food with those who need it most, reducing waste and fighting hunger.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {["Restaurant", "Individual", "NGO"].map((role) => (
            <div
            //   to={`/${role.toLowerCase()}`}
              key={role}
              className="group relative rounded-xl bg-white shadow-md hover:shadow-lg transition p-6 text-center"
            >
              <h3 className="text-xl font-semibold mb-2">{role}</h3>
              <p className="text-sm text-gray-600">
                {role === "Restaurant" && "Share your surplus food"}
                {role === "Individual" && "Donate or volunteer your time"}
                {role === "NGO" && "Partner to connect to food sources"}
              </p>
              <ChevronRight className="text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// IMPACT SECTION
function ImpactSection() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">Our Impact</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ImpactCard title="Total Food Served" value={2500000} unit="meals" />
          <ImpactCard title="Total Donations" value={15000} unit="donations" />
          <ImpactCard title="Restaurants Partnered" value={350} unit="partners" />
          <ImpactCard title="NGOs Partnered" value={120} unit="organizations" />
        </div>
      </div>
    </section>
  )
}

function ImpactCard({ title, value, unit }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 2000
    const stepTime = Math.abs(Math.floor(duration / end))
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 50)
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, stepTime)
    
    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="p-6 shadow-md rounded-lg text-center bg-white">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="text-3xl font-bold text-primary mb-1">{count.toLocaleString()}</div>
      <p className="text-sm text-gray-500">{unit}</p>
    </div>
  )
}

// DONATION SECTION
function DonationSection() {
    const role = localStorage.getItem('userType')

    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className={`${role != 'ngo' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'flex justify-center items-center'}`}>
            {/* Donation Card */}
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <h2 className="text-3xl font-bold mb-4">Make a Difference Today</h2>
                <p className="text-lg text-gray-600 mb-6">
                    Your donation helps us fight food waste and hunger in communities across the country.
                </p>
                <Link to='/'>
                <button className="rounded-full bg-green-400 text-black px-6 py-3 text-lg hover:cursor-pointer">
                    {role != 'ngo' ? 'Donate Now' : 'Request Donation'}
                </button>
                </Link>
                </div>
            {/* Marketplace Card */}
            
                {role != 'ngo' && <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <h2 className="text-3xl font-bold mb-4">Food Marketplace</h2>
                <p className="text-lg text-gray-600 mb-6">
                    Buy & sell surplus food at affordable prices, reducing waste and helping the community.
                </p>
                <Link to='/'>
                <button className="rounded-full bg-green-400 text-black px-6 py-3 text-lg hover:cursor-pointer">
                    Explore Marketplace
                </button>
                </Link>
                </div>}
          </div>
        </div>
      </section>
    )
  }  

  function PartnersCarousel() {
    const partners = Array.from({ length: 10 }, (_, i) => `/partners/rest-${i + 1}.png`)
  
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Partners</h2>
  
          <Swiper
            modules={[Autoplay]}
            slidesPerView={2}
            spaceBetween={20}
            loop={true}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="pb-8"
          >
            {partners.map((src, index) => (
              <SwiperSlide key={index} className="flex justify-center">
                <img src={src} alt={`Partner ${index + 1}`} className="rounded-lg shadow-md w-32 h-32 object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    )
  }
