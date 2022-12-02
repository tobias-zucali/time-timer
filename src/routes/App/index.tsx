import { useRef, useState } from 'react';
import classNames from 'classnames'
import { prefixZeros, getDuration, getMinutesSeconds, getPercentage } from './utils'

import Pie from 'components/Pie'

import styles from './index.module.scss';


function App() {
  const [minutes, setMinutes] = useState('01');
  const [seconds, setSeconds] = useState('00');
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timer | null>(null);

  const minuteInputRef = useRef<HTMLInputElement>(null);
  const secondsInputRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<string>('01');
  const secondsRef = useRef<string>('00');
  const totalDurationSeconds = useRef<number>(0);

  const startInterval = () => {
    stopInterval();
    setTimer(setInterval(() => {
      setCurrentTimeSeconds((val) => {
        if (val > 0) {
          return val - 1;
        } else {
          stopInterval();
          setIsTimedOut(true);
          return 0;
        }
      });
    }, 1000));
  };

  
  const stopInterval = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const startTimer = () => {
    if (isStarted) {
      startInterval();
      return;
    }
    minuteRef.current = minuteInputRef.current?.value || '00'
    secondsRef.current = secondsInputRef.current?.value || '00'
    totalDurationSeconds.current = getDuration(minuteRef.current, secondsRef.current);
    if (totalDurationSeconds.current <= 0) {
      return;
    }
    setCurrentTimeSeconds(totalDurationSeconds.current);
    setIsStarted(true);
    setIsTimedOut(false);
    startInterval();
  };

  const pauseTimer = () => {
    stopInterval();
  }

  const stopTimer = () => {
    stopInterval();
    setIsStarted(false);
    setIsTimedOut(false);
  }

  const [currentMinutes, currentSeconds] = getMinutesSeconds(currentTimeSeconds);
  const percentage = isStarted
    ? getPercentage(currentTimeSeconds, totalDurationSeconds.current)
    : 100;

  return (
    <div
      className={styles.container}
    >
      <div
        className={styles.pieContainer}
      >
        {isTimedOut ? (
          <div
            className={styles.timeOut}
          >
            TIME OUT
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
          isStarted && styles.numbersContainer_isReadonly
        )}
      >
        <input
          className={classNames(styles.percentageInput, styles.percentageInput_min)}
          min="0"
          readOnly={isStarted}
          ref={minuteInputRef}
          type="number"
          value={isStarted ? currentMinutes : minutes}
          onKeyDown={({ key }) => {
            if (minuteInputRef.current && key === ':') { 
              minuteInputRef.current.focus()
            }
          }}
          onChange={({ target }) => setMinutes(prefixZeros(target.value))}
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
          onChange={({ target }) => setSeconds(prefixZeros(target.value))}
          readOnly={isStarted}
          ref={secondsInputRef}
          type="number"
          value={isStarted ? currentSeconds : seconds}
        />
      </div>
      <div
        className={styles.controlsContainer}
      >
        {isStarted ? (
          <>
            {timer ? (
              <button
                onClick={pauseTimer}
              >
                Pause
              </button>
            ) : (
              <button
                onClick={startTimer}
              >
                Resume
              </button>
            )}
            <button
              onClick={stopTimer}
            >
              Stop
            </button>
          </>
        ) : (
          <button
            onClick={startTimer}
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
