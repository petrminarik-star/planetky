import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PlanetHeader from '../../components/common/PlanetHeader';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { DiaryEntry } from '../../types';
import styles from './FutureSelf.module.css';

interface Avatar {
  skinTone: string;
  hairStyle: 'short' | 'long' | 'curly' | 'bald';
  hairColor: string;
  outfit: 'casual' | 'formal' | 'sporty' | 'creative';
  name: string;
  profession: string;
  skills: string;
  wisdom: string;
}

const SKIN_TONES = ['#FFDBB4', '#EDB98A', '#D08B5B', '#AE5D29', '#614335'];
const HAIR_COLORS = ['#2C1B18', '#6A4E42', '#B55239', '#E6BE8A', '#C0C0C0', '#4A90D9'];

const HAIR_LABELS: Record<Avatar['hairStyle'], string> = {
  short: 'Krátké',
  long: 'Dlouhé',
  curly: 'Kudrnaté',
  bald: 'Bez vlasů',
};

const OUTFIT_LABELS: Record<Avatar['outfit'], string> = {
  casual: 'Pohodlný',
  formal: 'Elegantní',
  sporty: 'Sportovní',
  creative: 'Kreativní',
};

const OUTFIT_EMOJIS: Record<Avatar['outfit'], string> = {
  casual: '👕',
  formal: '👔',
  sporty: '🏃',
  creative: '🎨',
};

const DEFAULT_AVATAR: Avatar = {
  skinTone: SKIN_TONES[0],
  hairStyle: 'short',
  hairColor: HAIR_COLORS[0],
  outfit: 'casual',
  name: '',
  profession: '',
  skills: '',
  wisdom: '',
};

function AvatarPreview({ avatar }: { avatar: Avatar }) {
  const hairPaths: Record<Avatar['hairStyle'], React.ReactNode> = {
    short: (
      <ellipse cx="80" cy="42" rx="32" ry="18" fill={avatar.hairColor} />
    ),
    long: (
      <>
        <ellipse cx="80" cy="42" rx="34" ry="20" fill={avatar.hairColor} />
        <rect x="46" y="48" width="14" height="40" rx="7" fill={avatar.hairColor} />
        <rect x="100" y="48" width="14" height="40" rx="7" fill={avatar.hairColor} />
      </>
    ),
    curly: (
      <>
        <ellipse cx="80" cy="42" rx="36" ry="22" fill={avatar.hairColor} />
        <circle cx="50" cy="52" r="8" fill={avatar.hairColor} />
        <circle cx="110" cy="52" r="8" fill={avatar.hairColor} />
        <circle cx="54" y="36" r="6" fill={avatar.hairColor} />
        <circle cx="106" cy="36" r="6" fill={avatar.hairColor} />
      </>
    ),
    bald: null,
  };

  return (
    <div className={styles.avatarPreview}>
      <svg viewBox="0 0 160 200" className={styles.avatarSvg}>
        {/* Body */}
        <rect x="50" y="110" width="60" height="70" rx="12"
          fill={avatar.outfit === 'formal' ? '#2c3e50' :
                avatar.outfit === 'sporty' ? '#e74c3c' :
                avatar.outfit === 'creative' ? '#9b59b6' : '#3498db'} />
        {/* Arms */}
        <rect x="30" y="115" width="22" height="14" rx="7"
          fill={avatar.outfit === 'formal' ? '#2c3e50' :
                avatar.outfit === 'sporty' ? '#e74c3c' :
                avatar.outfit === 'creative' ? '#9b59b6' : '#3498db'} />
        <rect x="108" y="115" width="22" height="14" rx="7"
          fill={avatar.outfit === 'formal' ? '#2c3e50' :
                avatar.outfit === 'sporty' ? '#e74c3c' :
                avatar.outfit === 'creative' ? '#9b59b6' : '#3498db'} />
        {/* Hands */}
        <circle cx="28" cy="122" r="7" fill={avatar.skinTone} />
        <circle cx="132" cy="122" r="7" fill={avatar.skinTone} />
        {/* Head */}
        <circle cx="80" cy="60" r="35" fill={avatar.skinTone} />
        {/* Hair */}
        {hairPaths[avatar.hairStyle]}
        {/* Eyes */}
        <circle cx="68" cy="62" r="4" fill="#333" />
        <circle cx="92" cy="62" r="4" fill="#333" />
        <circle cx="69" cy="61" r="1.5" fill="#fff" />
        <circle cx="93" cy="61" r="1.5" fill="#fff" />
        {/* Smile */}
        <path d="M 68 76 Q 80 86 92 76" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Outfit icon */}
        <text x="80" y="152" textAnchor="middle" fontSize="22">
          {OUTFIT_EMOJIS[avatar.outfit]}
        </text>
        {/* Stars around */}
        <text x="10" y="20" fontSize="14" className={styles.twinkle1}>&#10022;</text>
        <text x="145" y="25" fontSize="12" className={styles.twinkle2}>&#10022;</text>
        <text x="5" y="180" fontSize="10" className={styles.twinkle3}>&#10022;</text>
        <text x="150" y="175" fontSize="11" className={styles.twinkle1}>&#10022;</text>
      </svg>
      {avatar.name && (
        <div className={styles.avatarName}>{avatar.name}</div>
      )}
      {avatar.profession && (
        <div className={styles.avatarProfession}>{avatar.profession}</div>
      )}
    </div>
  );
}

export default function FutureSelf() {
  const { profile } = useApp();
  const [avatar, setAvatar] = useLocalStorage<Avatar>('futureSelf_avatar', DEFAULT_AVATAR);
  const [diaryEntries, setDiaryEntries] = useLocalStorage<DiaryEntry[]>('futureSelf_diary', []);
  const [activeTab, setActiveTab] = useState<'avatar' | 'diary'>('avatar');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [avatarSaved, setAvatarSaved] = useState(false);

  const handleSaveAvatar = () => {
    setAvatarSaved(true);
    setTimeout(() => setAvatarSaved(false), 2000);
  };

  const handleAskQuestion = () => {
    if (question.trim()) {
      setIsAnswering(true);
    }
  };

  const handleSaveDiaryEntry = () => {
    if (question.trim() && answer.trim()) {
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        question: question.trim(),
        answer: answer.trim(),
        createdAt: new Date().toISOString(),
      };
      setDiaryEntries(prev => [newEntry, ...prev]);
      setQuestion('');
      setAnswer('');
      setIsAnswering(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    setDiaryEntries(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className={styles.container}>
      <PlanetHeader name="Moje Budoucí Já" icon="🔮" color="#a855f7" />

      <div className={styles.content}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'avatar' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('avatar')}
          >
            <span className={styles.tabIcon}>🧑‍🚀</span>
            Budoucí Já
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'diary' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('diary')}
          >
            <span className={styles.tabIcon}>📖</span>
            Vesmírný deník
          </button>
        </div>

        {activeTab === 'avatar' && (
          <section className={styles.avatarSection}>
            <h2 className={styles.sectionTitle}>
              Vytvoř sve budouci ja (30 let)
            </h2>
            <p className={styles.sectionSubtitle}>
              Jak si představuješ sebe za mnoho let? Pojďme to společně vytvořit!
            </p>

            <div className={styles.avatarBuilder}>
              <AvatarPreview avatar={avatar} />

              <div className={styles.controls}>
                {/* Skin tone */}
                <div className={styles.controlGroup}>
                  <label className={styles.label}>Barva pleti</label>
                  <div className={styles.colorRow}>
                    {SKIN_TONES.map(tone => (
                      <button
                        key={tone}
                        className={`${styles.colorSwatch} ${avatar.skinTone === tone ? styles.colorSwatchActive : ''}`}
                        style={{ backgroundColor: tone }}
                        onClick={() => setAvatar(prev => ({ ...prev, skinTone: tone }))}
                        aria-label={`Barva pleti ${tone}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Hair style */}
                <div className={styles.controlGroup}>
                  <label className={styles.label}>Styl vlasu</label>
                  <div className={styles.optionRow}>
                    {(['short', 'long', 'curly', 'bald'] as const).map(style => (
                      <button
                        key={style}
                        className={`${styles.optionBtn} ${avatar.hairStyle === style ? styles.optionBtnActive : ''}`}
                        onClick={() => setAvatar(prev => ({ ...prev, hairStyle: style }))}
                      >
                        {HAIR_LABELS[style]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair color */}
                {avatar.hairStyle !== 'bald' && (
                  <div className={styles.controlGroup}>
                    <label className={styles.label}>Barva vlasu</label>
                    <div className={styles.colorRow}>
                      {HAIR_COLORS.map(color => (
                        <button
                          key={color}
                          className={`${styles.colorSwatch} ${avatar.hairColor === color ? styles.colorSwatchActive : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setAvatar(prev => ({ ...prev, hairColor: color }))}
                          aria-label={`Barva vlasů ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Outfit */}
                <div className={styles.controlGroup}>
                  <label className={styles.label}>Styl obleceni</label>
                  <div className={styles.optionRow}>
                    {(['casual', 'formal', 'sporty', 'creative'] as const).map(outfit => (
                      <button
                        key={outfit}
                        className={`${styles.optionBtn} ${avatar.outfit === outfit ? styles.optionBtnActive : ''}`}
                        onClick={() => setAvatar(prev => ({ ...prev, outfit }))}
                      >
                        {OUTFIT_EMOJIS[outfit]} {OUTFIT_LABELS[outfit]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text inputs */}
                <div className={styles.controlGroup}>
                  <label className={styles.label}>Jmeno</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={avatar.name}
                    onChange={e => setAvatar(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Jak se budeš jmenovat?"
                  />
                </div>

                <div className={styles.controlGroup}>
                  <label className={styles.label}>Povolani</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={avatar.profession}
                    onChange={e => setAvatar(prev => ({ ...prev, profession: e.target.value }))}
                    placeholder="Cim chces byt?"
                  />
                </div>

                <div className={styles.controlGroup}>
                  <label className={styles.label}>Co vsechno umis</label>
                  <textarea
                    className={styles.textArea}
                    value={avatar.skills}
                    onChange={e => setAvatar(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="Vypis sve superschopnosti..."
                    rows={3}
                  />
                </div>

                <div className={styles.controlGroup}>
                  <label className={styles.label}>Jakou mas moudrost</label>
                  <textarea
                    className={styles.textArea}
                    value={avatar.wisdom}
                    onChange={e => setAvatar(prev => ({ ...prev, wisdom: e.target.value }))}
                    placeholder="Co bys poradil/a svemu mladsímu ja?"
                    rows={3}
                  />
                </div>

                <button className={styles.saveBtn} onClick={handleSaveAvatar}>
                  {avatarSaved ? '&#10003; Ulozeno!' : 'Ulozit avatar'}
                </button>
              </div>
            </div>

            {/* Saved avatar info card */}
            {avatar.name && avatar.profession && (
              <div className={styles.avatarCard}>
                <div className={styles.avatarCardHeader}>
                  <AvatarPreview avatar={avatar} />
                </div>
                <div className={styles.avatarCardBody}>
                  <h3>{avatar.name}, {avatar.profession}</h3>
                  {avatar.skills && (
                    <div className={styles.avatarCardField}>
                      <span className={styles.avatarCardLabel}>Schopnosti:</span>
                      <p>{avatar.skills}</p>
                    </div>
                  )}
                  {avatar.wisdom && (
                    <div className={styles.avatarCardField}>
                      <span className={styles.avatarCardLabel}>Moudrost:</span>
                      <p>{avatar.wisdom}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === 'diary' && (
          <section className={styles.diarySection}>
            <h2 className={styles.sectionTitle}>Vesmirny denik</h2>
            <p className={styles.sectionSubtitle}>
              Poloz otazku svemu budoucimu ja. Pak se vcit do role sveho 30leteho ja a odpovez s moudrostí.
            </p>

            <div className={styles.diaryComposer}>
              {!isAnswering ? (
                <div className={styles.questionPhase}>
                  <div className={styles.composerLabel}>
                    <span className={styles.composerIcon}>&#128103;</span>
                    Tvoje otazka:
                  </div>
                  <textarea
                    className={styles.diaryTextArea}
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Co bych mel udelat, abych..."
                    rows={4}
                  />
                  <button
                    className={styles.askBtn}
                    onClick={handleAskQuestion}
                    disabled={!question.trim()}
                  >
                    Zeptat se budouciho ja &#8594;
                  </button>
                </div>
              ) : (
                <div className={styles.answerPhase}>
                  <div className={styles.chatBubble}>
                    <div className={styles.bubbleChild}>
                      <span className={styles.bubbleSender}>
                        {profile?.name || 'Ty'}:
                      </span>
                      <p>{question}</p>
                    </div>
                  </div>

                  <div className={styles.composerLabel}>
                    <span className={styles.composerIcon}>&#129489;&#8205;&#128640;</span>
                    Odpoved budouciho ja ({avatar.name || 'Budouci Ty'}):
                  </div>
                  <textarea
                    className={styles.diaryTextArea}
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Milý/á, chci ti říct..."
                    rows={4}
                  />
                  <div className={styles.answerActions}>
                    <button
                      className={styles.backBtn}
                      onClick={() => { setIsAnswering(false); setAnswer(''); }}
                    >
                      &#8592; Zpet
                    </button>
                    <button
                      className={styles.saveEntryBtn}
                      onClick={handleSaveDiaryEntry}
                      disabled={!answer.trim()}
                    >
                      Ulozit do deniku
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Diary entries */}
            {diaryEntries.length > 0 && (
              <div className={styles.diaryEntries}>
                <h3 className={styles.entriesTitle}>Zapisy v deniku</h3>
                {diaryEntries.map(entry => (
                  <div key={entry.id} className={styles.entryCard}>
                    <div className={styles.entryDate}>
                      {new Date(entry.createdAt).toLocaleDateString('cs-CZ', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <div className={styles.chatBubbles}>
                      <div className={styles.bubbleChild}>
                        <span className={styles.bubbleSender}>
                          {profile?.name || 'Ty'}:
                        </span>
                        <p>{entry.question}</p>
                      </div>
                      <div className={styles.bubbleFuture}>
                        <span className={styles.bubbleSender}>
                          {avatar.name || 'Budouci Ty'}:
                        </span>
                        <p>{entry.answer}</p>
                      </div>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteEntry(entry.id)}
                      aria-label="Smazat zápis"
                    >
                      &#10005;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
