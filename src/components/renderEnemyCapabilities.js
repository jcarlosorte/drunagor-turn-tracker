import { adjustCapabilitiesByRunes } from '@/components/adjustCapabilitiesByRunes';
import { useGame } from '@/context/GameContext';

export const useRenderEnemyCapabilities = (capacidadesOriginales, runeColor) => {
  const { getRuneCount } = useGame();
  const runeCount = getRuneCount(runeColor);
  return adjustCapabilitiesByRunes(capacidadesOriginales, runeColor, runeCount);
};
