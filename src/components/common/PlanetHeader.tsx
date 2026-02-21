import BackButton from './BackButton';
import styles from './PlanetHeader.module.css';

interface PlanetHeaderProps {
  /** Planet display name (Czech). */
  name: string;
  /** Planet emoji icon. */
  icon: string;
  /** Planet accent colour (hex). */
  color: string;
  /** Optional description shown below the name. */
  description?: string;
}

export default function PlanetHeader({ name, icon, color, description }: PlanetHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <BackButton />

        <div className={styles.titleArea}>
          <span
            className={styles.icon}
            role="img"
            aria-hidden="true"
            style={{ color }}
          >
            {icon}
          </span>
          <h1 className={styles.name} style={{ color }}>
            {name}
          </h1>
        </div>
      </div>

      {description && <p className={styles.description}>{description}</p>}

      <div className={styles.divider} />
    </header>
  );
}
