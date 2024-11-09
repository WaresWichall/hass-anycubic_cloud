enum HapticStrength {
  Light = "light",
  Medium = "medium",
  Heavy = "heavy",
}

interface HapticEvent extends Event {
  detail: HapticStrength;
}

const fireHaptic = (
  hapticStrength: HapticStrength = HapticStrength.Medium,
): void => {
  const event: HapticEvent = new Event("haptic") as HapticEvent;
  event.detail = hapticStrength;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (window) {
    window.dispatchEvent(event);
  }
};

export { fireHaptic, HapticStrength };
