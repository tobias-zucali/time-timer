import { useRef, useState } from 'react';
import { useSearchParams } from "react-router-dom";

import { prefixZeros, getSecondsDuration, getMinutesSeconds } from 'utils/timeInputHelpers';
import useAnimationFrame from 'utils/useAnimationFrame';
import useGlobalKeyUp from 'utils/useGlobalKeyUp';
import beep from 'utils/beep';
import useSound from 'utils/useSound';

import Pie from 'components/Pie';
import DigitalDisplay from 'components/DigitalDisplay';
import AnimatedBell from 'components/AnimatedBell';

import styles from './index.module.scss';


function Timer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsObject = Object.fromEntries(searchParams);

  const sound = useSound();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const isStarted = (elapsedTime > 0);

  let {
    m: minutes = '01',
    s: seconds = '00',
    title,
  } = searchParamsObject;

  const totalDuration = getSecondsDuration(minutes, seconds);
  const remainingSecondsRef = useRef(totalDuration);

  const elapsedPercentage = (elapsedTime) / totalDuration;
  const isTimedOut = (elapsedPercentage === 1);

  if (isStarted) {
    [minutes, seconds] = getMinutesSeconds(
      totalDuration * (1 - elapsedPercentage),
    );
  }

  useAnimationFrame(
    (deltaTime) => setElapsedTime((prevState) => {
      const newValue = prevState + deltaTime / 1000;
      if (newValue > totalDuration) {
        sound.play();

        remainingSecondsRef.current = 0;
        setIsPaused(true);
        return totalDuration;
      }
      const remainingSeconds = Math.ceil(totalDuration - newValue);
      if (remainingSeconds !== remainingSecondsRef.current) {
        remainingSecondsRef.current = remainingSeconds;
        if (remainingSeconds <= 2) {
          beep({ duration: 100, frequency: 350 });
        }
      }
      return newValue;
    }),
    { isPaused: isTimedOut || isPaused },
  );

  const resetTimer = () => {
    remainingSecondsRef.current = totalDuration;
    setIsPaused(true);
    setElapsedTime(0);
  };

  const toggleTimer = () => {
    setIsPaused((prevState) => !prevState);
  };

  useGlobalKeyUp((event: KeyboardEvent) => {
    const target = event.target as any;
    if (target && target.tagName === 'BUTTON') {
      return;
    }
    switch (event.key) {
      case "Escape":
        resetTimer();
        break;
      case "Enter":
      case " ":
        if (!isTimedOut) {
          toggleTimer();
        }
        break;
    }
  });

  return (
    <div
      className={styles.container}
    >
      {title && (
        <div
          className={styles.title}
        >
          {title}
        </div>
      )}
      <div
        className={styles.pieContainer}
      >
        {isTimedOut ? (
          <AnimatedBell
            className={styles.bell}
          />
        ) : (
          <Pie
            percentage={100 * (1 - elapsedPercentage)}
          />
        )}
      </div>
      <DigitalDisplay
        minutes={minutes}
        seconds={seconds}
        isReadonly={isStarted}
        onMinutesChange={({ target }) => setSearchParams({
          ...searchParamsObject,
          m: prefixZeros(target.value),
        })}
        onSecondsChange={({ target }) => setSearchParams({
          ...searchParamsObject,
          s: prefixZeros(target.value),
        })}
      />
      <div
        className={styles.controlsContainer}
      >
        <button
          disabled={isTimedOut}
          onClick={toggleTimer}
        >
          {isPaused || !isStarted ? 'START' : 'STOP'}
        </button>
        <button
          disabled={!isStarted}
          onClick={resetTimer}
        >
          RESET
        </button>
      </div>
    </div>
  );
}

export default Timer;
