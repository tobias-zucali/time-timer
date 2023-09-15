import { useRef } from 'react';
import classNames from 'classnames';

import styles from './index.module.scss';


type Props = {
  isAlert?: boolean;
  isReadonly?: boolean;
  minutes: string;
  onMinutesChange: React.ChangeEventHandler<HTMLInputElement>;
  onSecondsChange: React.ChangeEventHandler<HTMLInputElement>;
  seconds: string;
  style?: React.StyleHTMLAttributes<SVGElement>;
}

function DigitalDisplay({
  isAlert = false,
  isReadonly = false,
  minutes,
  onMinutesChange,
  onSecondsChange,
  seconds,
  ...otherProps
}: Props) {
  const minuteInputRef = useRef<HTMLInputElement>(null);
  const secondsInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={classNames(
        styles.container,
        (isAlert && styles.container_isAlert) || (isReadonly && styles.container_isReadonly),
      )}
      {...otherProps}
    >
      <input
        className={classNames(styles.input, styles.input_min)}
        min="0"
        readOnly={isReadonly}
        ref={minuteInputRef}
        type="number"
        value={minutes}
        onKeyDown={({ key }) => {
          if (minuteInputRef.current && key === ':') {
            minuteInputRef.current.focus();
          }
        }}
        onChange={onMinutesChange}
      />
      <div
        className={styles.separator}
      >
        {' : '}
      </div>
      <input
        className={classNames(styles.input, styles.input_sec)}
        max="60"
        min="0"
        onChange={onSecondsChange}
        readOnly={isReadonly}
        ref={secondsInputRef}
        type="number"
        value={seconds}
      />
    </div>
  );
}

export default DigitalDisplay;
