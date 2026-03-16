import { useState } from 'react';
import { RadarChart } from './components/RadarChart';
import { Heatmap } from './components/Heatmap';
import { InteractivePitch } from './components/InteractivePitch';
import { PlayerCard } from './components/PlayerCard';
import { players } from './data/players';
import { useCompareStore } from './store/useCompareStore';

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
  const { compareList, clearCompare } = useCompareStore();

  const handleRemoveCard = (name: string) => {
    setVisibleCards((prev) => prev.filter((n) => n !== name));
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-white/6 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-text)] text-white tracking-tight">
            Спортивный Скаутинг
            <span className="text-accent-cyan ml-2">&mdash;</span>
            <span className="text-accent-cyan ml-2 font-normal text-xl">SVG Демо</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-[family-name:var(--font-data)]">
            Кастомные SVG-компоненты без сторонних библиотек
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12 flex flex-col gap-20">
        {/* Section 1: Radar Chart */}
        <section>
          <SectionTitle title="Радар-чарт" subtitle="Сравнение игроков — 8-осевой гексагональный радар" />
          <div className="bg-bg-card rounded-2xl border border-white/6 p-8">
            {/* Player selectors */}
            <div className="flex gap-4 mb-6 justify-center">
              <label className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent-cyan inline-block" />
                <select
                  value={p1Index}
                  onChange={(e) => setP1Index(Number(e.target.value))}
                  className="bg-bg-primary text-white text-sm rounded-lg px-3 py-1.5 border border-white/10 font-[family-name:var(--font-text)] cursor-pointer"
                >
                  {players.map((p, i) => (
                    <option key={p.name} value={i}>{p.name}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent-orange inline-block" />
                <select
                  value={p2Index}
                  onChange={(e) => setP2Index(Number(e.target.value))}
                  className="bg-bg-primary text-white text-sm rounded-lg px-3 py-1.5 border border-white/10 font-[family-name:var(--font-text)] cursor-pointer"
                >
                  {players.map((p, i) => (
                    <option key={p.name} value={i}>{p.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <RadarChart player1={players[p1Index]} player2={players[p2Index]} />
          </div>
        </section>

        {/* Section 2: Heatmap */}
        <section>
          <SectionTitle title="Тепловая карта" subtitle="Зоны активности на футбольном поле" />
          <div className="bg-bg-card rounded-2xl border border-white/6 p-8">
            <Heatmap />
          </div>
        </section>

        {/* Section 3: Interactive Pitch */}
        <section>
          <SectionTitle title="Интерактивное поле" subtitle="Ливерпуль 4-3-3 — перетаскивайте игроков, рисуйте стрелки" />
          <div className="bg-bg-card rounded-2xl border border-white/6 p-8">
            <InteractivePitch />
          </div>
        </section>

        {/* Section 4: Player Cards */}
        <section>
          <SectionTitle title="Карточки игроков" subtitle="Нажмите для переворота — CSS 3D-трансформация" />
          <div className="flex items-center gap-4 mb-6">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setManageMode(!manageMode)}
            >
              <div
                className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                  manageMode ? 'bg-accent-cyan' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    manageMode ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
              <span className="text-sm text-gray-400 font-[family-name:var(--font-text)]">Режим управления</span>
            </div>
            {visibleCards.length < players.length && (
              <button
                onClick={() => setVisibleCards(players.map((p) => p.name))}
                className="text-xs text-gray-500 hover:text-white transition-colors font-[family-name:var(--font-text)] cursor-pointer"
              >
                Сбросить
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
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
          </div>
        </section>

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-bg-card/95 backdrop-blur border-t border-white/10 px-8 py-4 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 font-[family-name:var(--font-text)]">Сравнение:</span>
                {compareList.map((p) => (
                  <span key={p.name} className="text-sm text-accent-cyan font-semibold font-[family-name:var(--font-text)]">
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
                    className="px-4 py-2 rounded-lg bg-accent-cyan text-gray-900 text-sm font-semibold font-[family-name:var(--font-text)] hover:bg-accent-cyan/80 transition-colors cursor-pointer"
                  >
                    Показать радар
                  </button>
                )}
                <button
                  onClick={clearCompare}
                  className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white border border-white/10 transition-colors font-[family-name:var(--font-text)] cursor-pointer"
                >
                  Очистить
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/6 px-8 py-8 mt-12">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-6">
          {['React', 'TypeScript', 'Vite', 'Tailwind', 'Zustand', 'SVG'].map((tech) => (
            <span
              key={tech}
              className="text-xs text-gray-600 font-[family-name:var(--font-data)] px-3 py-1 rounded-full border border-white/6"
            >
              {tech}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
