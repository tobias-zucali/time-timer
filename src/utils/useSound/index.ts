import { useMemo } from 'react';
import sound from './Attention.mp3';

export default function useSound() {
  const audio = useMemo(() => new Audio(sound), []);
  return audio;
}
