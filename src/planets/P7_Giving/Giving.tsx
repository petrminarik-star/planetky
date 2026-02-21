import { useState } from 'react';
import PlanetHeader from '../../components/common/PlanetHeader';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { GivingEntry } from '../../types';
import styles from './Giving.module.css';

const INITIAL_FORM = {
  whatToGiveRegular: '',
  whatToGiveOneTime: '',
  whoToHelp: '',
  volunteerWork: '',
  strengths: '',
  appreciated: '',
};

export default function Giving() {
  const [entries, setEntries] = useLocalStorage<GivingEntry[]>('giving_entries', []);
  const [form, setForm] = useState(INITIAL_FORM);
  const [showForm, setShowForm] = useState(entries.length === 0);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof typeof INITIAL_FORM, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const hasContent = Object.values(form).some(v => v.trim() !== '');
    if (!hasContent) return;

    // Create two entries if both regular and one-time have content
    const newEntries: GivingEntry[] = [];

    if (form.whatToGiveRegular.trim() || form.whoToHelp.trim() || form.volunteerWork.trim() || form.strengths.trim()) {
      newEntries.push({
        id: Date.now().toString(),
        type: 'regular',
        whatToGive: form.whatToGiveRegular.trim(),
        whoToHelp: form.whoToHelp.trim(),
        volunteerWork: form.volunteerWork.trim(),
        strengths: `${form.strengths.trim()}${form.appreciated.trim() ? '\n' + form.appreciated.trim() : ''}`,
        createdAt: new Date().toISOString(),
      });
    }

    if (form.whatToGiveOneTime.trim()) {
      newEntries.push({
        id: (Date.now() + 1).toString(),
        type: 'oneTime',
        whatToGive: form.whatToGiveOneTime.trim(),
        whoToHelp: form.whoToHelp.trim(),
        volunteerWork: form.volunteerWork.trim(),
        strengths: `${form.strengths.trim()}${form.appreciated.trim() ? '\n' + form.appreciated.trim() : ''}`,
        createdAt: new Date().toISOString(),
      });
    }

    // If neither regular nor one-time specific content, save as regular
    if (newEntries.length === 0) {
      newEntries.push({
        id: Date.now().toString(),
        type: 'regular',
        whatToGive: '',
        whoToHelp: form.whoToHelp.trim(),
        volunteerWork: form.volunteerWork.trim(),
        strengths: `${form.strengths.trim()}${form.appreciated.trim() ? '\n' + form.appreciated.trim() : ''}`,
        createdAt: new Date().toISOString(),
      });
    }

    setEntries(prev => [...newEntries, ...prev]);
    setForm(INITIAL_FORM);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowForm(false);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className={styles.container}>
      <PlanetHeader name="Davani" icon="❤️" color="#ef4444" />

      <div className={styles.content}>
        {/* Intro section */}
        <div className={styles.intro}>
          <h2 className={styles.introTitle}>Dej a bude ti dano...</h2>
          <p className={styles.introText}>
            Znamena to, ze kdyz davas - cas, pozornost, pomoc, laskavost, podporu, energii - zivot ti to vraci. Ne vzdy hned. Ne vzdy stejnym zpusobem. Ale vraci.
          </p>
          <div className={styles.heartDecoration}>
            <span className={styles.heart1}>&#10084;</span>
            <span className={styles.heart2}>&#10084;</span>
            <span className={styles.heart3}>&#10084;</span>
          </div>
        </div>

        {/* Toggle form */}
        {!showForm && (
          <button className={styles.newEntryBtn} onClick={() => setShowForm(true)}>
            + Novy zapis
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className={styles.form}>
            <h3 className={styles.formTitle}>Co chces darovat svetu?</h3>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span className={styles.labelIcon}>&#128257;</span>
                Co bys rad daroval pravidelne?
              </label>
              <textarea
                className={styles.formTextArea}
                value={form.whatToGiveRegular}
                onChange={e => handleChange('whatToGiveRegular', e.target.value)}
                placeholder="Napr. cas s babickou, pomoc sousedce..."
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span className={styles.labelIcon}>&#127873;</span>
                Co bys rad daroval jednorazove?
              </label>
              <textarea
                className={styles.formTextArea}
                value={form.whatToGiveOneTime}
                onChange={e => handleChange('whatToGiveOneTime', e.target.value)}
                placeholder="Napr. hracky detem v nemocnici..."
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span className={styles.labelIcon}>&#129309;</span>
                Komu bys chtel pomahat pravidelne?
              </label>
              <textarea
                className={styles.formTextArea}
                value={form.whoToHelp}
                onChange={e => handleChange('whoToHelp', e.target.value)}
                placeholder="Napr. starsim lidem, zviratem v utulku..."
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span className={styles.labelIcon}>&#127758;</span>
                Co bys chtel delat za dobrovolnickou praci?
              </label>
              <textarea
                className={styles.formTextArea}
                value={form.volunteerWork}
                onChange={e => handleChange('volunteerWork', e.target.value)}
                placeholder="Napr. uklid prirody, cteni detem..."
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span className={styles.labelIcon}>&#128170;</span>
                V cem jsou tve silne stranky?
              </label>
              <textarea
                className={styles.formTextArea}
                value={form.strengths}
                onChange={e => handleChange('strengths', e.target.value)}
                placeholder="Napr. jsem trpelivy, umim dobre poslouchat..."
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span className={styles.labelIcon}>&#11088;</span>
                Co ti jde? Co na tobe lide ocenuji?
              </label>
              <textarea
                className={styles.formTextArea}
                value={form.appreciated}
                onChange={e => handleChange('appreciated', e.target.value)}
                placeholder="Napr. umim rozveselit, jsem spolehlivy..."
                rows={3}
              />
            </div>

            <div className={styles.formActions}>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={!Object.values(form).some(v => v.trim())}
              >
                {saved ? '&#10003; Ulozeno!' : '&#10084; Ulozit'}
              </button>
              {entries.length > 0 && (
                <button
                  className={styles.cancelFormBtn}
                  onClick={() => { setShowForm(false); setForm(INITIAL_FORM); }}
                >
                  Zrusit
                </button>
              )}
            </div>
          </div>
        )}

        {/* Saved entries */}
        {entries.length > 0 && (
          <div className={styles.entriesSection}>
            <h3 className={styles.entriesTitle}>Moje dary svetu</h3>
            <div className={styles.entriesGrid}>
              {entries.map(entry => (
                <div
                  key={entry.id}
                  className={`${styles.entryCard} ${entry.type === 'oneTime' ? styles.entryCardOneTime : ''}`}
                >
                  <div className={styles.entryCardHeader}>
                    <span className={styles.entryBadge}>
                      {entry.type === 'regular' ? '&#128257; Pravidelne' : '&#127873; Jednorazove'}
                    </span>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(entry.id)}
                      aria-label="Smazat"
                    >
                      &#10005;
                    </button>
                  </div>

                  {entry.whatToGive && (
                    <div className={styles.entryField}>
                      <span className={styles.entryFieldLabel}>Co daruji:</span>
                      <p>{entry.whatToGive}</p>
                    </div>
                  )}

                  {entry.whoToHelp && (
                    <div className={styles.entryField}>
                      <span className={styles.entryFieldLabel}>Komu pomahám:</span>
                      <p>{entry.whoToHelp}</p>
                    </div>
                  )}

                  {entry.volunteerWork && (
                    <div className={styles.entryField}>
                      <span className={styles.entryFieldLabel}>Dobrovolnictvi:</span>
                      <p>{entry.volunteerWork}</p>
                    </div>
                  )}

                  {entry.strengths && (
                    <div className={styles.entryField}>
                      <span className={styles.entryFieldLabel}>Moje sila:</span>
                      <p>{entry.strengths}</p>
                    </div>
                  )}

                  <div className={styles.entryDate}>
                    {new Date(entry.createdAt).toLocaleDateString('cs-CZ', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
