import { useState } from 'react';
import PlanetHeader from '../../components/common/PlanetHeader';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Invention } from '../../types';
import styles from './Inventions.module.css';

const QUESTIONS = [
  'Máš nápad na produkt, službu nebo vynález, který pomůže lidem?',
  'Co mě někdy trápí?',
  'Co lidem kolem mě chybí?',
  'Kdybych mohl/a něco zjednodušit, co by to bylo?',
  'Kdo mi s tím může pomoci?',
  'Komu tento produkt/služba/vynález pomůže?',
  'Co by to dělalo?',
  'Jak by se to používalo?',
  'Co se díky tomu změní?',
  'Co se musím naučit, abych to mohl/a vymyslet?',
  'Co udělám jako první?',
  'Kolik peněz potřebuji do začátku?',
  'Jak se cítím, když o tom mluvím?',
  'Jak bych to vysvětlil/a kamarádovi?',
  'Sestav plán realizace - jak budeš postupovat?',
];

const QUESTION_ICONS = [
  '💡', '😟', '🔍', '✨', '🤝',
  '👥', '⚙️', '📱', '🌍', '📚',
  '🚀', '💰', '💪', '🗣️', '📋',
];

export default function Inventions() {
  const [inventions, setInventions] = useLocalStorage<Invention[]>('inventions', []);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [viewingInvention, setViewingInvention] = useState<Invention | null>(null);
  const [isCreating, setIsCreating] = useState(inventions.length === 0);

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentStep.toString()]: value }));
  };

  const goNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveInvention = () => {
    const planText = answers['14'] || '';
    const plan = planText.split('\n').filter(line => line.trim() !== '');

    const newInvention: Invention = {
      id: Date.now().toString(),
      answers,
      plan,
      createdAt: new Date().toISOString(),
    };

    setInventions(prev => [newInvention, ...prev]);
    resetWizard();
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowSummary(false);
    setIsCreating(false);
  };

  const handleDeleteInvention = (id: string) => {
    setInventions(prev => prev.filter(inv => inv.id !== id));
  };

  const startNewInvention = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowSummary(false);
    setIsCreating(true);
    setViewingInvention(null);
  };

  // Viewing a saved invention
  if (viewingInvention) {
    return (
      <div className={styles.container}>
        <PlanetHeader name="Vynálezy" icon="🔧" color="#f59e0b" />
        <div className={styles.content}>
          <InventionSummaryCard
            invention={viewingInvention}
            onBack={() => setViewingInvention(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PlanetHeader name="Vynálezy" icon="🔧" color="#f59e0b" />

      <div className={styles.content}>
        {!isCreating ? (
          /* Inventions list view */
          <div className={styles.listView}>
            <div className={styles.listHeader}>
              <h2 className={styles.listTitle}>Moje vynálezy</h2>
              <button className={styles.newBtn} onClick={startNewInvention}>
                + Nový vynález
              </button>
            </div>

            {inventions.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>🔧</span>
                <p>Zatím nemáš žádný vynález.</p>
                <button className={styles.startBtn} onClick={startNewInvention}>
                  Vymysli svůj první vynález!
                </button>
              </div>
            ) : (
              <div className={styles.inventionGrid}>
                {inventions.map(inv => (
                  <div key={inv.id} className={styles.inventionCard}>
                    <div className={styles.inventionCardIcon}>💡</div>
                    <h3 className={styles.inventionCardTitle}>
                      {inv.answers['0']?.substring(0, 60) || 'Beze jména'}
                      {(inv.answers['0']?.length || 0) > 60 ? '...' : ''}
                    </h3>
                    <p className={styles.inventionCardDate}>
                      {new Date(inv.createdAt).toLocaleDateString('cs-CZ', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <div className={styles.inventionCardActions}>
                      <button
                        className={styles.viewBtn}
                        onClick={() => setViewingInvention(inv)}
                      >
                        Zobrazit
                      </button>
                      <button
                        className={styles.deleteSmBtn}
                        onClick={() => handleDeleteInvention(inv.id)}
                      >
                        &#10005;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : showSummary ? (
          /* Summary view */
          <div className={styles.summaryView}>
            <div className={styles.summaryHeader}>
              <span className={styles.summaryIcon}>🏆</span>
              <h2 className={styles.summaryTitle}>Můj vynález</h2>
              <p className={styles.summarySubtitle}>
                Výborně! Tady je přehled tvých odpovědí.
              </p>
            </div>

            <div className={styles.summaryCards}>
              {QUESTIONS.map((q, i) => (
                <div key={i} className={styles.summaryCard}>
                  <div className={styles.summaryCardQ}>
                    <span className={styles.summaryCardIcon}>{QUESTION_ICONS[i]}</span>
                    {q}
                  </div>
                  <p className={styles.summaryCardA}>
                    {answers[i.toString()] || <em className={styles.noAnswer}>Bez odpovědi</em>}
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.summaryActions}>
              <button className={styles.backToEditBtn} onClick={() => setShowSummary(false)}>
                &#8592; Upravit odpovědi
              </button>
              <button className={styles.saveFinalBtn} onClick={handleSaveInvention}>
                Uložit vynález
              </button>
              <button className={styles.cancelBtn} onClick={resetWizard}>
                Zrušit
              </button>
            </div>
          </div>
        ) : (
          /* Wizard view */
          <div className={styles.wizard}>
            {/* Progress bar */}
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={styles.progressText}>
                {currentStep + 1} / {QUESTIONS.length}
              </span>
            </div>

            {/* Question card */}
            <div className={styles.questionCard} key={currentStep}>
              <span className={styles.questionIcon}>{QUESTION_ICONS[currentStep]}</span>
              <h2 className={styles.questionText}>{QUESTIONS[currentStep]}</h2>
              <textarea
                className={styles.answerArea}
                value={answers[currentStep.toString()] || ''}
                onChange={e => handleAnswer(e.target.value)}
                placeholder="Napiš svou odpověď..."
                rows={currentStep === QUESTIONS.length - 1 ? 8 : 5}
              />
              {currentStep === QUESTIONS.length - 1 && (
                <p className={styles.planHint}>
                  Tip: Každý krok napiš na nový řádek, aby se ti plán pěkně zobrazil.
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className={styles.wizardNav}>
              <button
                className={styles.prevBtn}
                onClick={goPrev}
                disabled={currentStep === 0}
              >
                &#8592; Předchozí
              </button>
              <button
                className={styles.nextBtn}
                onClick={goNext}
              >
                {currentStep === QUESTIONS.length - 1 ? 'Zobrazit shrnutí' : 'Další \u2192'}
              </button>
            </div>

            <button className={styles.cancelWizardBtn} onClick={resetWizard}>
              Zrušit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InventionSummaryCard({
  invention,
  onBack,
}: {
  invention: Invention;
  onBack: () => void;
}) {
  return (
    <div className={styles.summaryView}>
      <div className={styles.summaryHeader}>
        <span className={styles.summaryIcon}>💡</span>
        <h2 className={styles.summaryTitle}>Můj vynález</h2>
        <p className={styles.summarySubtitle}>
          Vytvořeno{' '}
          {new Date(invention.createdAt).toLocaleDateString('cs-CZ', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className={styles.summaryCards}>
        {QUESTIONS.map((q, i) => (
          <div key={i} className={styles.summaryCard}>
            <div className={styles.summaryCardQ}>
              <span className={styles.summaryCardIcon}>{QUESTION_ICONS[i]}</span>
              {q}
            </div>
            <p className={styles.summaryCardA}>
              {invention.answers[i.toString()] || <em className={styles.noAnswer}>Bez odpovědi</em>}
            </p>
          </div>
        ))}
      </div>

      {invention.plan.length > 0 && (
        <div className={styles.planSection}>
          <h3 className={styles.planTitle}>Plán realizace</h3>
          <ol className={styles.planList}>
            {invention.plan.map((step, i) => (
              <li key={i} className={styles.planItem}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <button className={styles.backToListBtn} onClick={onBack}>
        &#8592; Zpět na seznam
      </button>
    </div>
  );
}
