import { memo, useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, withAlpha } from '../constants/colors';
import { FONTS } from '../constants/fonts';

// Badge colors cycle with the card number, so a card keeps its color forever.
const BADGE_VARIANTS = [
  { backgroundColor: COLORS.cream, color: COLORS.burgundy },
  { backgroundColor: COLORS.teal, color: COLORS.burgundy },
  { backgroundColor: COLORS.red, color: COLORS.cream },
];

function ProfileCard({ id, number, profile, onRemove }) {
  const badge = BADGE_VARIANTS[number % BADGE_VARIANTS.length];

  // Ignore repeat presses while the card animates out.
  const removingRef = useRef(false);
  const [removing, setRemoving] = useState(false);
  const handleRemove = useCallback(() => {
    if (removingRef.current) return;
    removingRef.current = true;
    setRemoving(true);
    onRemove(id);
  }, [id, onRemove]);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.badge, { backgroundColor: badge.backgroundColor }]}>
          <Text
            style={[styles.badgeText, { color: badge.color }]}
            maxFontSizeMultiplier={1.2}
            accessibilityElementsHidden
            importantForAccessibility="no"
          >
            {profile.initials}
          </Text>
        </View>
        <View style={styles.numberRow}>
          <View style={styles.marker} />
          <Text
            style={styles.number}
            maxFontSizeMultiplier={1.5}
            accessibilityLabel={`Card ${number}`}
          >
            #{number}
          </Text>
        </View>
        <Pressable
          onPress={handleRemove}
          disabled={removing}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Remove profile card ${number}, ${profile.fullName}`}
          accessibilityState={{ disabled: removing }}
          style={({ pressed }) => [styles.close, pressed && styles.closePressed]}
        >
          <Ionicons name="close" size={18} color={COLORS.cream} />
        </Pressable>
      </View>

      <Text style={styles.name} accessibilityRole="header" maxFontSizeMultiplier={1.6}>
        {profile.fullName}
      </Text>

      <View style={styles.accent} />

      <Text style={styles.education} maxFontSizeMultiplier={1.8}>
        {profile.education}
      </Text>
      <Text style={styles.age} maxFontSizeMultiplier={1.8}>
        Age {profile.age}
      </Text>
    </View>
  );
}

export default memo(ProfileCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: withAlpha(COLORS.cream, 0.05),
    borderRadius: 24,
    borderWidth: 1,
    borderColor: withAlpha(COLORS.cream, 0.14),
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 22,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  numberRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 14,
  },
  marker: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.red,
    marginRight: 8,
  },
  number: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    letterSpacing: 1.2,
    color: withAlpha(COLORS.cream, 0.6),
  },
  close: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: withAlpha(COLORS.cream, 0.24),
  },
  closePressed: {
    backgroundColor: withAlpha(COLORS.teal, 0.25),
    borderColor: COLORS.teal,
  },
  name: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.4,
    color: COLORS.cream,
    marginTop: 18,
  },
  accent: {
    width: 32,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.teal,
    marginTop: 14,
    marginBottom: 14,
  },
  education: {
    fontFamily: FONTS.body,
    fontSize: 15,
    lineHeight: 21,
    color: withAlpha(COLORS.cream, 0.82),
  },
  age: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.teal,
    marginTop: 8,
  },
});
