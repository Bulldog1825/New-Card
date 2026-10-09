import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { COLORS, withAlpha } from '../constants/colors';
import { FONTS } from '../constants/fonts';
import { useButtonSpinAnimation } from '../hooks/useButtonSpinAnimation';

export const BUTTON_WIDTH = 240;
export const BUTTON_HEIGHT = 60;
const BUTTON_RADIUS = 20;

// The button and its trail echoes share one fixed-size wrapper, stacked on
// top of each other, so they all rotate and shrink around the same center.
export default function GenerateProfileButton({ onGenerate, label = 'Generate Profile' }) {
  const { isSpinning, reduceMotion, trigger, buttonAnimatedStyle, trailStyles } =
    useButtonSpinAnimation();

  const handlePress = useCallback(() => trigger(onGenerate), [trigger, onGenerate]);

  return (
    <View style={styles.wrapper}>
      {!reduceMotion &&
        trailStyles.map((trailStyle, index) => (
          <Animated.View key={index} pointerEvents="none" style={[styles.echo, trailStyle]} />
        ))}

      <Animated.View style={[styles.fill, buttonAnimatedStyle]}>
        <Pressable
          onPress={handlePress}
          disabled={isSpinning}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint="Adds a card with a randomly generated profile"
          accessibilityState={{ disabled: isSpinning }}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text
            style={styles.label}
            numberOfLines={1}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.3}
          >
            {label}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
  },
  fill: {
    ...StyleSheet.absoluteFill,
  },
  echo: {
    ...StyleSheet.absoluteFill,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: COLORS.teal,
  },
  button: {
    flex: 1,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: withAlpha(COLORS.cream, 0.22),
    shadowColor: COLORS.teal,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    shadowOpacity: 0.15,
  },
  label: {
    fontFamily: FONTS.headingMedium,
    fontSize: 17,
    letterSpacing: 0.4,
    color: COLORS.cream,
  },
});
