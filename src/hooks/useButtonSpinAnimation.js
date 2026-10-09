import { useCallback, useEffect, useRef, useState } from 'react';
import {
  cancelAnimation,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
  ADD_CARD_DELAY,
  buttonReturnSpring,
  dipDownTiming,
  dipUpTiming,
  REDUCED_ADD_CARD_DELAY,
  SHRINK_EXPONENT,
  shrinkTiming,
  SPIN_DEGREES,
  spinTiming,
  TRAIL,
} from '../animations/profileCardAnimations';

const STATUS = { idle: 'idle', spinning: 'spinning' };

// One echo layer of the motion trail. It derives its pose from the button's
// spin progress, lagging slightly behind in both rotation and scale. It is
// fully transparent at rest (rotation 0) and at the end of the spin (1440).
function useTrailStyle(rotation, index) {
  return useAnimatedStyle(() => {
    const progress = rotation.value / SPIN_DEGREES;
    const lagged = Math.max(0, progress - TRAIL.progressLag * index);
    const envelope = interpolate(
      progress,
      [0, 0.1, 0.8, 1],
      [0, 1, 1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity: TRAIL.opacities[index - 1] * envelope,
      transform: [
        { rotate: `${lagged * SPIN_DEGREES}deg` },
        { scale: 1 - Math.pow(lagged, SHRINK_EXPONENT) },
      ],
    };
  });
}

export function useButtonSpinAnimation() {
  const reduceMotion = useReducedMotion();

  // React state drives rendering; the ref is the synchronous guard so two
  // taps in the same frame can't both start a spin.
  const [status, setStatus] = useState(STATUS.idle);
  const statusRef = useRef(STATUS.idle);
  const updateStatus = useCallback((next) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const addTimerRef = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(addTimerRef.current);
      cancelAnimation(rotation);
      cancelAnimation(scale);
      cancelAnimation(opacity);
    },
    [rotation, scale, opacity]
  );

  // Plays one full spin and calls `onAddCard` once, partway through.
  const trigger = useCallback(
    (onAddCard) => {
      if (statusRef.current !== STATUS.idle) return;
      updateStatus(STATUS.spinning);

      cancelAnimation(rotation);
      cancelAnimation(scale);
      cancelAnimation(opacity);
      rotation.value = 0;
      scale.value = 1;
      opacity.value = 1;

      clearTimeout(addTimerRef.current);
      addTimerRef.current = setTimeout(
        () => onAddCard?.(),
        reduceMotion ? REDUCED_ADD_CARD_DELAY : ADD_CARD_DELAY
      );

      const onDone = (finished) => {
        'worklet';
        if (finished) scheduleOnRN(updateStatus, STATUS.idle);
      };

      if (reduceMotion) {
        opacity.value = withSequence(
          withTiming(0.45, dipDownTiming),
          withTiming(1, dipUpTiming, onDone)
        );
        return;
      }

      // Rotation snaps 1440 → 0 the instant the spin ends, which is the same
      // frame the button reaches scale 0, so it never visibly spins backwards.
      rotation.value = withSequence(
        withTiming(SPIN_DEGREES, spinTiming),
        withTiming(0, { duration: 0 })
      );
      scale.value = withSequence(
        withTiming(0, shrinkTiming),
        withSpring(1, buttonReturnSpring, onDone)
      );
    },
    [reduceMotion, updateStatus, rotation, scale, opacity]
  );

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  // Farthest echo first so it renders underneath.
  const trailStyles = [useTrailStyle(rotation, 2), useTrailStyle(rotation, 1)];

  return {
    isSpinning: status === STATUS.spinning,
    reduceMotion,
    trigger,
    buttonAnimatedStyle,
    trailStyles,
  };
}
