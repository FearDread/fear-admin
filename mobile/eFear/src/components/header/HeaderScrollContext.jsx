/**
 * HeaderScrollContext.js
 *
 * Provides a shared Animated.Value that Layout's ScrollView writes to
 * and Header2 reads from. This lets the header hide/compact/progress
 * animations be driven by the page scroll without prop-drilling.
 *
 * Usage:
 *   // In Layout.jsx (provider)
 *   const scrollY = useRef(new Animated.Value(0)).current;
 *   <HeaderScrollContext.Provider value={{ scrollY }}>
 *     ...
 *   </HeaderScrollContext.Provider>
 *
 *   // In Header2.jsx (consumer)
 *   const { scrollY } = useHeaderScroll();
 */

import { createContext, useContext } from 'react';
import { Animated } from 'react-native';

// Default value — safe fallback if somehow used outside a provider
const DEFAULT = { scrollY: new Animated.Value(0) };

export const HeaderScrollContext = createContext(DEFAULT);

export const useHeaderScroll = () => useContext(HeaderScrollContext);