import { useState } from 'react';

import styles from './index.module.scss';

import Pie from 'components/Pie'


function App() {
  const [percentage, setPercentage] = useState(100)
  return (
    <div
    className={styles.container}
    >
      <div
        className={styles.pieContainer}
        >
        <Pie percentage={percentage} />
      </div>
      <input
        className={styles.percentageInput}
        onChange={({target}) => setPercentage(parseInt(target.value))}
        type="number"
        value={percentage}
      />
    </div>
  );
}

export default App;
