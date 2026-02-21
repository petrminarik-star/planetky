import { useApp } from '../../context/AppContext';
import styles from './BackButton.module.css';

interface BackButtonProps {
  /** Override default label "Zpět do vesmíru" */
  label?: string;
}

export default function BackButton({ label = 'Zpět do vesmíru' }: BackButtonProps) {
  const { navigateTo } = useApp();

  return (
    <button
      className={styles.button}
      onClick={() => navigateTo('universe')}
      aria-label={label}
    >
      <span className={styles.icon} role="img" aria-hidden="true">
        🚀
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
