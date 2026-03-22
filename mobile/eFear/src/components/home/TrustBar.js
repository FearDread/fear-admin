/**
 * TrustBar.jsx — React Native
 *
 * Web → RN:
 *   <section> .trust-bar     → View, flexDirection row/wrap
 *   .trust-item border-right → conditional borderRightWidth per item
 *   <strong> / <span>        → Text with distinct styles
 */

import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const T = {
  dark1:  '#111111',
  border: '#222222',
  white:  '#ffffff',
  dim:    'rgba(255,255,255,0.45)',
};

const ITEMS = [
  { icon: '📦', label: 'Free Shipping',    note: 'On all orders over $49' },
  { icon: '🛡️', label: 'Bagged & Boarded', note: 'Every comic arrives mint' },
  { icon: '🔄', label: '30-Day Returns',   note: 'Regret? No judgment.' },
  { icon: '💬', label: '24/7 Support',     note: "We're awake too. Sadly." },
];

export const TrustBar = () => {
  const SW = Dimensions.get('window').width;
  // On narrow screens stack 2-per-row; on wide screens show all 4 inline
  const itemMinW = 180;
  const cols     = Math.max(1, Math.floor(SW / itemMinW));

  return (
    <View style={s.bar}>
      {ITEMS.map((item, i) => {
        const isLast        = i === ITEMS.length - 1;
        const isRowLast     = (i + 1) % cols === 0;
        const showDivider   = !isLast && !isRowLast;
        return (
          <View
            key={item.label}
            style={[
              s.item,
              { minWidth: itemMinW, flex: 1 },
              showDivider && s.itemBorder,
            ]}
          >
            <Text style={s.icon}>{item.icon}</Text>
            <View style={s.textBlock}>
              <Text style={s.label}>{item.label}</Text>
              <Text style={s.note}>{item.note}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default TrustBar;

const s = StyleSheet.create({
  bar: {
    flexDirection:   'row',
    flexWrap:        'wrap',
    backgroundColor: T.dark1,
    borderTopWidth:    1,
    borderBottomWidth: 1,
    borderColor:       T.border,
  },
  item: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:             10,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  itemBorder: {
    borderRightWidth: 1,
    borderRightColor: T.border,
  },
  icon: {
    fontSize:         24,
    includeFontPadding: false,
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           13,
    color:              T.white,
    includeFontPadding: false,
  },
  note: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           11,
    color:              T.dim,
    marginTop:          2,
    includeFontPadding: false,
  },
});