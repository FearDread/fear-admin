import { Play, ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

export default function About () {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* About Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="/api/placeholder/600/400" 
                alt="about" 
                className="rounded-lg w-full" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center animate-pulse hover:bg-orange-600 transition-colors cursor-pointer">
                  <a 
                    href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I" 
                    className="text-white text-xl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play size={24} fill="white" />
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center mb-6">
                <span className="w-12 h-1 bg-orange-500 mr-4"></span>
                <h2 className="text-4xl font-bold">We Are Here To Increase Your Modern Life</h2>
              </div>
              <p className="text-gray-300 mb-12 leading-relaxed">
                Sell globally in minutes with localized currencies languages, and experience in every
                market. only a variety of vaping products globally in with localized currencies languages globally in
                with localized currencies languages Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Neque exercitationem perspiciatis rem sed ipsum assumenda nemo
                praesentium blanditiis tempora consequuntur cum beatae saepe facere quis dolore
                dignissimos nihil.
              </p>
              <a 
                href="#" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md transition-colors inline-block"
              >
                More About us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Section */}
      <section 
        className="py-32 bg-gray-800 relative" 
        style={{
          backgroundImage: 'url(/api/placeholder/1200/600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-12">
              <div className="flex items-center">
                <img src="/api/placeholder/64/64" alt="delivery icon" className="w-16 h-16 mr-4" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-white">Free delivery</h4>
                  <p className="text-gray-300">For all orders above $45</p>
                </div>
              </div>
              <div className="flex items-center">
                <img src="/api/placeholder/64/64" alt="security icon" className="w-16 h-16 mr-4" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-white">Secure payments</h4>
                  <p className="text-gray-300">Confidence on all your devices</p>
                </div>
              </div>
            </div>
            
            <div className="text-center hidden lg:block">
              <img src="/api/placeholder/300/300" alt="service" className="mx-auto mb-6" />
              <div className="flex items-center justify-center">
                <span className="w-8 h-1 bg-orange-500 mr-3"></span>
                <h2 className="text-2xl font-bold text-white">sign up & save 25%</h2>
              </div>
            </div>
            
            <div className="space-y-12">
              <div className="flex items-center">
                <img src="/api/placeholder/64/64" alt="support icon" className="w-16 h-16 mr-4" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-white">Top-notch support</h4>
                  <p className="text-gray-300">sayhello@gaza.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <img src="/api/placeholder/64/64" alt="return icon" className="w-16 h-16 mr-4" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-white">180 Days Return</h4>
                  <p className="text-gray-300">money back guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between p-16 border-b border-gray-700">
              <div className="flex items-center">
                <span className="w-8 h-1 bg-orange-500 mr-3"></span>
                <h2 className="text-3xl font-bold">customers speak for us</h2>
              </div>
              <div className="flex space-x-3">
                <button className="w-12 h-12 border border-gray-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="p-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Kenneth S. Fisher</h3>
                      <span className="text-gray-400">marketing manager</span>
                    </div>
                    <Quote size={32} className="text-orange-500" />
                  </div>
                  <p className="text-gray-300 mb-8">
                    posuere luctus orci. Donec vitae mattis quam, vitae tempor arcu.
                    Aenean non odio porttitor, convallis erat sit amet, facilisis velit.
                    Nulla ornare convallis malesuada. Phasellus molestie, ipsum ac
                    fringilla.
                  </p>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} className="text-orange-500" fill="currentColor" />
                    ))}
                  </div>
                </div>
                <div>
                  <img src="/api/placeholder/300/300" alt="Kenneth S. Fisher testimonial" className="rounded-lg w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}