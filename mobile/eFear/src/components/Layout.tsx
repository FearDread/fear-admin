import { ReactNode } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, StatusBar, Platform } from 'react-native';
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
  const pathname       = usePathname();
  const shouldHideFtr  = hideFooter || NO_FOOTER.some(r => pathname.startsWith(r));

  const inner = (
    <>
      {!hideHeader && <Header />}
      <View style={s.body}>{children}</View>
      {!shouldHideFtr && <AppFooter />}
    </>
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark0} translucent={Platform.OS === 'android'} />
      {noScroll
        ? <View style={s.flex}>{inner}</View>
        : <ScrollView style={s.flex} contentContainerStyle={s.grow} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">{inner}</ScrollView>
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