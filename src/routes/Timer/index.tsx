import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from "react-router-dom";

import { prefixZeros, getSecondsDuration, getMinutesSeconds } from 'utils/timeInputHelpers';
import useAnimationFrame from 'utils/useAnimationFrame';
import useGlobalKeyUp from 'utils/useGlobalKeyUp';
import useSound from 'utils/useSound';
// import beep from 'utils/beep';

import EditableHtml from 'components/EditableHtml';
import Pie from 'components/Pie';
import DigitalDisplay from 'components/DigitalDisplay';

import styles from './index.module.scss';

function Timer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsObject = Object.fromEntries(searchParams);

  const sound = useSound();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const isStarted = (elapsedTime > 0);

  const {
    m: totalMinutes = '01',
    s: totalSeconds = '00',
    title = '',
  } = searchParamsObject;

  useEffect(() => {
    // initially set params
    setSearchParams({
      m: totalMinutes,
      s: totalSeconds,
      title,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalDuration = getSecondsDuration(totalMinutes, totalSeconds);
  const remainingSecondsRef = useRef(totalDuration);

  const elapsedPercentage = (elapsedTime) / totalDuration;
  const isTimedOut = (elapsedPercentage === 1);

  const [minutes = totalMinutes, seconds = totalSeconds] = (isStarted) ? getMinutesSeconds(
    totalDuration * (1 - elapsedPercentage),
  ) : [];

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
        // if (remainingSeconds <= 2) {
        //   beep({ duration: 100, frequency: 350 });
        // }
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
      case "r":
      case "Escape":
        resetTimer();
        break;
      case "Enter":
      case " ":
      case "p":
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
      <EditableHtml
        html={title}
        onChange={(value) => setSearchParams({
          ...searchParamsObject,
          title: value,
        })}
        className={styles.title}
      />
      <div
        className={styles.pieContainer}
      >
        <Pie
          percentage={100 * (1 - elapsedPercentage)}
        />

        <div
          className={styles.centerContainer}
        >
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
      </div>
    </div>
  );
}

export default Timer;
