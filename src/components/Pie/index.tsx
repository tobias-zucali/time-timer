import styles from './index.module.scss';

type Props = {
  color?: string | undefined;
  percentage: number;
  style?: React.StyleHTMLAttributes<SVGElement>;
}

function Pie({
  color = 'red',
  percentage,
  style,
  ...otherProps
}: Props) {
  const diameter = 10;
  const fullCircle = Math.PI * diameter;
  return (
    <svg
      style={{
        width: '100%',
        height: '100%',
        ...style
      }}
      height="20"
      width="20"
      viewBox="0 0 20 20"
      {...otherProps}
    >
      <circle r="10" cx="10" cy="10" fill="transparent" />
      <circle r="5" cx="10" cy="10" fill="transparent"
              stroke={color}
              stroke-width="10"
              stroke-dasharray={`${fullCircle * percentage / 100} ${fullCircle}`} />
    </svg>
  );
}

export default Pie;
