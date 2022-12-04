import { useEffect, useCallback, useRef, useState } from 'react';
import classNames from 'classnames';
import { useSearchParams } from "react-router-dom";
import { prefixZeros, getDuration, getMinutesSeconds, getPercentage } from './utils';

import Pie from 'components/Pie';
import beep from 'utils/beep';

import styles from './index.module.scss';


function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = {
    m: searchParams.get('m') || '01',
    s: searchParams.get('s') || '00',
    t: searchParams.get('t') || '',
  };

  const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timer | null>(null);

  const minuteInputRef = useRef<HTMLInputElement>(null);
  const secondsInputRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<string>('01');
  const secondsRef = useRef<string>('00');
  const totalDurationSeconds = useRef<number>(0);

  const stopInterval = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [timer]);

  const startTimer = useCallback(() => {
    const letASecondPass = () => {
      setCurrentTimeSeconds((val) => {
        if (val > 0) {
          if (val <= 3) {
            beep({ duration: (val === 1) ? 1000 : 300 });
          }
          return val - 1;
        } else {
          stopInterval();
          setIsTimedOut(true);
          return 0;
        }
      });
    };

    if (isStarted) {
      letASecondPass();
    } else {
      minuteRef.current = minuteInputRef.current?.value || '00';
      secondsRef.current = secondsInputRef.current?.value || '00';
      totalDurationSeconds.current = getDuration(minuteRef.current, secondsRef.current);
      if (totalDurationSeconds.current <= 0) {
        return;
      }
      setCurrentTimeSeconds(totalDurationSeconds.current);
      setIsStarted(true);
      setIsTimedOut(false);
    }

    stopInterval();
    setTimer(setInterval(letASecondPass, 1000));
  }, [isStarted, stopInterval]);

  const stopTimer = useCallback(() => {
    stopInterval();
    setIsStarted(false);
    setIsTimedOut(false);
  }, [stopInterval]);

  useEffect(() => {
    const onKeyUp = ({ key }: KeyboardEvent) => {

      const toggleTimer = () => {
        if (timer) {
          stopInterval();
        } else {
          startTimer();
        }
      };

      switch (key) {
        case "Escape":
          stopTimer();
          break;
        case "Enter":
        case " ":
          toggleTimer();
          break;
      }
    };
    window.addEventListener("keyup", onKeyUp, false);
    return () => {
      window.removeEventListener("keyup", onKeyUp, false);
    };
  }, [setTimer, startTimer, stopInterval, stopTimer, timer]);

  const [currentMinutes, currentSeconds] = getMinutesSeconds(currentTimeSeconds);
  const percentage = isStarted
    ? getPercentage(currentTimeSeconds, totalDurationSeconds.current)
    : 100;

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
            percentage={percentage}
          />
        )}
      </div>
      <div
        className={classNames(
          styles.numbersContainer,
          isStarted && styles.numbersContainer_isReadonly,
        )}
      >
        <input
          className={classNames(styles.percentageInput, styles.percentageInput_min)}
          min="0"
          readOnly={isStarted}
          ref={minuteInputRef}
          type="number"
          value={isStarted ? currentMinutes : params.m}
          onKeyDown={({ key }) => {
            if (minuteInputRef.current && key === ':') {
              minuteInputRef.current.focus();
            }
          }}
          onChange={({ target }) => setSearchParams({
            ...params,
            m: prefixZeros(target.value),
          })}
        />
        <div
          className={styles.separator}
        >
          {' : '}
        </div>
        <input
          className={classNames(styles.percentageInput, styles.percentageInput_sec)}
          max="60"
          min="0"
          onChange={({ target }) => setSearchParams({
            ...params,
            s: prefixZeros(target.value),
          })}
          readOnly={isStarted}
          ref={secondsInputRef}
          type="number"
          value={isStarted ? currentSeconds : params.s}
        />
      </div>
      <div
        className={styles.controlsContainer}
      >
        <button
          disabled={isTimedOut}
          onClick={timer ? stopInterval : startTimer}
        >
          {timer ? 'STOP' : 'START'}
        </button>
        <button
          disabled={!isStarted}
          onClick={stopTimer}
        >
          RESET
        </button>
      </div>
    </div>
  );
}

export default App;
