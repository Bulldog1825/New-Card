import {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
  ReduceMotion,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Every config opts out of Reanimated's automatic reduce-motion handling
// (which would skip animations entirely). The app supplies its own fades.
const never = { reduceMotion: ReduceMotion.Never };

// --- Button spin -----------------------------------------------------------

export const SPIN_DEGREES = 1440; // exactly four full rotations
export const SPIN_DURATION = 760;

// The new card is added at 75% of the spin, before the button disappears.
export const ADD_CARD_DELAY = Math.round(SPIN_DURATION * 0.75);

export const spinTiming = {
  duration: SPIN_DURATION,
  easing: Easing.linear,
  ...never,
};

// Ease-in keeps the button large while it spins, then collapses it fast.
// The trail layers mirror this curve as 1 - t^3, so keep the two in sync.
export const SHRINK_EXPONENT = 3;
export const shrinkTiming = {
  duration: SPIN_DURATION,
  easing: Easing.in(Easing.cubic),
  ...never,
};

// Quick return with a subtle bounce (~350ms to settle).
export const buttonReturnSpring = {
  damping: 18,
  stiffness: 300,
  mass: 0.8,
  ...never,
};

// Motion trail: echoes trail the button by a fraction of spin progress.
export const TRAIL = {
  progressLag: 0.045,
  opacities: [0.32, 0.15],
};

// Reduced motion: a brief opacity dip instead of the spin.
export const REDUCED_ADD_CARD_DELAY = 120;
export const dipDownTiming = { duration: 120, easing: Easing.out(Easing.quad), ...never };
export const dipUpTiming = { duration: 200, easing: Easing.out(Easing.quad), ...never };

// --- Cards -----------------------------------------------------------------

const cardSpring = { damping: 15, stiffness: 190, mass: 1, ...never };
const cardFadeInTiming = { duration: 220, easing: Easing.out(Easing.quad), ...never };
const cardExitScaleTiming = { duration: 260, easing: Easing.in(Easing.cubic), ...never };
const cardExitFadeTiming = { duration: 220, easing: Easing.in(Easing.quad), ...never };

export function cardEntering() {
  'worklet';
  return {
    initialValues: { opacity: 0, transform: [{ scale: 0 }] },
    animations: {
      opacity: withTiming(1, cardFadeInTiming),
      transform: [{ scale: withSpring(1, cardSpring) }],
    },
  };
}

export function cardExiting() {
  'worklet';
  return {
    initialValues: { opacity: 1, transform: [{ scale: 1 }] },
    animations: {
      opacity: withTiming(0, cardExitFadeTiming),
      transform: [{ scale: withTiming(0, cardExitScaleTiming) }],
    },
  };
}

// Existing cards slide to their new position when one is added or removed.
export const cardLayout = LinearTransition.duration(320)
  .easing(Easing.out(Easing.cubic))
  .reduceMotion(ReduceMotion.Never);

export const reducedCardEntering = FadeIn.duration(260).reduceMotion(ReduceMotion.Never);
export const reducedCardExiting = FadeOut.duration(220).reduceMotion(ReduceMotion.Never);
