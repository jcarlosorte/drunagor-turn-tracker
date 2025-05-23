import { runeDependentCapabilities } from '@/components/constants';
import { useGame } from '@/context/GameContext';

export const adjustCapabilitiesByRunes = (capabilities, runeColor, getRuneCount) => {
  return capabilities.map(cap => {
    if (runeDependentCapabilities.includes(cap)) {
      const count = getRuneCount(runeColor);
      return cap.replace('X', `_${count}`);
    }
    return cap;
  });
};
