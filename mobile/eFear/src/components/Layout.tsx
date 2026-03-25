import { ReactNode } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import Header from './Header';
import AppFooter from './Footer';
import { Colors } from '../constants/theme';

interface LayoutProps {
  children:    ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  noScroll?:   boolean;
}

const NO_FOOTER = ['/(public)/product/', '/(public)/shop/cart'];

export default function Layout({ children, hideHeader = false, hideFooter = false, noScroll = false }: LayoutProps) {
  const pathname      = usePathname();
  const shouldHideFtr = hideFooter || NO_FOOTER.some(r => pathname.startsWith(r));
  const insets        = useSafeAreaInsets();

  const inner = (
    <>
      {!hideHeader && <Header />}
      <View style={s.body}>{children}</View>
      {!shouldHideFtr && <AppFooter />}
    </>
  );

  return (
    // edges prop lets safe-area-context handle all four sides.
    // 'left' and 'right' are included so nothing bleeds on notched devices.
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.dark0}
        translucent={Platform.OS === 'android'}
      />
      {noScroll
        ? <View style={s.flex}>{inner}</View>
        : (
          <ScrollView
            style={s.flex}
            // Pad the bottom of the scroll content by the home-indicator inset
            // so the last element is never hidden behind it.
            contentContainerStyle={[s.grow, { paddingBottom: insets.bottom }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {inner}
          </ScrollView>
        )
      }
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark0 },
  flex: { flex: 1 },
  grow: { flexGrow: 1, backgroundColor: Colors.dark0 },
  body: { flex: 1, backgroundColor: Colors.dark0 },
});