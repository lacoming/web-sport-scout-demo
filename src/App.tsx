import { useState, lazy, Suspense, useEffect, useRef, useCallback } from 'react';
import { players } from './data/players';
import { useCompareStore } from './store/useCompareStore';
import { useShallow } from 'zustand/react/shallow';

const RadarChart = lazy(() => import('./components/RadarChart').then(m => ({ default: m.RadarChart })));
const Heatmap = lazy(() => import('./components/Heatmap').then(m => ({ default: m.Heatmap })));
const InteractivePitch = lazy(() => import('./components/InteractivePitch').then(m => ({ default: m.InteractivePitch })));
const PlayerCard = lazy(() => import('./components/PlayerCard').then(m => ({ default: m.PlayerCard })));

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
    </div>
  );
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-text)] text-white tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1 font-[family-name:var(--font-text)]">{subtitle}</p>
      )}
    </div>
  );
}

export default function App() {
  const [p1Index, setP1Index] = useState(0);
  const [p2Index, setP2Index] = useState(1);
  const [manageMode, setManageMode] = useState(false);
  const [visibleCards, setVisibleCards] = useState(() => players.map((p) => p.name));
  const { compareList, clearCompare } = useCompareStore(
    useShallow((s) => ({ compareList: s.compareList, clearCompare: s.clearCompare }))
  );

  const handleRemoveCard = useCallback((name: string) => {
    setVisibleCards((prev) => prev.filter((n) => n !== name));
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-x-hidden">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[400px] -left-[300px] w-[800px] h-[800px] rounded-full bg-accent-cyan/[0.03] blur-[120px]" />
        <div className="absolute top-[40%] -right-[200px] w-[600px] h-[600px] rounded-full bg-accent-orange/[0.03] blur-[120px]" />
        <div className="absolute -bottom-[300px] left-[30%] w-[700px] h-[700px] rounded-full bg-accent-cyan/[0.02] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/[0.06] backdrop-blur-sm bg-bg-primary/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-text)] text-white tracking-tight">
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Спортивный Скаутинг</span>
                <span className="text-accent-cyan ml-2 text-lg font-normal opacity-60">/</span>
                <span className="text-accent-cyan ml-2 font-normal text-base opacity-80">SVG Демо</span>
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 font-[family-name:var(--font-data)]">
                Кастомные SVG-компоненты без сторонних библиотек
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-500 font-[family-name:var(--font-data)]">LIVE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-8 py-12 flex flex-col gap-24">
        {/* Section 1: Radar Chart */}
        <AnimatedSection>
          <section>
            <SectionTitle title="Радар-чарт" subtitle="Сравнение игроков — 8-осевой гексагональный радар" />
            <div className="glass-card rounded-2xl p-8">
              {/* Player selectors */}
              <div className="flex gap-4 mb-6 justify-center">
                <label className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-accent-cyan inline-block shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                  <select
                    value={p1Index}
                    onChange={(e) => setP1Index(Number(e.target.value))}
                    className="bg-white/[0.05] text-white text-sm rounded-lg px-3 py-1.5 border border-white/10 font-[family-name:var(--font-text)] cursor-pointer hover:border-accent-cyan/30 transition-colors focus:outline-none focus:border-accent-cyan/50"
                  >
                    {players.map((p, i) => (
                      <option key={p.name} value={i} className="bg-bg-primary">{p.name}</option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-accent-orange inline-block shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                  <select
                    value={p2Index}
                    onChange={(e) => setP2Index(Number(e.target.value))}
                    className="bg-white/[0.05] text-white text-sm rounded-lg px-3 py-1.5 border border-white/10 font-[family-name:var(--font-text)] cursor-pointer hover:border-accent-orange/30 transition-colors focus:outline-none focus:border-accent-orange/50"
                  >
                    {players.map((p, i) => (
                      <option key={p.name} value={i} className="bg-bg-primary">{p.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <Suspense fallback={<SectionLoader />}>
                <RadarChart player1={players[p1Index]} player2={players[p2Index]} />
              </Suspense>
            </div>
          </section>
        </AnimatedSection>

        {/* Section 2: Heatmap */}
        <AnimatedSection>
          <section>
            <SectionTitle title="Тепловая карта" subtitle="Зоны активности на футбольном поле" />
            <div className="glass-card rounded-2xl p-8">
              <Suspense fallback={<SectionLoader />}>
                <Heatmap />
              </Suspense>
            </div>
          </section>
        </AnimatedSection>

        {/* Section 3: Interactive Pitch */}
        <AnimatedSection>
          <section>
            <SectionTitle title="Интерактивное поле" subtitle="Ливерпуль 4-3-3 — перетаскивайте игроков, рисуйте стрелки" />
            <div className="glass-card rounded-2xl p-8">
              <Suspense fallback={<SectionLoader />}>
                <InteractivePitch />
              </Suspense>
            </div>
          </section>
        </AnimatedSection>

        {/* Section 4: Player Cards */}
        <AnimatedSection>
          <section>
            <SectionTitle title="Карточки игроков" subtitle="Нажмите для переворота — CSS 3D-трансформация" />
            <div className="flex items-center gap-4 mb-6">
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setManageMode(!manageMode)}
              >
                <div
                  className={`w-10 h-5 rounded-full relative transition-all duration-300 ${
                    manageMode ? 'bg-accent-cyan shadow-[0_0_12px_rgba(34,211,238,0.3)]' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                      manageMode ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors font-[family-name:var(--font-text)]">Режим управления</span>
              </div>
              {visibleCards.length < players.length && (
                <button
                  onClick={() => setVisibleCards(players.map((p) => p.name))}
                  className="text-xs text-gray-500 hover:text-accent-cyan transition-colors font-[family-name:var(--font-text)] cursor-pointer"
                >
                  Сбросить
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              <Suspense fallback={<SectionLoader />}>
                {players
                  .filter((p) => visibleCards.includes(p.name))
                  .map((player) => (
                    <PlayerCard
                      key={player.name}
                      player={player}
                      manageMode={manageMode}
                      onRemove={handleRemoveCard}
                    />
                  ))}
              </Suspense>
            </div>
          </section>
        </AnimatedSection>

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-bg-card/80 backdrop-blur-xl border-t border-white/10 px-8 py-4 z-50 shadow-[0_-4px_30px_rgba(0,0,0,0.3)]">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 font-[family-name:var(--font-text)]">Сравнение:</span>
                {compareList.map((p) => (
                  <span key={p.name} className="text-sm text-accent-cyan font-semibold font-[family-name:var(--font-text)] text-shadow-glow">
                    {p.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                {compareList.length === 2 && (
                  <button
                    onClick={() => {
                      const i1 = players.findIndex((p) => p.name === compareList[0].name);
                      const i2 = players.findIndex((p) => p.name === compareList[1].name);
                      if (i1 >= 0 && i2 >= 0) {
                        setP1Index(i1);
                        setP2Index(i2);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="btn-primary"
                  >
                    Показать радар
                  </button>
                )}
                <button
                  onClick={clearCompare}
                  className="btn-ghost"
                >
                  Очистить
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06] px-8 py-8 mt-12">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
          {['React', 'TypeScript', 'Vite', 'Tailwind', 'Zustand', 'SVG'].map((tech) => (
            <span
              key={tech}
              className="text-xs text-gray-500 font-[family-name:var(--font-data)] px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] hover:border-accent-cyan/20 hover:text-gray-400 transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
