/** *************************************************************
 * Please refer to the Theme Options section in documentation   *
 ****************************************************************/

/**
 * Icons from react-icons: https://react-icons.github.io/react-icons
 */

import { IoLogoTwitter, IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io5'
import { TfiHome, TfiPencilAlt } from 'react-icons/tfi'
import { SlUser, SlBriefcase, SlEnvolope, SlTrophy } from 'react-icons/sl'

/**
 * Main Menu Items
 */

export const menu = [
  {
    name: 'Home',
    slug: '/',
    Icon: TfiHome,
  },
  {
    name: 'Details',
    slug: '/details',
    Icon: TfiPencilAlt,
  },
  {
    name: 'About',
    slug: '/about',
    Icon: SlUser,
  },
  {
    name: 'Services',
    slug: '/services',
    Icon: SlBriefcase,
  },
  {
    name: 'Projects',
    slug: '/projects',
    Icon: SlTrophy,
  },
  {
    name: 'Contact',
    slug: '/contact',
    Icon: SlEnvolope,
  },
]
/**
{
  name: 'Home',
  slug: '/',
  Icon: TfiHome,
  number: 1,
},
{
  name: 'Home (2)',
  slug: '/index-2',
  Icon: TfiHome,
  number: 2,
},
{
  name: 'Home (3)',
  slug: '/index-3',
  Icon: TfiHome,
  number: 3,
},
  {
    name: 'Articles',
    slug: '/blog',
    Icon: TfiPencilAlt,
  },
*/
/**
 * Social Links under the Main Menu
 */

export const social = [
  {
    name: 'Twitter',
    url: 'https://www.twitter.com/',
    Icon: IoLogoTwitter,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/',
    Icon: IoLogoInstagram,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/',
    Icon: IoLogoLinkedin,
  },
]

/**
 * General configurations
 */

export const config = {
  dateLocale: 'en-US',
  dateOptions: {
    // dateOptions is passed to JavaScript's toLocaleDateString()
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  },
  convertKit: {
    tipUrl: 'https://fantastic-mover-3439.ck.page/products/blog',
  },
  contactForm: {
    base_url: process.env.API_BASE_URL,
    inputs: require('./content/contact-form.json'),
    recipient: 'inmoshynekomix@gmail.com',
    subject: 'GFOLIO EMAIL NOTIFICATION',
  },
}

/**
 * MDX/Markdown configurations
 */

export const mdxConfig = {
  publicDir: 'public',
  pagesDir: 'content',
  fileExt: '.md',
  collections: ['/blog', '/projects'],
  remarkPlugins: [],
  rehypePlugins: [],
}

/**
 * Global SEO configuration for next-seo plugin
 * https://github.com/garmeeh/next-seo
 */

export const siteMetaData = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'http://localhost:3001',
  authorName: 'Garrett Haptonstall',
  siteName: 'GFolio',
  defaultTitle: 'G-Haps Personal Site',
  titleTemplate: 'Garrett Haptonstall | %s',
  description: 'The jack of all things Information Technology',
  email: 'ghaptonstall@gmail.com',
  locale: 'en_US',
  twitter: {
    handle: '@Ghap205',
    site: '@site',
    cardType: 'summary_large_image',
  },
}
