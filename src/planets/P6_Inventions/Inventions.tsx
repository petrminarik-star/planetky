import { useState } from 'react';
import PlanetHeader from '../../components/common/PlanetHeader';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Invention } from '../../types';
import styles from './Inventions.module.css';

const QUESTIONS = [
  'Mas napad na produkt, sluzbu nebo vynalez, ktery pomuze lidem?',
  'Co me nekdy trapi?',
  'Co lidem kolem me chybi?',
  'Kdybych mohl/a neco zjednodusit, co by to bylo?',
  'Kdo mi s tim muze pomoci?',
  'Komu tento produkt/sluzba/vynalez pomuze?',
  'Co by to delalo?',
  'Jak by se to pouzivalo?',
  'Co se diky tomu zmeni?',
  'Co se musim naucit, abych to mohl/a vymyslet?',
  'Co udelam jako prvni?',
  'Kolik penez potrebuji do zacatku?',
  'Jak se citim, kdyz o tom mluvim?',
  'Jak bych to vysvetlil/a kamaradovi?',
  'Sestav plan realizace - jak budes postupovat?',
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
        <PlanetHeader name="Vynalezy" icon="🔧" color="#f59e0b" />
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
      <PlanetHeader name="Vynalezy" icon="🔧" color="#f59e0b" />

      <div className={styles.content}>
        {!isCreating ? (
          /* Inventions list view */
          <div className={styles.listView}>
            <div className={styles.listHeader}>
              <h2 className={styles.listTitle}>Moje vynalezy</h2>
              <button className={styles.newBtn} onClick={startNewInvention}>
                + Novy vynalez
              </button>
            </div>

            {inventions.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>🔧</span>
                <p>Zatim nemas zadny vynalez.</p>
                <button className={styles.startBtn} onClick={startNewInvention}>
                  Vymysli svuj prvni vynalez!
                </button>
              </div>
            ) : (
              <div className={styles.inventionGrid}>
                {inventions.map(inv => (
                  <div key={inv.id} className={styles.inventionCard}>
                    <div className={styles.inventionCardIcon}>💡</div>
                    <h3 className={styles.inventionCardTitle}>
                      {inv.answers['0']?.substring(0, 60) || 'Beze jmena'}
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
              <h2 className={styles.summaryTitle}>Muj vynalez</h2>
              <p className={styles.summarySubtitle}>
                Vyborne! Tady je prehled tvych odpovedi.
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
                    {answers[i.toString()] || <em className={styles.noAnswer}>Bez odpovedi</em>}
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.summaryActions}>
              <button className={styles.backToEditBtn} onClick={() => setShowSummary(false)}>
                &#8592; Upravit odpovedi
              </button>
              <button className={styles.saveFinalBtn} onClick={handleSaveInvention}>
                Ulozit vynalez
              </button>
              <button className={styles.cancelBtn} onClick={resetWizard}>
                Zrusit
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
                placeholder="Napis svou odpoved..."
                rows={currentStep === QUESTIONS.length - 1 ? 8 : 5}
              />
              {currentStep === QUESTIONS.length - 1 && (
                <p className={styles.planHint}>
                  Tip: Kazdy krok napis na novy radek, aby se ti plan pekne zobrazil.
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
                &#8592; Predchozi
              </button>
              <button
                className={styles.nextBtn}
                onClick={goNext}
              >
                {currentStep === QUESTIONS.length - 1 ? 'Zobrazit shrnutí' : 'Dalsi &#8594;'}
              </button>
            </div>

            <button className={styles.cancelWizardBtn} onClick={resetWizard}>
              Zrusit
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
        <h2 className={styles.summaryTitle}>Muj vynalez</h2>
        <p className={styles.summarySubtitle}>
          Vytvoreno{' '}
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
              {invention.answers[i.toString()] || <em className={styles.noAnswer}>Bez odpovedi</em>}
            </p>
          </div>
        ))}
      </div>

      {invention.plan.length > 0 && (
        <div className={styles.planSection}>
          <h3 className={styles.planTitle}>Plan realizace</h3>
          <ol className={styles.planList}>
            {invention.plan.map((step, i) => (
              <li key={i} className={styles.planItem}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <button className={styles.backToListBtn} onClick={onBack}>
        &#8592; Zpet na seznam
      </button>
    </div>
  );
}
