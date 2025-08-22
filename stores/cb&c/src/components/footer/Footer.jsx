import { useState } from 'react';
import { Send, Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage('');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerSections = [
    {
      title: "Customer Service",
      links: [
        { name: "Help Portal", href: "/contact" },
        { name: "Contact Us", href: "/contact" },
        { name: "Delivery Information", href: "/delivery" },
        { name: "Click and Collect", href: "/collect" },
        { name: "Refunds and Returns", href: "/returns" }
      ]
    },
    {
      title: "Get to Know Us",
      links: [
        { name: "About Us", href: "/about" },
        { name: "News & Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Investors", href: "/investors" },
        { name: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "New Collections",
      links: [
        { name: "E-Cigarettes", href: "/shop/e-cigarettes" },
        { name: "Vape Pens", href: "/shop/vape-pens" },
        { name: "Pod Systems", href: "/shop/pod-systems" },
        { name: "Disposable Vapes", href: "/shop/disposable" },
        { name: "Nicotine Salt Devices", href: "/shop/nicotine-salt" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
      </div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Footer Content */}
          <div className="py-16 border-t border-b border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Footer Sections */}
              {footerSections.map((section, index) => (
                <div key={index} className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-6 relative">
                    {section.title}
                    <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-2"></div>
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                        >
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Newsletter Section */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white mb-6 relative">
                  Get Newsletter
                  <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-2"></div>
                </h4>
                
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400 transition-colors duration-300"
                    />
                    <button
                      onClick={handleNewsletterSubmit}
                      disabled={isSubmitting || !email}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-md hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                  
                  {message && (
                    <p className={`text-sm ${message.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}>
                      {message}
                    </p>
                  )}
                </div>

                {/* Social Icons */}
                <div className="flex space-x-4 pt-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        aria-label={social.label}
                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-110"
                      >
                        <IconComponent className="w-5 h-5 text-gray-300 hover:text-white" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="py-12 flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="inline-block">
                <div className="w-32 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">ODOR</span>
                </div>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-gray-400">
                © Copyright 2023{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                  odor
                </a>{' '}
                All Rights Reserved
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">We Accept:</span>
              <div className="flex space-x-2">
                {['VISA', 'MC', 'AMEX', 'PP'].map((method, index) => (
                  <div
                    key={index}
                    className="w-12 h-8 bg-gray-800 rounded border border-gray-600 flex items-center justify-center"
                  >
                    <span className="text-xs font-semibold text-gray-300">{method}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Info Bar */}
          <div className="border-t border-gray-700 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">support@odor.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">123 Vape Street, City, State</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}