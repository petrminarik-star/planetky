import { useState } from 'react';
import PlanetHeader from '../../components/common/PlanetHeader';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Dream, DreamTimeframe } from '../../types';
import styles from './DreamBoard.module.css';

const TABS: { key: DreamTimeframe | 'completed'; label: string; icon: string }[] = [
  { key: '6months', label: 'Do půl roku', icon: '\uD83C\uDF1F' },
  { key: '1year', label: 'Do roka', icon: '\u2B50' },
  { key: '1-3years', label: '1-3 roky', icon: '\uD83D\uDE80' },
  { key: 'beyond', label: 'Dále', icon: '\uD83C\uDF0C' },
  { key: 'completed', label: 'Splněné', icon: '\u2705' },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function DreamBoard() {
  const [dreams, setDreams] = useLocalStorage<Dream[]>('dreamboard_dreams', []);
  const [activeTab, setActiveTab] = useState<DreamTimeframe | 'completed'>('6months');
  const [showForm, setShowForm] = useState(false);
  const [editingDream, setEditingDream] = useState<Dream | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formTimeframe, setFormTimeframe] = useState<DreamTimeframe>('6months');

  const filteredDreams = dreams.filter((d) => {
    if (activeTab === 'completed') return d.completed;
    return !d.completed && d.timeframe === activeTab;
  });

  const openAddForm = () => {
    setEditingDream(null);
    setFormTitle('');
    setFormDescription('');
    setFormImageUrl('');
    setFormTimeframe(activeTab === 'completed' ? '6months' : activeTab);
    setShowForm(true);
  };

  const openEditForm = (dream: Dream) => {
    setEditingDream(dream);
    setFormTitle(dream.title);
    setFormDescription(dream.description);
    setFormImageUrl(dream.imageUrl || '');
    setFormTimeframe(dream.timeframe);
    setShowForm(true);
  };

  const saveDream = () => {
    if (!formTitle.trim()) return;

    if (editingDream) {
      setDreams((prev) =>
        prev.map((d) =>
          d.id === editingDream.id
            ? {
                ...d,
                title: formTitle.trim(),
                description: formDescription.trim(),
                imageUrl: formImageUrl.trim() || undefined,
                timeframe: formTimeframe,
              }
            : d
        )
      );
    } else {
      const newDream: Dream = {
        id: generateId(),
        title: formTitle.trim(),
        description: formDescription.trim(),
        imageUrl: formImageUrl.trim() || undefined,
        timeframe: formTimeframe,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setDreams((prev) => [newDream, ...prev]);
    }

    setShowForm(false);
  };

  const completeDream = (id: string) => {
    setDreams((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: true } : d))
    );
  };

  const uncompleteDream = (id: string) => {
    setDreams((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: false } : d))
    );
  };

  const deleteDream = (id: string) => {
    setDreams((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className={styles.container}>
      <PlanetHeader name="Nástěnka snů" icon="\u2728" color="#FF69B4" />

      <div className={styles.content}>
        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Add Button */}
        {activeTab !== 'completed' && (
          <button className={styles.addButton} onClick={openAddForm}>
            <span className={styles.addIcon}>+</span>
            Přidat sen
          </button>
        )}

        {/* Dream Grid */}
        <div className={styles.dreamGrid}>
          {filteredDreams.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>
                {activeTab === 'completed' ? '\uD83C\uDF1F' : '\uD83D\uDCAD'}
              </span>
              <p className={styles.emptyText}>
                {activeTab === 'completed'
                  ? 'Zatím žádný splněný sen. Nevadí, všechny sny se plní postupně!'
                  : 'Zatím tu žádné sny nejsou. Přidej svůj první sen!'}
              </p>
            </div>
          ) : (
            filteredDreams.map((dream, index) => (
              <div
                key={dream.id}
                className={styles.dreamCard}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {dream.imageUrl && (
                  <div
                    className={styles.dreamImage}
                    style={{ backgroundImage: `url(${dream.imageUrl})` }}
                  />
                )}
                <div className={styles.dreamContent}>
                  <h3 className={styles.dreamTitle}>{dream.title}</h3>
                  {dream.description && (
                    <p className={styles.dreamDescription}>{dream.description}</p>
                  )}
                </div>
                <div className={styles.dreamActions}>
                  {!dream.completed ? (
                    <button
                      className={styles.completeButton}
                      onClick={() => completeDream(dream.id)}
                    >
                      Splnit sen!
                    </button>
                  ) : (
                    <button
                      className={styles.uncompleteButton}
                      onClick={() => uncompleteDream(dream.id)}
                    >
                      Vrátit zpět
                    </button>
                  )}
                  <button
                    className={styles.editButton}
                    onClick={() => openEditForm(dream)}
                    aria-label="Upravit"
                  >
                    &#x270F;&#xFE0F;
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteDream(dream.id)}
                    aria-label="Smazat"
                  >
                    &#x1F5D1;&#xFE0F;
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editingDream ? 'Upravit sen' : 'Přidat nový sen'}
            </h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>Název snu</label>
              <input
                className={styles.input}
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="O čem sníš?"
                maxLength={100}
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Popis</label>
              <textarea
                className={styles.textarea}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Pověz mi o svém snu víc..."
                rows={3}
                maxLength={500}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Obrázek (URL) - volitelné</label>
              <input
                className={styles.input}
                type="url"
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Časový rámec</label>
              <div className={styles.timeframeOptions}>
                {TABS.filter((t) => t.key !== 'completed').map((tab) => (
                  <button
                    key={tab.key}
                    className={`${styles.timeframeButton} ${
                      formTimeframe === tab.key ? styles.timeframeActive : ''
                    }`}
                    onClick={() => setFormTimeframe(tab.key as DreamTimeframe)}
                    type="button"
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={saveDream}>
                {editingDream ? 'Uložit změny' : 'Přidat sen'}
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowForm(false)}
              >
                Zrušit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
