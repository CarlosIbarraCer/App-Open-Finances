import React from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReduceMotionPreference() {
  const [reduceMotionEnabled, setReduceMotionEnabled] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((isEnabled) => {
      if (isMounted) {
        setReduceMotionEnabled(isEnabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled: boolean) => {
        setReduceMotionEnabled(isEnabled);
      },
    );

    return () => {
      isMounted = false;
      subscription.remove?.();
    };
  }, []);

  return reduceMotionEnabled;
}
