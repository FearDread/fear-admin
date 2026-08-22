
import type { Metadata } from 'next';
import FaqClient from './FaqClient';

export const metadata: Metadata = {
  title: 'FAQ | eFear',
  description:
    'Answers to common questions about orders, shipping, payments, and products at eFear.',
};

// Fully static content — no per-request data — SSG at build time.
export const dynamic = 'force-static';

export default function FaqPage() {
  return <FaqClient />;
}