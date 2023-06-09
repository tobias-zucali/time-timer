import { useMemo } from 'react';
import sound from './Old_Ring_Ringing.mp3';

export default function useSound() {
  const audio = useMemo(() => new Audio(sound), []);
  return audio;
}
