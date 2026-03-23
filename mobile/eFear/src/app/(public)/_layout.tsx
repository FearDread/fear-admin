import { Stack } from 'expo-router';
import Layout from '../../components/Layout';   // your shared header / footer / nav

/**
 * Route group: (public)
 * Maps to web routes:  /  /about  /contact  /blog  /shop  /faq  /cart
 *                       /shop-categories  /product/:id  /product-comparison
 *                       /wishlist  /terms  /privacy  /returns
 *
 * No auth check – everyone can access these.
 */
export default function PublicLayout() {
  return (
    <Layout>
      <Stack screenOptions={{ headerShown: false }} />
    </Layout>
  );
}