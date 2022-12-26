import { useEffect, useState } from "react";
import styles from "./redacao.module.css";

const RedacaoEditor = () => {
  const [charCount, setCharCount] = useState(0);
  const [startTimestamp] = useState(Date.now());
  const [endTimestamp, setEndTimestamp] = useState(Date.now() + 2 * 1000 * 60 * 60);
  const [_, refreshScreen] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      refreshScreen(Date.now());
    }, 500);

    return () => clearInterval(timer);
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.page}>
        <textarea
          placeholder="Escreva sua redação aqui..."
          spellCheck={false}
          onChange={(ev) => setCharCount(ev.target.value.length)}
          maxLength={720}></textarea>
      </div>
      <div className={styles.info}>
        <span>{new Date(endTimestamp - Date.now()).toISOString().split("T")[1].slice(0, 8)}</span>
        <span>{charCount}/720</span>
      </div>
    </div>
  );
};

export default RedacaoEditor;
