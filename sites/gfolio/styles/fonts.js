import { Inter } from '@next/font/google'

const sans = Inter({
  variable: '--font-sans',
  display: 'swap',
  subsets: ['latin'],
})

const variables = [sans.variable]

export default variables
