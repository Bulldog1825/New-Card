import { useCallback, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import ProfileCard from './ProfileCard';
import {
  cardEntering,
  cardExiting,
  cardLayout,
  reducedCardEntering,
  reducedCardExiting,
} from '../animations/profileCardAnimations';
import { COLORS, withAlpha } from '../constants/colors';
import { FONTS } from '../constants/fonts';

// Newest card first. Stable ids as keys mean existing cards never replay
// their entrance; the layout transition slides them to their new spots.
export default function ProfileCardList({ cards, onRemove, paddingTop, paddingBottom }) {
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef(null);
  const scrollYRef = useRef(0);
  const newestIdRef = useRef(cards[0]?.id);

  const handleScroll = useCallback((event) => {
    scrollYRef.current = event.nativeEvent.contentOffset.y;
  }, []);

  // When a new card lands at the top while the list is scrolled down,
  // bring it into view.
  const newestId = cards[0]?.id;
  useEffect(() => {
    const isNewCard = newestId != null && newestId !== newestIdRef.current;
    newestIdRef.current = newestId;
    if (isNewCard && scrollYRef.current > 1) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [newestId]);

  const entering = reduceMotion ? reducedCardEntering : cardEntering;
  const exiting = reduceMotion ? reducedCardExiting : cardExiting;
  const layout = reduceMotion ? undefined : cardLayout;

  return (
    <ScrollView
      ref={scrollRef}
      onScroll={handleScroll}
      scrollEventThrottle={32}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop, paddingBottom }]}
    >
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={1.5}>
          Profiles
        </Text>
        <Text style={styles.count} maxFontSizeMultiplier={1.5}>
          {cards.length} {cards.length === 1 ? 'card' : 'cards'}
        </Text>
      </View>

      {cards.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText} maxFontSizeMultiplier={1.8}>
            Tap the button to generate a profile
          </Text>
        </View>
      ) : (
        cards.map((card) => (
          <Animated.View
            key={card.id}
            entering={entering}
            exiting={exiting}
            layout={layout}
            style={styles.item}
          >
            <ProfileCard
              id={card.id}
              number={card.number}
              profile={card.profile}
              onRemove={onRemove}
            />
          </Animated.View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 32,
    letterSpacing: -0.8,
    color: COLORS.cream,
  },
  count: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.teal,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: withAlpha(COLORS.cream, 0.5),
  },
  item: {
    marginBottom: 14,
  },
});
