// lib/legal/content.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import type { AccentKey } from './tokens';

// lib/legal/content.tsx
export type PolicySlug = 'terms' | 'privacy' | 'returns' | 'shipping' | 'cookies';

export type Block =
  | { type: 'p'; text: ReactNode }
  | { type: 'sub'; text: string }
  | { type: 'highlight'; text: ReactNode }
  | { type: 'list'; items: ReactNode[] }
  | { type: 'contact'; items: { icon: string; label: string; val: string; href?: string }[] };

export interface PolicySection {
  id: string;
  num?: string;
  title: string;
  accentKey?: AccentKey; // overrides page accent for this section only
  blocks: Block[];
}

export interface QuickInfoItem {
  icon: string;
  label: string;
  val: string;
  accentKey: AccentKey;
}

export interface PolicyConfig {
  slug: PolicySlug;
  ghost: string;
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  accentKey: AccentKey;
  metaBar: { icon: string; label: string; val: string }[];
  heroMeta: string[];
  quickInfo?: QuickInfoItem[];
  intro?: { id: string; num?: string; title?: string; blocks: Block[] };
  nav: { id: string; label: string }[];
  sections: PolicySection[];
  related: { label: string; href: string; icon: string };
  relatedLabel: string; // 'Related Documents' | 'Related Policies'
  relatedAccentKey: AccentKey;
  cta: { title: string; body: string; href: string; label: string; accentKey?: AccentKey };
  extraCta?: { title: string; body: string; accentKey?: AccentKey };
  lastUpdated: string;
  metaDescription: string;
}

const EMAIL = 'fear.dread@underworld.dog';

export const POLICIES: Record<PolicySlug, PolicyConfig> = {
  // ── TERMS ──────────────────────────────────────────────────────────
  terms: {
    slug: 'terms',
    ghost: 'TERMS',
    eyebrow: 'Legal · Last Updated January 2026',
    titlePrefix: 'Terms of',
    titleAccent: 'Service',
    accentKey: 'orange',
    metaBar: [
      { icon: '📅', label: 'Last updated', val: 'January 2026' },
      { icon: '🏢', label: 'Operator', val: 'FEAR Inc.' },
      { icon: '⚖️', label: 'Jurisdiction', val: 'United States' },
    ],
    heroMeta: ['20 sections', '~12 min read', 'FEAR Inc.'],
    lastUpdated: 'January 2026',
    metaDescription: 'Terms of Service for eFear — the terms and conditions governing use of our site and Services.',
    intro: {
      id: 'overview',
      num: 'Overview',
      title: 'Overview',
      blocks: [
        { type: 'p', text: `This website is operated by FEAR Inc. Throughout the site, the terms "we", "us" and "our" refer to FEAR Inc. FEAR Inc. offers this website, including all information, tools and Services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.` },
        { type: 'p', text: `By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.` },
        { type: 'highlight', text: `Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any Services.` },
      ],
    },
    nav: [
      { id: 's1', label: '§1 — Online Store Terms' },
      { id: 's2', label: '§2 — General Conditions' },
      { id: 's3', label: '§3 — Accuracy & Timeliness' },
      { id: 's4', label: '§4 — Modifications' },
      { id: 's5', label: '§5 — Products & Services' },
      { id: 's6', label: '§6 — Billing & Accounts' },
      { id: 's7', label: '§7 — Optional Tools' },
      { id: 's8', label: '§8 — Third-Party Links' },
      { id: 's9', label: '§9 — User Submissions' },
      { id: 's10', label: '§10 — Personal Information' },
      { id: 's11', label: '§11 — Errors & Omissions' },
      { id: 's12', label: '§12 — Prohibited Uses' },
      { id: 's13', label: '§13 — Disclaimer' },
      { id: 's14', label: '§14 — Indemnification' },
      { id: 's15', label: '§15 — Severability' },
      { id: 's16', label: '§16 — Termination' },
      { id: 's17', label: '§17 — Entire Agreement' },
      { id: 's18', label: '§18 — Governing Law' },
      { id: 's19', label: '§19 — Changes to Terms' },
      { id: 's20', label: '§20 — Contact' },
    ],
    sections: [
      { id: 's1', num: 'Section 01', title: 'Online Store Terms', blocks: [
        { type: 'p', text: `By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.` },
        { type: 'p', text: `You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).` },
        { type: 'p', text: `You must not transmit any worms or viruses or any code of a destructive nature.` },
        { type: 'p', text: `A breach or violation of any of the Terms will result in an immediate termination of your Services.` },
      ]},
      { id: 's2', num: 'Section 02', title: 'General Conditions', blocks: [
        { type: 'p', text: `We reserve the right to refuse service to anyone for any reason at any time.` },
        { type: 'p', text: `You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.` },
        { type: 'p', text: `You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.` },
      ]},
      { id: 's3', num: 'Section 03', title: 'Accuracy, Completeness and Timeliness of Information', blocks: [
        { type: 'p', text: `We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.` },
        { type: 'p', text: `This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site.` },
      ]},
      { id: 's4', num: 'Section 04', title: 'Modifications to the Service and Prices', blocks: [
        { type: 'p', text: `Prices for our products are subject to change without notice.` },
        { type: 'p', text: `We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.` },
        { type: 'p', text: `We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.` },
      ]},
      { id: 's5', num: 'Section 05', title: 'Products or Services', blocks: [
        { type: 'p', text: `Certain products or Services may be available exclusively online through the website. These products or Services may have limited quantities and are subject to return or exchange only according to our Return Policy.` },
        { type: 'p', text: `We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.` },
        { type: 'p', text: `We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction. We may exercise this right on a case-by-case basis.` },
      ]},
      { id: 's6', num: 'Section 06', title: 'Accuracy of Billing and Account Information', blocks: [
        { type: 'p', text: `We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address.` },
        { type: 'p', text: `You agree to provide current, complete and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.` },
      ]},
      { id: 's7', num: 'Section 07', title: 'Optional Tools', blocks: [
        { type: 'p', text: `We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.` },
        { type: 'p', text: `You acknowledge and agree that we provide access to such tools "as is" and "as available" without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.` },
      ]},
      { id: 's8', num: 'Section 08', title: 'Third-Party Links', blocks: [
        { type: 'p', text: `Certain content, products and Services available via our Service may include materials from third-parties.` },
        { type: 'p', text: `Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or Services of third-parties.` },
      ]},
      { id: 's9', num: 'Section 09', title: 'User Comments, Feedback and Other Submissions', blocks: [
        { type: 'p', text: `If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, 'comments'), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.` },
        { type: 'p', text: `We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion to be unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.` },
      ]},
      { id: 's10', num: 'Section 10', title: 'Personal Information', blocks: [
        { type: 'p', text: <>Your submission of personal information through the store is governed by our{' '}<Link href="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>.</> },
      ]},
      { id: 's11', num: 'Section 11', title: 'Errors, Inaccuracies and Omissions', blocks: [
        { type: 'p', text: `Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice.` },
      ]},
      { id: 's12', num: 'Section 12', title: 'Prohibited Uses', blocks: [
        { type: 'p', text: `In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content:` },
        { type: 'list', items: [
          '(a) for any unlawful purpose',
          '(b) to solicit others to perform or participate in any unlawful acts',
          '(c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances',
          '(d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others',
          '(e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability',
          '(f) to submit false or misleading information',
          '(g) to upload or transmit viruses or any other type of malicious code',
          '(h) to collect or track the personal information of others',
          '(i) to spam, phish, pharm, pretext, spider, crawl, or scrape',
          '(j) for any obscene or immoral purpose; or (k) to interfere with or circumvent the security features of the Service',
        ]},
      ]},
      { id: 's13', num: 'Section 13', title: 'Disclaimer of Warranties; Limitation of Liability', blocks: [
        { type: 'p', text: `We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free.` },
        { type: 'p', text: `You expressly agree that your use of, or inability to use, the service is at your sole risk. The service and all products and Services delivered to you through the service are (except as expressly stated by us) provided 'as is' and 'as available' for your use, without any representation, warranties or conditions of any kind, either express or implied.` },
        { type: 'p', text: `In no case shall FEAR Inc., our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.` },
      ]},
      { id: 's14', num: 'Section 14', title: 'Indemnification', blocks: [
        { type: 'p', text: `You agree to indemnify, defend and hold harmless FEAR Inc. and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys' fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.` },
      ]},
      { id: 's15', num: 'Section 15', title: 'Severability', blocks: [
        { type: 'p', text: `In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service.` },
      ]},
      { id: 's16', num: 'Section 16', title: 'Termination', blocks: [
        { type: 'p', text: `The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.` },
        { type: 'p', text: `These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.` },
      ]},
      { id: 's17', num: 'Section 17', title: 'Entire Agreement', blocks: [
        { type: 'p', text: `The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.` },
        { type: 'p', text: `These Terms of Service and any policies or operating rules posted by us on this site or in respect to The Service constitutes the entire agreement and understanding between you and us.` },
      ]},
      { id: 's18', num: 'Section 18', title: 'Governing Law', blocks: [
        { type: 'p', text: `These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the United States.` },
      ]},
      { id: 's19', num: 'Section 19', title: 'Changes to Terms of Service', blocks: [
        { type: 'p', text: `You can review the most current version of the Terms of Service at any time at this page.` },
        { type: 'p', text: `We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.` },
      ]},
      { id: 's20', num: 'Section 20', title: 'Contact Information', blocks: [
        { type: 'p', text: `Questions about the Terms of Service should be sent to us at:` },
        { type: 'contact', items: [{ icon: '📧', label: 'Email', val: EMAIL, href: `mailto:${EMAIL}` }] },
      ]},
    ],
    related: { label: 'Privacy Policy', href: '/privacy', icon: '🔒' } as any, // see below
    relatedLabel: 'Related Documents',
    relatedAccentKey: 'teal',
    cta: { title: '❓ Need Help?', body: `If you have any questions about our Terms of Service, please don't hesitate to reach out.`, href: `mailto:${EMAIL}`, label: 'Contact Us →', accentKey: 'orange' },
  },

  // ── PRIVACY ────────────────────────────────────────────────────────
  privacy: {
    slug: 'privacy',
    ghost: 'PRIVACY',
    eyebrow: 'Legal · Last Updated January 2026',
    titlePrefix: 'Privacy',
    titleAccent: 'Policy',
    accentKey: 'teal',
    metaBar: [
      { icon: '📅', label: 'Last updated', val: 'January 2026' },
      { icon: '🏢', label: 'Entity', val: 'FEAR Inc.' },
      { icon: '📧', label: 'Contact', val: EMAIL },
    ],
    heroMeta: ['12 sections', '~8 min read', 'FEAR Inc.'],
    lastUpdated: 'January 2026',
    metaDescription: 'Privacy Policy for eFear — how FEAR Inc. collects, uses, and discloses your personal information.',
    intro: {
      id: 'intro',
      blocks: [
        { type: 'p', text: `This Privacy Policy describes how FEAR Inc. (the "Site", "we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from e-fear.vercel.app or otherwise communicate with us (collectively, the "Services"). "You" and "your" means you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy.` },
        { type: 'highlight', text: `Please read this Privacy Policy carefully. By using and accessing any of the Services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree, please do not use or access any of the Services.` },
      ],
    },
    nav: [
      { id: 'changes', label: 'Changes to Policy' },
      { id: 'collect', label: 'How We Collect' },
      { id: 'what', label: 'What We Collect' },
      { id: 'usage', label: 'How We Use Data' },
      { id: 'cookies', label: 'Cookies' },
      { id: 'disclosure', label: 'Disclosure' },
      { id: 'ugc', label: 'User Content' },
      { id: 'links', label: 'Third-Party Links' },
      { id: 'children', label: "Children's Data" },
      { id: 'security', label: 'Security & Retention' },
      { id: 'rights', label: 'Your Rights' },
      { id: 'contact', label: 'Contact' },
    ],
    sections: [
      { id: 'changes', num: 'Section 01', title: 'Changes to This Privacy Policy', blocks: [
        { type: 'p', text: `We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on the Site, update the "Last updated" date and take any other steps required by applicable law.` },
      ]},
      { id: 'collect', num: 'Section 02', title: 'How We Collect and Use Your Personal Information', blocks: [
        { type: 'p', text: `To provide the Services, we collect and have collected over the past 12 months personal information about you from a variety of sources, as set out below. The information that we collect and use varies depending on how you interact with us.` },
        { type: 'p', text: `In addition to the specific uses set out below, we may use information we collect about you to communicate with you, provide the Services, comply with any applicable legal obligations, enforce any applicable terms of service, and to protect or defend the Services, our rights, and the rights of our users or others.` },
      ]},
      { id: 'what', num: 'Section 03', title: 'What Personal Information We Collect', blocks: [
        { type: 'p', text: `The types of personal information we obtain about you depends on how you interact with our Site and use our Services. When we use the term "personal information", we are referring to information that identifies, relates to, describes or can be associated with you.` },
        { type: 'sub', text: 'Information We Collect Directly from You' },
        { type: 'p', text: `Information that you directly submit to us through our Services may include:` },
        { type: 'list', items: [
          'Basic contact details including your name, address, phone number, email',
          'Order information including your name, billing address, shipping address, payment confirmation, email address, phone number',
          'Account information including your username, password, security questions',
          'Shopping information including the items you view, put in your cart or add to your wishlist',
          'Customer support information including the information you choose to include in communications with us',
        ]},
        { type: 'sub', text: 'Information We Collect through Cookies' },
        { type: 'p', text: `We also automatically collect certain information about your interaction with the Services ("Usage Data"). To do this, we may use cookies, pixels and similar technologies ("Cookies"). Usage Data may include information about how you access and use our Site and your account, including device information, browser information, information about your network connection, your IP address and other information regarding your interaction with the Services.` },
        { type: 'sub', text: 'Information We Obtain from Third Parties' },
        { type: 'p', text: `We may obtain information about you from third parties, including from vendors and service providers who may collect information on our behalf, such as:` },
        { type: 'list', items: [
          'Companies who support our Site and Services, such as Shopify',
          'Our payment processors, who collect payment information (e.g., bank account, credit or debit card information, billing address) to process your payment in order to fulfill your orders',
          'When you visit our Site, open or click on emails we send you, or interact with our Services or advertisements, we, or third parties we work with, may automatically collect certain information using online tracking technologies',
        ]},
        { type: 'p', text: `Any information we obtain from third parties will be treated in accordance with this Privacy Policy. We are not responsible for the accuracy of the information provided to us by third parties.` },
      ]},
      { id: 'usage', num: 'Section 04', title: 'How We Use Your Personal Information', blocks: [
        { type: 'sub', text: 'Providing Products and Services' },
        { type: 'p', text: `We use your personal information to provide you with the Services in order to perform our contract with you, including to process your payments, fulfill your orders, to send notifications to you related to your account, purchases, returns, exchanges or other transactions, to create, maintain and otherwise manage your account, to arrange for shipping, facilitate any returns and exchanges and to enable you to post reviews.` },
        { type: 'sub', text: 'Marketing and Advertising' },
        { type: 'p', text: `We use your personal information for marketing and promotional purposes, such as to send marketing, advertising and promotional communications by email, text message or postal mail, and to show you advertisements for products or services.` },
        { type: 'sub', text: 'Security and Fraud Prevention' },
        { type: 'p', text: `We use your personal information to detect, investigate or take action regarding possible fraudulent, illegal or malicious activity. If you choose to use the Services and register an account, you are responsible for keeping your account credentials safe. We highly recommend that you do not share your username, password, or other access details with anyone else.` },
        { type: 'sub', text: 'Communicating with You' },
        { type: 'p', text: `We use your personal information to provide you with customer support and improve our Services. This is in our legitimate interests in order to be responsive to you, to provide effective services to you, and to maintain our business relationship with you.` },
      ]},
      { id: 'cookies', num: 'Section 05', title: 'Cookies', blocks: [
        { type: 'p', text: `Like many websites, we use Cookies on our Site. We use Cookies to power and improve our Site and our Services (including to remember your actions and preferences), to run analytics and better understand user interaction with the Services. We may also permit third parties and services providers to use Cookies on our Site to better tailor the services, products and advertising on our Site and other websites.` },
        { type: 'p', text: `Most browsers automatically accept Cookies by default, but you can choose to set your browser to remove or reject Cookies through your browser controls. Please keep in mind that removing or blocking Cookies can negatively impact your user experience and may cause some of the Services, including certain features and general functionality, to work incorrectly or no longer be available.` },
      ]},
      { id: 'disclosure', num: 'Section 06', title: 'How We Disclose Personal Information', blocks: [
        { type: 'p', text: `In certain circumstances, we may disclose your personal information to third parties for legitimate purposes subject to this Privacy Policy. Such circumstances may include:` },
        { type: 'list', items: [
          'With vendors or other third parties who perform services on our behalf (e.g., IT management, payment processing, data analytics, customer support, cloud storage, fulfillment and shipping)',
          'With business and marketing partners, including Shopify, to provide services and advertise to you',
          'When you direct, request us or otherwise consent to our disclosure of certain information to third parties',
          'With our affiliates or otherwise within our corporate group, in our legitimate interests to run a successful business',
          'In connection with a business transaction such as a merger or bankruptcy, to comply with any applicable legal obligations',
        ]},
        { type: 'sub', text: 'Categories of Personal Information Disclosed' },
        { type: 'list', items: [
          <><strong>Identifiers</strong> such as basic contact details and certain order and account information</>,
          <><strong>Commercial information</strong> such as order information, shopping information and customer support information</>,
          <><strong>Internet or other similar network activity</strong>, such as Usage Data</>,
        ]},
        { type: 'p', text: `We do not use or disclose sensitive personal information for the purposes of inferring characteristics about you.` },
      ]},
      { id: 'ugc', num: 'Section 07', title: 'User Generated Content', blocks: [
        { type: 'p', text: `The Services may enable you to post product reviews and other user-generated content. If you choose to submit user generated content to any public area of the Services, this content will be public and accessible by anyone.` },
        { type: 'p', text: `We do not control who will have access to the information that you choose to make available to others, and cannot ensure that parties who have access to such information will respect your privacy or keep it secure. We are not responsible for the privacy or security of any information that you make publicly available.` },
      ]},
      { id: 'links', num: 'Section 08', title: 'Third Party Websites and Links', blocks: [
        { type: 'p', text: `Our Site may provide links to websites or other online platforms operated by third parties. If you follow links to sites not affiliated or controlled by us, you should review their privacy and security policies and other terms and conditions. We do not guarantee and are not responsible for the privacy or security of such sites, including the accuracy, completeness, or reliability of information found on these sites.` },
        { type: 'p', text: `Information you provide on public or semi-public venues, including information you share on third-party social networking platforms may also be viewable by other users of the Services and/or users of those third-party platforms without limitation as to its use by us or by a third party.` },
      ]},
      { id: 'children', num: 'Section 09', title: "Children's Data", blocks: [
        { type: 'p', text: `The Services are not intended to be used by children, and we do not knowingly collect any personal information about children. If you are the parent or guardian of a child who has provided us with their personal information, you may contact us using the contact details set out below to request that it be deleted.` },
        { type: 'p', text: `As of the Effective Date of this Privacy Policy, we do not have actual knowledge that we "share" or "sell" personal information of individuals under 16 years of age.` },
      ]},
      { id: 'security', num: 'Section 10', title: 'Security and Retention of Your Information', blocks: [
        { type: 'p', text: `Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee "perfect security." In addition, any information you send to us may not be secure while in transit. We recommend that you do not use unsecure channels to communicate sensitive or confidential information to us.` },
        { type: 'p', text: `How long we retain your personal information depends on different factors, such as whether we need the information to maintain your account, to provide the Services, comply with legal obligations, resolve disputes or enforce other applicable contracts and policies.` },
      ]},
      { id: 'rights', num: 'Section 11', title: 'Your Rights and Choices', blocks: [
        { type: 'p', text: `Depending on where you live, you may have some or all of the rights listed below in relation to your personal information. However, these rights are not absolute, may apply only in certain circumstances and, in certain cases, we may decline your request as permitted by law.` },
        { type: 'list', items: [
          <><strong>Right to Access / Know.</strong> You may have a right to request access to personal information that we hold about you, including details relating to the ways in which we use and share your information.</>,
          <><strong>Right to Delete.</strong> You may have a right to request that we delete personal information we maintain about you.</>,
          <><strong>Right to Correct.</strong> You may have a right to request that we correct inaccurate personal information we maintain about you.</>,
          <><strong>Right of Portability.</strong> You may have a right to receive a copy of the personal information we hold about you and to request that we transfer it to a third party, in certain circumstances and with certain exceptions.</>,
          <><strong>Right to Opt out of Sale or Sharing or Targeted Advertising.</strong> You may have a right to direct us not to "sell" or "share" your personal information or to opt out of the processing of your personal information for purposes considered to be "targeted advertising".</>,
          <><strong>Restriction of Processing.</strong> You may have the right to ask us to stop or restrict our processing of personal information.</>,
          <><strong>Withdrawal of Consent.</strong> Where we rely on consent to process your personal information, you may have the right to withdraw this consent.</>,
          <><strong>Appeal.</strong> You may have a right to appeal our decision if we decline to process your request.</>,
          <><strong>Managing Communication Preferences.</strong> We may send you promotional emails, and you may opt out of receiving these at any time by using the unsubscribe option displayed in our emails to you.</>,
        ]},
        { type: 'p', text: `We will not discriminate against you for exercising any of these rights. We may need to collect information from you to verify your identity before providing a substantive response to the request.` },
      ]},
      { id: 'contact', num: 'Section 12', title: 'Contact Information', blocks: [
        { type: 'p', text: `If you have any questions about this Privacy Policy or our privacy practices, please contact us at:` },
        { type: 'contact', items: [
          { icon: '🏢', label: 'Company', val: 'FEAR Inc.' },
          { icon: '📧', label: 'Email', val: EMAIL, href: `mailto:${EMAIL}` },
          { icon: '🌐', label: 'Website', val: 'e-fear.vercel.app', href: 'https://e-fear.vercel.app' },
        ]},
      ]},
    ],
    related: { label: 'Terms of Service', href: '/terms', icon: '📄' } as any,
    relatedLabel: 'Related Policies',
    relatedAccentKey: 'orange',
    cta: { title: '🔒 Your Privacy Matters', body: `We are committed to protecting your personal information and your right to privacy. Questions about our practices?`, href: `mailto:${EMAIL}`, label: 'Contact Privacy Team →', accentKey: 'teal' },
    extraCta: { title: '⚖️ Privacy Rights', body: `You have rights regarding your personal data, including access, deletion, and correction. Contact us to exercise your rights.`, accentKey: 'orange' },
  },

  // ── RETURNS ────────────────────────────────────────────────────────
  returns: {
    slug: 'returns',
    ghost: 'RETURNS',
    eyebrow: 'Legal · Last Updated January 2026',
    titlePrefix: 'Return',
    titleAccent: 'Policy',
    accentKey: 'red',
    metaBar: [
      { icon: '📅', label: 'Last updated', val: 'January 2026' },
      { icon: '📍', label: 'Address', val: '2003 E. Veterans Memorial Blvd, Killeen TX 76451' },
    ],
    heroMeta: ['30-day window', '~3 min read', 'FEAR Inc.'],
    lastUpdated: 'January 2026',
    metaDescription: 'Return Policy for eFear — 30-day returns, exchanges, and refund timelines.',
    quickInfo: [
      { icon: '🗓️', label: 'Return Window', val: '30 Days', accentKey: 'red' },
      { icon: '📦', label: 'Condition', val: 'Original / Unused', accentKey: 'orange' },
      { icon: '💳', label: 'Refund Timeline', val: '10 Business Days', accentKey: 'teal' },
      { icon: '📧', label: 'Start a Return', val: EMAIL, accentKey: 'red' },
    ],
    nav: [
      { id: 'policy', label: 'Return Policy' },
      { id: 'damages', label: 'Damages & Issues' },
      { id: 'exchanges', label: 'Exchanges' },
      { id: 'eu', label: 'EU Cooling-Off' },
      { id: 'refunds', label: 'Refunds' },
      { id: 'contact', label: 'Contact' },
    ],
    sections: [
      { id: 'policy', num: 'Section 01', title: 'Return / Refund Policy', accentKey: 'red', blocks: [
        { type: 'p', text: <>We have a <strong>30-day return policy</strong>, which means you have 30 days after receiving your item to request a return.</> },
        { type: 'p', text: `To be eligible for a return, your item must be in the same condition that you received it — unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.` },
        { type: 'highlight', text: <>To start a return, contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Returns will need to be sent to: <strong>2003 E. Veterans Memorial Blvd, Killeen, TX, 76451, United States</strong>. Items sent back to us without first requesting a return will not be accepted.</> },
        { type: 'p', text: `If your return is accepted, we'll send you a return shipping label, as well as instructions on how and where to send your package. Please note that if your country of residence is not United States, shipping your goods may take longer than expected.` },
        { type: 'p', text: <>You can always contact us for any return questions at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</> },
      ]},
      { id: 'damages', num: 'Section 02', title: 'Damages and Issues', accentKey: 'orange', blocks: [
        { type: 'p', text: `Please inspect your order upon receipt and contact us immediately if the item is defective, damaged, or if you receive the wrong item, so that we may evaluate the issue and make it right.` },
        { type: 'p', text: `Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.` },
        { type: 'highlight', text: <>Unfortunately, we <strong>cannot accept returns on sale items or gift cards</strong>.</> },
      ]},
      { id: 'exchanges', num: 'Section 03', title: 'Exchanges', accentKey: 'teal', blocks: [
        { type: 'p', text: `The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.` },
      ]},
      { id: 'eu', num: 'Section 04', title: 'European Union 3-Day Cooling-Off Period', accentKey: 'teal', blocks: [
        { type: 'p', text: `Notwithstanding the above, if merchandise is being shipped into the European Union, you have the right to cancel or return your order within 3 days for any reason and without justification.` },
        { type: 'p', text: `As above, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.` },
      ]},
      { id: 'refunds', num: 'Section 05', title: 'Refunds', accentKey: 'red', blocks: [
        { type: 'p', text: <>We will notify you once we've received and inspected your return to let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within <strong>10 business days</strong>. Please remember it can take some time for your bank or credit card company to process and post the refund too.</> },
        { type: 'highlight', text: <>If more than <strong>15 business days</strong> have passed since we've approved your return, please contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</> },
      ]},
      { id: 'contact', num: 'Section 06', title: 'Contact Us', accentKey: 'red', blocks: [
        { type: 'p', text: `For any return or refund questions, reach us at:` },
        { type: 'contact', items: [
          { icon: '📧', label: 'Email', val: EMAIL, href: `mailto:${EMAIL}` },
          { icon: '📍', label: 'Address', val: '2003 E. Veterans Memorial Blvd, Killeen, TX 76451' },
        ]},
      ]},
    ],
    related: { label: 'Privacy Policy', href: '/privacy', icon: '🔒' } as any,
    relatedLabel: 'Related Policies',
    relatedAccentKey: 'orange',
    cta: { title: '📦 Start a Return', body: `Ready to return something? Email us first. Do not ship anything back without getting confirmation — we won't accept unrequested returns.`, href: `mailto:${EMAIL}`, label: 'Email Returns Team →', accentKey: 'red' },
    extraCta: { title: '⚠️ Non-Returnable Items', body: `Perishables, custom/personalized products, personal care goods, hazardous materials, sale items, and gift cards cannot be returned.`, accentKey: 'orange' },
  },
  // lib/legal/content.tsx — add inside the POLICIES record

shipping: {
  slug: 'shipping',
  ghost: 'SHIPPING',
  eyebrow: 'Legal · Last Updated January 2026',
  titlePrefix: 'Shipping',
  titleAccent: 'Policy',
  accentKey: 'red',
  metaBar: [
    { icon: '📅', label: 'Last updated', val: 'January 2026' },
    { icon: '📍', label: 'Ships from', val: 'Killeen, TX' },
    { icon: '🚚', label: 'Carriers', val: 'USPS · UPS · FedEx' },
  ],
  heroMeta: ['8 sections', '~4 min read', 'FEAR Inc.'],
  lastUpdated: 'January 2026',
  metaDescription: 'Shipping Policy for eFear — processing times, rates, tracking, and delivery details.',
  quickInfo: [
    { icon: '⏱️', label: 'Processing Time', val: '1–2 Days', accentKey: 'red' },
    { icon: '📦', label: 'Standard Delivery', val: '3–7 Days', accentKey: 'orange' },
    { icon: '🎁', label: 'Free Shipping', val: 'Over $75', accentKey: 'teal' },
    { icon: '🌍', label: 'Ships To', val: 'US + Select Intl', accentKey: 'red' },
  ],
  nav: [
    { id: 'processing', label: 'Processing Time' },
    { id: 'rates', label: 'Rates & Methods' },
    { id: 'domestic', label: 'Domestic Shipping' },
    { id: 'international', label: 'International Shipping' },
    { id: 'tracking', label: 'Order Tracking' },
    { id: 'lost', label: 'Lost or Damaged' },
    { id: 'undeliverable', label: 'Undeliverable Packages' },
    { id: 'contact', label: 'Contact' },
  ],
  sections: [
    { id: 'processing', num: 'Section 01', title: 'Processing Time', accentKey: 'red', blocks: [
      { type: 'p', text: `Orders are typically processed and packed within 1–2 business days of being placed. Orders placed on weekends or holidays are processed the next business day.` },
      { type: 'p', text: `During high-volume periods (new releases, sales events, holidays) processing may take slightly longer. We'll notify you by email if there's a significant delay with your order.` },
    ]},
    { id: 'rates', num: 'Section 02', title: 'Shipping Rates & Methods', accentKey: 'orange', blocks: [
      { type: 'p', text: `Shipping rates are calculated at checkout based on the weight of your order, the shipping method selected, and your destination.` },
      { type: 'highlight', text: <>Orders over <strong>$75</strong> qualify for free standard shipping within the continental United States.</> },
      { type: 'list', items: [
        'Standard Shipping — 3–7 business days',
        'Expedited Shipping — 2–3 business days',
        'Priority / Overnight — 1–2 business days (select items only)',
      ]},
    ]},
    { id: 'domestic', num: 'Section 03', title: 'Domestic Shipping', accentKey: 'red', blocks: [
      { type: 'p', text: `We ship to all 50 U.S. states via USPS, UPS, and FedEx, depending on package weight and destination. Delivery estimates begin from the date of shipment, not the date of order.` },
      { type: 'p', text: `P.O. boxes and APO/FPO addresses are supported for USPS shipments only.` },
    ]},
    { id: 'international', num: 'Section 04', title: 'International Shipping', accentKey: 'orange', blocks: [
      { type: 'p', text: `We currently ship to a select list of international destinations. International orders may take 7–21 business days to arrive depending on customs processing in the destination country.` },
      { type: 'highlight', text: `Customers are responsible for any customs duties, import taxes, or brokerage fees charged by their country. These are not included in the item price or shipping cost and are collected by the carrier or government upon delivery.` },
    ]},
    { id: 'tracking', num: 'Section 05', title: 'Order Tracking', accentKey: 'teal', blocks: [
      { type: 'p', text: `You'll receive a shipping confirmation email with a tracking number as soon as your order ships. Tracking information can take 24–48 hours to become active with the carrier.` },
    ]},
    { id: 'lost', num: 'Section 06', title: 'Lost, Stolen, or Damaged Packages', accentKey: 'red', blocks: [
      { type: 'p', text: `We package every order carefully, but carriers occasionally lose or damage packages in transit. If your order arrives damaged, or tracking shows delivered but you never received it, contact us within 7 days of the delivery date so we can file a claim with the carrier.` },
      { type: 'p', text: `eFear is not responsible for packages that are lost or stolen after being marked "delivered" by the carrier, but we'll always do what we can to help resolve the issue.` },
    ]},
    { id: 'undeliverable', num: 'Section 07', title: 'Undeliverable / Refused Packages', accentKey: 'orange', blocks: [
      { type: 'p', text: `If a package is returned to us as undeliverable (incorrect address, unclaimed, or refused), we'll contact you to arrange reshipment. A new shipping fee may apply. If you'd prefer a refund instead, the original shipping cost is non-refundable.` },
    ]},
    { id: 'contact', num: 'Section 08', title: 'Contact Us', accentKey: 'red', blocks: [
      { type: 'p', text: `Questions about a shipment or this policy? Reach us at:` },
      { type: 'contact', items: [
        { icon: '📧', label: 'Email', val: EMAIL, href: `mailto:${EMAIL}` },
        { icon: '📍', label: 'Ships From', val: '2003 E. Veterans Memorial Blvd, Killeen, TX 76451' },
      ]},
    ]},
  ],
  related: [
    { label: 'Return Policy', href: '/returns', icon: '📦' },
    { label: 'Terms of Service', href: '/terms', icon: '📄' },
    { label: 'Privacy Policy', href: '/privacy', icon: '🔒' },
  ],
  relatedLabel: 'Related Policies',
  relatedAccentKey: 'orange',
  cta: { title: '🚚 Where\'s My Order?', body: `Have a tracking number but questions about it? We're happy to check on it for you.`, href: `mailto:${EMAIL}`, label: 'Ask About My Order →', accentKey: 'red' },
  extraCta: { title: '🌍 Shipping Internationally?', body: `Check our current list of supported countries before checkout — customs delays are common and out of our control.`, accentKey: 'orange' },
},

cookies: {
  slug: 'cookies',
  ghost: 'COOKIES',
  eyebrow: 'Legal · Last Updated January 2026',
  titlePrefix: 'Cookie',
  titleAccent: 'Policy',
  accentKey: 'teal',
  metaBar: [
    { icon: '📅', label: 'Last updated', val: 'January 2026' },
    { icon: '🌐', label: 'Applies to', val: 'efear.store' },
    { icon: '📧', label: 'Contact', val: EMAIL },
  ],
  heroMeta: ['6 sections', '~3 min read', 'FEAR Inc.'],
  lastUpdated: 'January 2026',
  metaDescription: 'Cookie Policy for eFear — what cookies we use, why, and how to control them.',
  intro: {
    id: 'intro',
    blocks: [
      { type: 'p', text: `This Cookie Policy explains what cookies are, how FEAR Inc. uses them on efear.store, and the choices you have around them. It should be read alongside our` },
    ],
  },
  nav: [
    { id: 'what', label: 'What Are Cookies' },
    { id: 'types', label: 'Types We Use' },
    { id: 'third-party', label: 'Third-Party Cookies' },
    { id: 'duration', label: 'How Long They Last' },
    { id: 'choices', label: 'Your Choices' },
    { id: 'changes', label: 'Changes to Policy' },
  ],
  sections: [
    { id: 'what', num: 'Section 01', title: 'What Are Cookies', accentKey: 'teal', blocks: [
      { type: 'p', text: `Cookies are small text files placed on your device when you visit a website. They're widely used to make sites work, work more efficiently, and to provide information to the site owner.` },
    ]},
    { id: 'types', num: 'Section 02', title: 'Types of Cookies We Use', accentKey: 'teal', blocks: [
      { type: 'list', items: [
        <><strong>Essential Cookies.</strong> Required for core site functionality like staying logged in and keeping items in your cart. The site can't function properly without these.</>,
        <><strong>Performance & Analytics Cookies.</strong> Help us understand how visitors use the site so we can improve it (e.g., which pages are popular, where people drop off).</>,
        <><strong>Functional Cookies.</strong> Remember choices you've made, like currency or recently viewed items, to personalize your experience.</>,
        <><strong>Advertising Cookies.</strong> Used to show you relevant ads on and off our site and measure the effectiveness of ad campaigns.</>,
      ]},
    ]},
    { id: 'third-party', num: 'Section 03', title: 'Third-Party Cookies', accentKey: 'orange', blocks: [
      { type: 'p', text: `Some cookies are placed by third-party services that appear on our pages — payment processors, analytics providers, and advertising partners. We don't control these cookies directly; each third party's own privacy and cookie policy governs how they use the data collected.` },
    ]},
    { id: 'duration', num: 'Section 04', title: 'How Long Cookies Last', accentKey: 'teal', blocks: [
      { type: 'p', text: `Session cookies are temporary and are deleted once you close your browser. Persistent cookies remain on your device for a set period (or until you delete them) and help us recognize you on return visits.` },
    ]},
    { id: 'choices', num: 'Section 05', title: 'Your Cookie Choices', accentKey: 'red', blocks: [
      { type: 'p', text: `Most browsers let you refuse or delete cookies through their settings. You can also use our cookie banner, shown on your first visit, to accept or decline non-essential cookies.` },
      { type: 'highlight', text: `Blocking or deleting cookies may cause parts of the site — like your cart or saved login — to stop working correctly.` },
    ]},
    { id: 'changes', num: 'Section 06', title: 'Changes to This Cookie Policy', accentKey: 'teal', blocks: [
      { type: 'p', text: `We may update this Cookie Policy from time to time to reflect changes to the cookies we use or for legal or regulatory reasons. Check back periodically for updates.` },
      { type: 'contact', items: [{ icon: '📧', label: 'Questions', val: EMAIL, href: `mailto:${EMAIL}` }] },
    ]},
  ],
  related: [
    { label: 'Privacy Policy', href: '/privacy', icon: '🔒' },
    { label: 'Terms of Service', href: '/terms', icon: '📄' },
  ],
  relatedLabel: 'Related Policies',
  relatedAccentKey: 'orange',
  cta: { title: '🍪 Manage Cookies', body: `Want to change your cookie preferences? You can update them anytime from the cookie banner or your browser settings.`, href: `mailto:${EMAIL}`, label: 'Contact Us →', accentKey: 'teal' },
},
};