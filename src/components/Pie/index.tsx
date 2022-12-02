import styles from './index.module.scss';

type Props = {
  percentage: number;
  style?: React.StyleHTMLAttributes<SVGElement>;
}

function Pie({
  percentage,
  ...otherProps
}: Props) {
  const diameter = 10;
  const sideLength = 2 * diameter;
  const fullCircle = Math.PI * diameter;
  return (
    <svg
      className={styles.pie}
      height={ sideLength }
      style={{
        height: '100%',
        width: '100%'
      }}
      viewBox={`0 0 ${sideLength} ${sideLength}`}
      width={ sideLength }
      {...otherProps}
    >
      <circle
        className={styles.pie_stroke}
        r={diameter / 2}
        cx={diameter}
        cy={diameter}
        strokeWidth={diameter}
        strokeDasharray={`${fullCircle * percentage / 100} ${fullCircle}`}
        transform="scale(-1 1) rotate(270, 10, 10) translate(0 -20)"
      />
    </svg>
  );
}

export default Pie;
