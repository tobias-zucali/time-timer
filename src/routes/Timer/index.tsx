import { useState } from 'react';
import { useSearchParams } from "react-router-dom";

import Pie from 'components/Pie';
import DigitalDisplay from 'components/DigitalDisplay';
/* import beep from 'utils/beep'; */
import { prefixZeros, getSecondsDuration, getMinutesSeconds } from 'utils/timeInputHelpers';
import useAnimationFrame from 'utils/useAnimationFrame';
import useGlobalKeyUp from 'utils/useGlobalKeyUp';

import styles from './index.module.scss';


function Timer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = {
    m: searchParams.get('m') || '01',
    s: searchParams.get('s') || '00',
    t: searchParams.get('t') || '',
  };

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const isStarted = (elapsedTime > 0);

  const totalDuration = getSecondsDuration(params.m, params.s);

  const elapsedPercentage = (elapsedTime) / totalDuration;
  const isTimedOut = (elapsedPercentage === 1);

  let minutes = params.m;
  let seconds = params.s;
  if (isStarted) {
    [minutes, seconds] = getMinutesSeconds(
      totalDuration * (1 - elapsedPercentage),
    );
  }

  useAnimationFrame(
    (deltaTime) => setElapsedTime((prevState) => {
      const newValue = prevState + deltaTime / 1000;
      if (newValue > totalDuration) {
        setIsPaused(true);
        return totalDuration;
      }
      return newValue;
    }),
    { isPaused: isTimedOut || isPaused },
  );

  /*       if (val > 0) {
          if (val <= 3) {
            beep({ duration: (val === 1) ? 1000 : 300 });
          }
          return val - 1;
        } */

  const resetTimer = () => {
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
      {params.t && (
        <div
          className={styles.title}
        >
          {params.t}
        </div>
      )}
      <div
        className={styles.pieContainer}
      >
        {isTimedOut ? (
          <div
            className={styles.timeOver}
          >
            TIME OVER
          </div>
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
          ...params,
          m: prefixZeros(target.value),
        })}
        onSecondsChange={({ target }) => setSearchParams({
          ...params,
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
