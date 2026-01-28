import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  other: {
    'base:app_id': '6979582c9266edba958ff3c1',
  },
};

export default function Home() {
  return <HomeClient />;
}
