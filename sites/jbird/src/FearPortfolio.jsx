import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Send, Check, Frown } from 'lucide-react';

const FearPortfolio = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isSayHelloOpen, setIsSayHelloOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [notifyStatus, setNotifyStatus] = useState('');
  const [sayHelloStatus, setSayHelloStatus] = useState('');
  
  const roles = ['Graphic Designer', '3D Artist', 'Illustrator'];
  const trianglesRef = useRef(null);
  
  // Typing animation effect
  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    let timeoutId;
    
    if (isTyping) {
      if (typedText.length < currentRole.length) {
        timeoutId = setTimeout(() => {
          setTypedText(currentRole.slice(0, typedText.length + 1));
        }, 100);
      } else {
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (typedText.length > 0) {
        timeoutId = setTimeout(() => {
          setTypedText(typedText.slice(0, -1));
        }, 50);
      } else {
        setCurrentRoleIndex((currentRoleIndex + 1) % roles.length);
        setIsTyping(true);
      }
    }
    
    return () => clearTimeout(timeoutId);
  }, [typedText, currentRoleIndex, isTyping, roles]);

  // Animated triangles background
  useEffect(() => {
    const canvas = trianglesRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const triangles = [];
    const numTriangles = 15;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create triangles
    for (let i = 0; i < numTriangles; i++) {
      triangles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 100 + 50,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      triangles.forEach(triangle => {
        ctx.save();
        ctx.translate(triangle.x, triangle.y);
        ctx.rotate(triangle.rotation);
        ctx.globalAlpha = triangle.opacity;
        
        ctx.beginPath();
        ctx.moveTo(0, -triangle.size / 2);
        ctx.lineTo(-triangle.size / 2, triangle.size / 2);
        ctx.lineTo(triangle.size / 2, triangle.size / 2);
        ctx.closePath();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
        
        triangle.rotation += triangle.rotationSpeed;
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (sectionId) => {
    setCurrentSection(sectionId);
    setIsMenuOpen(false);
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNotifySubmit = (e) => {
    if (e) e.preventDefault();
    setNotifyStatus('success');
    setTimeout(() => {
      setNotifyStatus('');
      setIsNotifyOpen(false);
    }, 3000);
  };

  const handleSayHelloSubmit = (e) => {
    if (e) e.preventDefault();
    setSayHelloStatus('success');
    setTimeout(() => {
      setSayHelloStatus('');
      setIsSayHelloOpen(false);
    }, 3000);
  };

  const portfolioItems = [
    {
      id: 1,
      title: 'Spider Man',
      category: 'Art / Illustration',
      description: 'Mauris porttitor lobortis ligula, quis molestie lorem scelerisque eu. Morbi aliquam enim odio, a mollis ipsum tristique eu.',
      image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&h=600&fit=crop'
    },
    {
      id: 2,
      title: 'Human Eye',
      category: 'Art / Illustration', 
      description: 'Mauris porttitor lobortis ligula, quis molestie lorem scelerisque eu. Morbi aliquam enim odio, a mollis ipsum tristique eu.',
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=600&fit=crop'
    },
    {
      id: 3,
      title: 'SPAWN',
      category: 'Art / Drawings',
      description: 'Mauris porttitor lobortis ligula, quis molestie lorem scelerisque eu. Morbi aliquam enim odio, a mollis ipsum tristique eu.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop'
    },
    {
      id: 4,
      title: 'Iron Man',
      category: 'Art / Sketches',
      description: 'Mauris porttitor lobortis ligula, quis molestie lorem scelerisque eu. Morbi aliquam enim odio, a mollis ipsum tristique eu.',
      image: 'https://images.unsplash.com/photo-1635805737518-6d32b0bb5a8d?w=500&h=600&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Loader - Simple version since we're in React */}
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-1000 opacity-0 pointer-events-none">
        <div className="text-4xl font-bold tracking-wider">FEAR</div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full h-full bg-black z-40 transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <ul className="space-y-8">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'works', label: 'Artwork' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="block text-2xl md:text-4xl font-light hover:text-gray-400 transition-colors duration-300 group"
                  >
                    <span className="block group-hover:translate-x-2 transition-transform duration-300">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-30 p-6 md:p-8">
        <div className="flex justify-between items-center">
          <div className="text-2xl md:text-3xl font-bold tracking-wider">
            FEAR
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsNotifyOpen(true)}
              className="hidden md:flex items-center space-x-2 px-4 py-2 border border-white/20 hover:bg-white hover:text-black transition-colors duration-300"
            >
              <Send size={16} />
              <span>Subscribe</span>
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 flex items-center justify-center"
            >
              <div className={`w-6 h-6 relative transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <section id="home" className="relative min-h-screen flex items-center">
        {/* Animated Background */}
        <canvas
          ref={trianglesRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)' }}
        />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-8">
          <div className="max-w-3xl">
            <p className="text-sm md:text-base text-gray-400 mb-4 tracking-wide">Let's meet</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              I'm Robert Hall
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </h1>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="flex items-center justify-center space-x-2 px-8 py-4 bg-white text-black hover:bg-gray-200 transition-colors duration-300 group">
                <span>Download CV</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button
                onClick={() => setIsSayHelloOpen(true)}
                className="px-8 py-4 border border-white/20 hover:bg-white hover:text-black transition-colors duration-300"
              >
                Say hello
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="md:hidden absolute bottom-0 left-0 w-full p-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              {['Fb', 'In', 'X', 'Be'].map((social) => (
                <a key={social} href="#" className="text-sm hover:text-gray-400 transition-colors">
                  {social}
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-400">© FEAR - Admin, 2025</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center py-20">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-8">
                <div>
                  <p className="text-sm text-gray-400 mb-4 tracking-wide">01 / About Me</p>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    Creativity is above all. Just awesome template.
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    I wonder if I've been changed in the night? <a href="#" className="text-white underline hover:no-underline">Let me think.</a> Was I the same when I got up this morning?
                    I almost think I can remember feeling a little different. 
                    But if I'm not the same, the next question is 'Who in the world am I?' Ah, that's the great puzzle!
                  </p>
                </div>
                
                <div className="space-y-6">
                  {[
                    { skill: 'UI/UX Design', percentage: 96 },
                    { skill: 'Branding', percentage: 90 },
                    { skill: '3D Modeling', percentage: 87 }
                  ].map((item) => (
                    <div key={item.skill} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white">{item.skill}</span>
                        <span className="text-white">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-800 h-1 rounded">
                        <div 
                          className="bg-white h-1 rounded transition-all duration-1000 ease-out"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face"
                  alt="About"
                  className="w-full h-[500px] md:h-[600px] object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/80 p-4">
                  <p className="text-white font-medium">Lost in Space</p>
                  <p className="text-gray-400 text-sm">Editorial / Render</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Works Section */}
      <section id="works" className="min-h-screen flex items-center py-20">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <div className="space-y-8">
                <div>
                  <p className="text-sm text-gray-400 mb-4 tracking-wide">02 / Projects</p>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    We are creating unique staff. Meet our featured projects.
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Be what you would seem to be - or, if you'd like it put more simply - never <a href="#" className="text-white underline hover:no-underline">imagine yourself</a> not to be otherwise than 
                    what it might appear to others that what you were or might have been was not otherwise than what you had been would have appeared to them to be otherwise.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { title: 'Eye catching design' },
                    { title: 'Trendy colors and fonts' },
                    { title: 'Smooth section transitions' },
                    { title: 'Ready-to-use contact form' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/10 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white" />
                      </div>
                      <h3 className="text-white font-medium">{feature.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-2 gap-4">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="group cursor-pointer">
                    <div className="relative overflow-hidden mb-4">
                      <img 
                        src={item.image}
                        alt={item.title}
                        className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center p-4">
                          <h4 className="text-white font-bold mb-1">{item.title}</h4>
                          <p className="text-gray-300 text-sm mb-2">{item.category}</p>
                          <p className="text-gray-400 text-xs">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center py-20">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="space-y-8">
                <div>
                  <p className="text-sm text-gray-400 mb-4 tracking-wide">03 / Contact</p>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    Let's get in touch. Welcome to the new office.
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Our website is under construction but we are ready to go! You can <a href="tel:+12127089400" className="text-white underline hover:no-underline">call us</a> or leave a request here. 
                    We are always glad to see you in our office from <span className="text-white">9:00</span> to <span className="text-white">18:00</span>.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h5 className="text-white font-semibold mb-4">Location</h5>
                    <div className="space-y-4 text-gray-300 text-sm">
                      <div className="flex items-start space-x-2">
                        <MapPin size={16} className="mt-1 flex-shrink-0" />
                        <div>
                          <p>11 West 53 Street,<br />New York, NY 10019</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin size={16} className="mt-1 flex-shrink-0" />
                        <div>
                          <p>3400 Broadway,<br />Oakland, CA 94611</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-white font-semibold mb-4">Contact</h5>
                    <div className="space-y-4 text-gray-300 text-sm">
                      <div className="flex items-start space-x-2">
                        <Phone size={16} className="mt-1 flex-shrink-0" />
                        <div>
                          <p>+1 212-708-9400<br />+1 510-457-0211</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Mail size={16} className="mt-1 flex-shrink-0" />
                        <div>
                          <p>hello@ignite.com<br />help@ignite.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-white font-semibold mb-4">Follow us</h5>
                    <div className="space-y-2 text-gray-300 text-sm">
                      {[
                        { icon: Facebook, name: 'Facebook' },
                        { icon: Instagram, name: 'Instagram' },
                        { icon: Twitter, name: 'Behance' },
                        { icon: Send, name: 'Pinterest' }
                      ].map((social) => (
                        <div key={social.name} className="flex items-center space-x-2">
                          <social.icon size={16} />
                          <a href="#" className="hover:text-white transition-colors">{social.name}</a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=600&h=800&fit=crop"
                  alt="Contact"
                  className="w-full h-[500px] md:h-[600px] object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/80 p-4">
                  <p className="text-white font-medium">Imagination Flight</p>
                  <p className="text-gray-400 text-sm">Editorial / Render</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Footer */}
      <footer className="hidden md:block fixed bottom-0 left-0 w-full z-20 p-6 md:p-8">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            {['Fb', 'In', 'X', 'Be'].map((social) => (
              <a key={social} href="#" className="text-sm hover:text-gray-400 transition-colors">
                {social}
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-400">© FEAR - Admin, 2025</p>
        </div>
      </footer>

      {/* Notify Popup */}
      {isNotifyOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-8 max-w-md w-full relative">
            <button
              onClick={() => setIsNotifyOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-400"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Subscribe to my latest updates</h3>
              <p className="text-gray-400">And be the first to know about my new projects, ideas and work in process</p>
            </div>
            
            {notifyStatus === 'success' ? (
              <div className="text-center">
                <Check className="mx-auto mb-2 text-green-400" size={32} />
                <h4 className="text-white font-bold mb-1">Done!</h4>
                <p className="text-gray-400">Thanks for subscribing!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                />
                <button
                  onClick={handleNotifySubmit}
                  className="w-full py-3 bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Say Hello Popup */}
      {isSayHelloOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-8 max-w-md w-full relative">
            <button
              onClick={() => setIsSayHelloOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-400"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold">Let's talk!</h3>
            </div>
            
            {sayHelloStatus === 'success' ? (
              <div className="text-center">
                <Check className="mx-auto mb-2 text-green-400" size={32} />
                <h4 className="text-white font-bold mb-1">Done!</h4>
                <p className="text-gray-400">Thanks for your message. I'll get back as soon as possible</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    className="p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    required
                    className="p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                  />
                </div>
                <textarea
                  placeholder="A Few Words"
                  required
                  rows={4}
                  className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none resize-none"
                />
                <button
                  onClick={handleSayHelloSubmit}
                  className="w-full py-3 bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FearPortfolio;