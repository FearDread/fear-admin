import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, MapPin } from 'lucide-react';
import BannerSub from "../components/Banner/BannerSub";


const PrivacyPolicyPage = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'disclaimers',
      title: 'Legal Disclaimers',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">For Canadian Users</h4>
            <p className="text-gray-600 leading-relaxed">
              As defined under Canadian law, Personal Information means information about an identifiable individual.
              The disclosures mentioned herein are meant to transparently convey the methods of collecting, managing,
              storing, using, protecting, and sharing Personal Information by users. Users grant their consent to this
              Privacy Policy through it being readily available for viewing in accordance with the Personal Information
              Protection and Electronic Documents Act (PIPEDA).
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3">For European Users</h4>
            <p className="text-gray-600 mb-4">We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>The right to access</strong> - You have the right to request our company for copies of your personal data. We may charge you a small fee for this service.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>The right to rectification</strong> - You have the right to request that our company correct any information you believe is inaccurate.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>The right to erasure</strong> - You have the right to request that our company erase your personal data under certain conditions.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>The right to restrict processing</strong> - You have the right to request that our company restrict the processing of your personal data under certain conditions.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>The right to object to processing</strong> - You have the right to object to our company's processing of your personal data under certain conditions.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>The right to data portability</strong> - You have the right to request that our company transfer the data we have collected to another organization or directly to you under certain conditions.</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3">For California Users</h4>
            <p className="text-gray-600 leading-relaxed">
              Your privacy and rights under the California Consumer Privacy Act (CCPA) and the California Online Privacy Protection Act (CalOPPA) are important to us. This Privacy Policy, intended for California residents, can be applied to all website users to disclose how we collect, manage, store, and use your Personal Information as defined under CIV 1798.140(v) of the California Consumer Privacy Act (CCPA).
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact Information',
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4">Website Information</h4>
            <div className="space-y-2">
              <p className="text-gray-600"><strong>Website:</strong> www.e-comix.com</p>
              <p className="text-gray-600"><strong>Website Name:</strong> E-Comix</p>
              <p className="text-gray-600"><strong>Individual Name:</strong> Garrett Haptonstall</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">ghaptonstall@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <Phone className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800">254-435-0130</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-800 text-sm">2003 E. Veterans Memorial Blvd, Apt 4, Killeen, Texas, 76541</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'information-collected',
      title: 'Personal Information Collected',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 mb-4">In the past 12 months, we have or had the intention of collecting the following:</p>
          <div className="grid gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h5 className="font-semibold text-gray-800 mb-2">Identifiers</h5>
              <p className="text-gray-600 text-sm">Real name, address, phone number, email, financial information, physical characteristics, account details, SSN, driver's license number, passport number, and similar identifiers.</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h5 className="font-semibold text-gray-800 mb-2">Commercial Information</h5>
              <p className="text-gray-600 text-sm">Records of products or services purchased, obtained, or considered, and other purchasing or consuming histories.</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h5 className="font-semibold text-gray-800 mb-2">Internet Activity</h5>
              <p className="text-gray-600 text-sm">Browsing history, search history, and information on interaction with websites, applications, or advertisements.</p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h5 className="font-semibold text-gray-800 mb-2">Geolocation Data</h5>
              <p className="text-gray-600 text-sm">Physical location or movements, including city, state, country, ZIP code, and with permission, precise GPS location.</p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h5 className="font-semibold text-gray-800 mb-2">Inferences</h5>
              <p className="text-gray-600 text-sm">Profile reflecting preferences, characteristics, psychological trends, behavior, attitudes, intelligence, abilities, and aptitudes.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cookies',
      title: 'Cookies Policy',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600">Currently, our website uses cookies to provide you with the best experience possible. We may deploy cookies, web beacons, local shared objects, and other tracking technologies for business use, marketing purposes, fraud prevention, and to assist in day-to-day operations.</p>

          <div className="grid gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-800 mb-2">Essential Cookies</h5>
              <p className="text-gray-600 text-sm">Technically necessary cookies that provide basic website functionality and cannot be disabled.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-800 mb-2">Performance Cookies</h5>
              <p className="text-gray-600 text-sm">Used to enhance performance and functionality but are not essential to website use.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-800 mb-2">Advertising Cookies</h5>
              <p className="text-gray-600 text-sm">Used to customize your ad experience and prevent repetitive or unpleasant advertisements.</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Learn More:</strong> Visit <a href="http://www.allaboutcookies.org" className="underline" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a> to learn more about cookies and how to manage them in your browser.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'usage',
      title: 'How We Use Personal Information',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 mb-4">We may use or disclose your Personal Information for the following purposes:</p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h5 className="font-medium text-gray-800">Offerings</h5>
                <p className="text-gray-600 text-sm">To provide products, services, and offerings that serve the best-matched advertisements.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h5 className="font-medium text-gray-800">Alerts</h5>
                <p className="text-gray-600 text-sm">To provide email alerts and communications regarding products and services that may interest you.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h5 className="font-medium text-gray-800">Feedback & Testing</h5>
                <p className="text-gray-600 text-sm">To get feedback on website improvements and for testing, research, and analysis of user behavior.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h5 className="font-medium text-gray-800">Business Assessment</h5>
                <p className="text-gray-600 text-sm">To evaluate or conduct mergers, acquisitions, or sales where your Personal Information may be transferred.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'rights',
      title: 'Your Rights and Choices',
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-semibold text-green-800 mb-2">We DO NOT Sell Your Personal Information</h5>
            <p className="text-green-700 text-sm">Our policy is that we do not sell your personal information. If this should change, you will be notified and this Privacy Policy will be updated.</p>
          </div>

          <div>
            <h5 className="font-semibold text-gray-800 mb-3">Your Rights Include:</h5>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h6 className="font-medium text-gray-800">Access to Information</h6>
                <p className="text-gray-600 text-sm">Request disclosure of information about our collection and use of your Personal Information over the past 12 months.</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h6 className="font-medium text-gray-800">Deletion (Erasure) Rights</h6>
                <p className="text-gray-600 text-sm">Request that we delete your Personal Information, subject to certain exceptions.</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h6 className="font-medium text-gray-800">Non-Discrimination</h6>
                <p className="text-gray-600 text-sm">We will not discriminate against you for exercising any of your privacy rights.</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h6 className="font-semibold text-yellow-800 mb-2">Response Timeline</h6>
            <p className="text-yellow-700 text-sm">We will respond to verifiable consumer requests within 45 days, with a possible extension to 90 days if needed.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      <BannerSub />
      <main className="float-start w-100 total-body home-body mt-0">
        <section className="top-sectionk mt-5 float-start w-100">
          <div className="container standard-container privacy-page text-centered">
            {/* Header */}
            <div className="bg-white shadow-sm ">
              <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                  <p className="text-gray-600">E-Comix</p>
                  <p className="text-sm text-gray-500 mt-2">Effective Date: September 1, 2025</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Table of Contents */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">Table of Contents</h2>
                  <div className="grid md:grid-cols-2 gap-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => toggleSection(section.id)}
                        className="text-left text-blue-600 hover:text-blue-800 text-sm py-1"
                      >
                        {section.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sections */}
                <div className="divide-y">
                  {sections.map((section) => (
                    <div key={section.id} className="px-6 py-6">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between text-left group"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {section.title}
                        </h3>
                        {expandedSection === section.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>

                      {expandedSection === section.id && (
                        <div className="mt-6 animate-fadeIn">
                          {section.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Additional Sections */}
                <div className="px-6 py-6 border-t bg-gray-50">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Security & Protection</h3>
                      <p className="text-gray-600 leading-relaxed">
                        We use reasonable physical, electronic, and procedural safeguards that comply with federal standards to protect and limit access to Personal Information. This includes device safeguards used in accordance with industry standards. Please note that information transmitted electronically may not be completely secure, and we recommend avoiding unsecured channels for sensitive information.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Changes and Amendments</h3>
                      <p className="text-gray-600 leading-relaxed">
                        We reserve the right to amend this Privacy Policy at our discretion and at any time. When we make changes, we will notify you by email or other preferred communication methods.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Third Party Links</h3>
                      <p className="text-gray-600 leading-relaxed">
                        We may provide links to third-party sources. When you visit these links, you will be subject to their privacy policies. We recommend familiarizing yourself with their terms and are not responsible for how third parties handle your Personal Information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Contact */}
              <div className="mt-8 bg-white rounded-lg shadow-sm p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Questions or Concerns?</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href="mailto:ghaptonstall@gmail.com" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                    <Mail className="w-4 h-4" />
                    <span>ghaptonstall@gmail.com</span>
                  </a>
                  <a href="tel:2544350130" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                    <Phone className="w-4 h-4" />
                    <span>254-435-0130</span>
                  </a>
                </div>
              </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
          </div>
        </section>
      </main>
    </>

  );
};

export default PrivacyPolicyPage;