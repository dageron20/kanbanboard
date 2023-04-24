import React from 'react';
import styles from "./styles/main.module.scss";
import {Board} from "./components/Board/Board";

const App: React.FC = () => {

  return (
      <>
          <div className={styles.test}>
              <Board />
          </div>
      </>
  );
}

export default App;
