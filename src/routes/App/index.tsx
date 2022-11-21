import styles from './index.module.scss';
import Pie from 'components/Pie'

function App() {
  return (
    <div className={styles.App}>
      <Pie percentage={99} />
    </div>
  );
}

export default App;
