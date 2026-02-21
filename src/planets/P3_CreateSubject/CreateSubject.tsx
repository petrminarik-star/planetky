import { useState } from 'react';
import PlanetHeader from '../../components/common/PlanetHeader';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Subject } from '../../types';
import styles from './CreateSubject.module.css';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const EMOJI_OPTIONS = [
  '\uD83C\uDFA8', '\uD83C\uDFB5', '\uD83D\uDD2C', '\uD83D\uDE80', '\uD83C\uDF0D',
  '\uD83E\uDDE0', '\u2764\uFE0F', '\u26BD', '\uD83D\uDCDA', '\uD83C\uDFAE',
  '\uD83C\uDF33', '\uD83D\uDC3E', '\uD83C\uDF1F', '\uD83D\uDD25', '\uD83C\uDF08',
  '\uD83E\uDD16', '\uD83C\uDF55', '\u2708\uFE0F', '\uD83D\uDCA1', '\uD83C\uDFC6',
];

const emptyForm = {
  name: '',
  whatToLearn: '',
  howTeaching: '',
  tools: '',
  goalOneYear: '',
  goalFourYears: '',
  logo: '\uD83C\uDFA8',
};

type FormFields = typeof emptyForm;

export default function CreateSubject() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('createsubject_subjects', []);
  const [form, setForm] = useState<FormFields>({ ...emptyForm });
  const [view, setView] = useState<'list' | 'form' | 'preview'>('list');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [customEmoji, setCustomEmoji] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateField = (field: keyof FormFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = form.name.trim().length > 0;

  const openNewForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setView('form');
  };

  const openEditForm = (subject: Subject) => {
    setForm({
      name: subject.name,
      whatToLearn: subject.whatToLearn,
      howTeaching: subject.howTeaching,
      tools: subject.tools,
      goalOneYear: subject.goalOneYear,
      goalFourYears: subject.goalFourYears,
      logo: subject.logo,
    });
    setEditingId(subject.id);
    setView('form');
  };

  const saveSubject = () => {
    if (!isFormValid) return;

    if (editingId) {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: form.name.trim(),
                whatToLearn: form.whatToLearn.trim(),
                howTeaching: form.howTeaching.trim(),
                tools: form.tools.trim(),
                goalOneYear: form.goalOneYear.trim(),
                goalFourYears: form.goalFourYears.trim(),
                logo: form.logo,
              }
            : s
        )
      );
    } else {
      const newSubject: Subject = {
        id: generateId(),
        name: form.name.trim(),
        whatToLearn: form.whatToLearn.trim(),
        howTeaching: form.howTeaching.trim(),
        tools: form.tools.trim(),
        goalOneYear: form.goalOneYear.trim(),
        goalFourYears: form.goalFourYears.trim(),
        logo: form.logo,
        createdAt: new Date().toISOString(),
      };
      setSubjects((prev) => [newSubject, ...prev]);
    }

    setView('list');
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const selectEmoji = (emoji: string) => {
    updateField('logo', emoji);
    setShowEmojiPicker(false);
  };

  const handleCustomEmoji = () => {
    if (customEmoji.trim()) {
      updateField('logo', customEmoji.trim());
      setCustomEmoji('');
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className={styles.container}>
      <PlanetHeader name="Vytvor si predmet" icon="\uD83D\uDCDA" color="#00CED1" />

      <div className={styles.content}>
        {/* === LIST VIEW === */}
        {view === 'list' && (
          <div className={styles.listView}>
            <button className={styles.createButton} onClick={openNewForm}>
              <span className={styles.createIcon}>+</span>
              Vytvorit novy predmet
            </button>

            {subjects.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>{'\uD83D\uDCDA'}</span>
                <p className={styles.emptyText}>
                  Zatim jsi nevytvoril/a zadny predmet. Vymysli svuj vlastni!
                </p>
              </div>
            ) : (
              <div className={styles.subjectGrid}>
                {subjects.map((subject, index) => (
                  <div
                    key={subject.id}
                    className={styles.subjectCard}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className={styles.subjectLogo}>{subject.logo}</div>
                    <div className={styles.subjectInfo}>
                      <h3 className={styles.subjectName}>{subject.name}</h3>
                      {subject.whatToLearn && (
                        <p className={styles.subjectDesc}>{subject.whatToLearn}</p>
                      )}
                    </div>
                    <div className={styles.subjectActions}>
                      <button
                        className={styles.viewButton}
                        onClick={() => {
                          openEditForm(subject);
                          setView('preview');
                        }}
                      >
                        Zobrazit
                      </button>
                      <button
                        className={styles.editBtn}
                        onClick={() => openEditForm(subject)}
                        aria-label="Upravit"
                      >
                        {'\u270F\uFE0F'}
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteSubject(subject.id)}
                        aria-label="Smazat"
                      >
                        {'\uD83D\uDDD1\uFE0F'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === FORM VIEW === */}
        {view === 'form' && (
          <div className={styles.formView}>
            <h2 className={styles.formTitle}>
              {editingId ? 'Upravit predmet' : 'Novy predmet'}
            </h2>

            {/* Logo selector */}
            <div className={styles.logoSection}>
              <label className={styles.label}>Logo predmetu</label>
              <div className={styles.logoRow}>
                <button
                  className={styles.currentLogo}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  type="button"
                >
                  {form.logo}
                </button>
                <span className={styles.logoHint}>Klikni pro zmenu</span>
              </div>

              {showEmojiPicker && (
                <div className={styles.emojiPicker}>
                  <div className={styles.emojiGrid}>
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        className={`${styles.emojiOption} ${form.logo === emoji ? styles.emojiSelected : ''}`}
                        onClick={() => selectEmoji(emoji)}
                        type="button"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className={styles.customEmojiRow}>
                    <input
                      className={styles.customEmojiInput}
                      type="text"
                      value={customEmoji}
                      onChange={(e) => setCustomEmoji(e.target.value)}
                      placeholder="Vlastni emoji..."
                      maxLength={4}
                    />
                    <button
                      className={styles.customEmojiBtn}
                      onClick={handleCustomEmoji}
                      type="button"
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nazev predmetu *</label>
              <input
                className={styles.input}
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Jak se tvuj predmet jmenuje?"
                maxLength={80}
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Co se v predmetu uci</label>
              <textarea
                className={styles.textarea}
                value={form.whatToLearn}
                onChange={(e) => updateField('whatToLearn', e.target.value)}
                placeholder="Co zajimaveho se v nem naucis?"
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Jak bude vypadat vyuka</label>
              <textarea
                className={styles.textarea}
                value={form.howTeaching}
                onChange={(e) => updateField('howTeaching', e.target.value)}
                placeholder="Kde se bude ucit? Jake aktivity budou?"
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Jake pomucky se budou pouzivat</label>
              <textarea
                className={styles.textarea}
                value={form.tools}
                onChange={(e) => updateField('tools', e.target.value)}
                placeholder="Sesity, tablety, pokusy, priroda...?"
                rows={2}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Co by ses mel naucit za rok</label>
              <textarea
                className={styles.textarea}
                value={form.goalOneYear}
                onChange={(e) => updateField('goalOneYear', e.target.value)}
                placeholder="Co zvladnes za prvni rok?"
                rows={2}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Co by ses mel naucit za 4 roky</label>
              <textarea
                className={styles.textarea}
                value={form.goalFourYears}
                onChange={(e) => updateField('goalFourYears', e.target.value)}
                placeholder="A co za ctyri roky?"
                rows={2}
              />
            </div>

            <div className={styles.formActions}>
              <button
                className={styles.previewButton}
                onClick={() => setView('preview')}
                disabled={!isFormValid}
              >
                Nahled
              </button>
              <button
                className={styles.saveFormButton}
                onClick={saveSubject}
                disabled={!isFormValid}
              >
                {editingId ? 'Ulozit zmeny' : 'Ulozit predmet'}
              </button>
              <button
                className={styles.cancelFormButton}
                onClick={() => setView('list')}
              >
                Zrusit
              </button>
            </div>
          </div>
        )}

        {/* === PREVIEW VIEW === */}
        {view === 'preview' && (
          <div className={styles.previewView}>
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <span className={styles.previewLogo}>{form.logo}</span>
                <h2 className={styles.previewName}>{form.name || 'Nazev predmetu'}</h2>
              </div>

              {form.whatToLearn && (
                <div className={styles.previewSection}>
                  <h4 className={styles.previewLabel}>{'\uD83D\uDCD6'} Co se uci</h4>
                  <p className={styles.previewText}>{form.whatToLearn}</p>
                </div>
              )}

              {form.howTeaching && (
                <div className={styles.previewSection}>
                  <h4 className={styles.previewLabel}>{'\uD83C\uDFEB'} Jak probiha vyuka</h4>
                  <p className={styles.previewText}>{form.howTeaching}</p>
                </div>
              )}

              {form.tools && (
                <div className={styles.previewSection}>
                  <h4 className={styles.previewLabel}>{'\uD83D\uDEE0\uFE0F'} Pomucky</h4>
                  <p className={styles.previewText}>{form.tools}</p>
                </div>
              )}

              {form.goalOneYear && (
                <div className={styles.previewSection}>
                  <h4 className={styles.previewLabel}>{'\uD83C\uDFAF'} Cil za 1 rok</h4>
                  <p className={styles.previewText}>{form.goalOneYear}</p>
                </div>
              )}

              {form.goalFourYears && (
                <div className={styles.previewSection}>
                  <h4 className={styles.previewLabel}>{'\uD83D\uDE80'} Cil za 4 roky</h4>
                  <p className={styles.previewText}>{form.goalFourYears}</p>
                </div>
              )}
            </div>

            <div className={styles.previewActions}>
              <button
                className={styles.backToFormButton}
                onClick={() => setView('form')}
              >
                Zpet na formular
              </button>
              <button
                className={styles.saveFromPreviewButton}
                onClick={saveSubject}
                disabled={!isFormValid}
              >
                {editingId ? 'Ulozit zmeny' : 'Ulozit predmet'}
              </button>
              <button
                className={styles.backToListButton}
                onClick={() => setView('list')}
              >
                Zpet na seznam
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
