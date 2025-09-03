import { useState } from 'react';
import { X } from 'lucide-react';

export const TermsModal = () {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    terms: false,
    privacy: false,
    newsletter: false,
    updates: false
  });

  const handleCheckboxChange = (item) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleSubmit = () => {
    console.log('Selected items:', checkedItems);
    // Handle the submission logic here
    setIsOpen(false);
  };

  const termsContent = `TERMS AND CONDITIONS
Effective Date: September 1 2025
Last Updated: September 1 2025

AGREEMENT TO TERMS.
The Terms of Use Agreement ("Agreement"), created on the effective date and last amended on date above, is made between you ("user," "you" or "your"), and:

WEBSITE OWNER.
Website URL: www.e-comix.com
Individual's Name: Garrett Haptonstall
Street Address: 2003 E. Veterans Memorial Blvd, Apt 4, Killeen, Texas, 76541
E-Mail: ghaptonstall@gmail.com
Phone: 2544350130

PAYMENTS.
All or a portion of the services offered by the Company on the website are paid in accordance with the terms below:

a.) Forms of Payment. We accept payment through the methods offered at the time of purchase or when a balance is due. The provider and method of payment are determined by your location, device, and purchased item. We reserve the right, at any time, to reject payment for any reason.

b.) Currency. Payments will be accepted on the website in the currency based on your location and in accordance with local laws.

c.) Refund Policy. Except when required by law, payments made by a user are not refundable by the Company. Refund requests are administered on a case-by-case basis and, if granted, do so at the sole discretion of the Company.

ACCESS.
Your access to and use of the website and the services is conditional upon your acceptance of and compliance with this Agreement, which applies to all the website's visitors. If for any reason, you do not agree with any of the terms of this Agreement, you may not access the website or its services.

PROHIBITED ACTIVITIES.
As a user of our services, whether on the website or mobile app, it is prohibited to engage in the following activities:

-Systematically retrieve data or other content from the website or services to create or compile, directly or indirectly, a collection, compilation, database, or directory without our written permission;
-Trick, defraud, or mislead other users or us, especially in any attempt to learn sensitive account information such as user passwords;
-Circumvent, disable, or otherwise interfere with security-related features of the website or services;
-Disparage, tarnish, or otherwise harm the Company, website, mobile app, or any other platforms where the services are offered;
-Use any information obtained from the website or the service to harass, abuse, or harm another person or group of people;
-Make improper use of our support services, specifically, our customer service representatives, or make false reports of abuse or misconduct;
-Use the website or services in a manner that is inconsistent with its intended use or against any applicable laws;

COPYRIGHT POLICY.
a.) Intellectual Property Infringement.
It is our duty to respect the intellectual property rights of others. Therefore, it is our policy to respond to any claim that infringes on any trademark, copyright, or other intellectual property protected under law.

USER OBLIGATIONS.
You, as a user of the website or any of its services, agree to the following:
-Any information used for registration purposes, if required, must be submitted in an accurate and completed manner;
-If any information should change regarding your account, you agree to change it in a timely fashion;
-You have the legal capacity to understand, agree with, and comply with this Agreement;
-That you are not considered a minor in the jurisdiction where you reside or are accessing the website or its services;
-That you will not access the website or its services through the use of bots, scripts, or any other use than the traditional manner as is intended;
-That you will use the website and its services in an authorized and legal manner in accordance with this Agreement.

TERMINATION.
We may terminate or suspend your account for any reason and at our sole discretion. If your account is suspended or terminated, we may or may not provide prior notice. Upon termination, your access to the website and/or services will cease immediately.

GOVERNING LAW.
The laws governing the Company's jurisdiction mentioned herein shall govern this Agreement, including your use and access to the website and services.

"AS-IS" DISCLAIMER.
It is recognized to you, as a user of the website and any services offered, that they are provided on an "as-is," "where is," and "as available" basis, including faults and defects without warranty.`;

  return (
    <div className="p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Register for E-Comix
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Terms and Conditions - E-Comix
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Terms Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-gray-50 border rounded-lg p-4 mb-6 h-64 overflow-y-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {termsContent}
                </pre>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={checkedItems.terms}
                    onChange={() => handleCheckboxChange('terms')}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                    I have read and agree to the Terms and Conditions
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={checkedItems.privacy}
                    onChange={() => handleCheckboxChange('privacy')}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-700 cursor-pointer">
                    I accept the Privacy Policy (available at www.e-comix.com/privacy)
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={checkedItems.newsletter}
                    onChange={() => handleCheckboxChange('newsletter')}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-700 cursor-pointer">
                    Subscribe to E-Comix newsletter for updates and promotions (optional)
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="updates"
                    checked={checkedItems.updates}
                    onChange={() => handleCheckboxChange('updates')}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="updates" className="text-sm text-gray-700 cursor-pointer">
                    Receive notifications about new comic releases and features (optional)
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              {(!checkedItems.terms || !checkedItems.privacy) && (
                <p className="text-xs text-red-500 mb-3">
                  You must accept the Terms and Conditions and Privacy Policy to continue
                </p>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!checkedItems.terms || !checkedItems.privacy}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Accept & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TermsModal;