import { useState } from 'react';
import { ArrowLeft, Headphones, Play } from 'lucide-react';
import ListeningPlayer from '@/components/listening/ListeningPlayer';
import GameEndActions from '@/components/games/GameEndActions';
import ListeningSettingsPanel from '@/components/listening/ListeningSettingsPanel';
import {
  DEFAULT_LISTENING_SETTINGS,
  selectListeningWordsFromConfig,
  type ListeningOrder,
  type ListeningSettings,
} from '@/lib/listening';
import { useStoredState } from '@/hooks/useStoredState';
import type { GameSetupConfig } from '@/lib/games/gameConfig';
import type { Word } from '@/lib/vocabulary';

interface ListeningGameProps {
  lockedOrder: 'fi_tr' | 'tr_fi';
  words: Word[];
  config: GameSetupConfig;
  title: string;
  onExit: () => void;
  onRestart: () => void;
  onNext?: () => void;
}

export default function ListeningGame({ lockedOrder, words, config, title, onExit, onRestart, onNext }: ListeningGameProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [globalSettings, setGlobalSettings] = useStoredState<ListeningSettings>(
    'sanasto.listeningSettings',
    DEFAULT_LISTENING_SETTINGS,
  );

  const queue = selectListeningWordsFromConfig(words, config);

  const availableOrders: ListeningOrder[] =
    lockedOrder === 'fi_tr' ? ['fi_tr', 'fi_only'] : ['tr_fi', 'tr_only'];

  const lockedSettings: ListeningSettings = {
    ...globalSettings,
    order: availableOrders.includes(globalSettings.order) ? globalSettings.order : lockedOrder,
  };

  if (isFinished) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-center text-2xl font-bold text-slate-900">{title}</h1>
        <GameEndActions
          onRestart={onRestart}
          onNext={onNext}
          onExit={onExit}
        />
      </div>
    );
  }

  if (hasStarted && queue.length > 0) {
    return (
      <div className="space-y-4">
        <ListeningPlayer
          queue={queue}
          settings={lockedSettings}
          onBack={() => setHasStarted(false)}
          onFinish={() => setIsFinished(true)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-700 transition hover:bg-slate-50"
          aria-label="Geri"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-center text-2xl font-bold text-slate-900">{title}</h1>
      </div>

      <ListeningSettingsPanel
        settings={globalSettings}
        onChange={setGlobalSettings}
        defaultOpen
        hideOrderSelector
        availableOrders={availableOrders}
      />

      <button
        type="button"
        onClick={() => setHasStarted(true)}
        disabled={queue.length === 0}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-700 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        {queue.length > 0 ? <Play className="h-6 w-6" /> : <Headphones className="h-6 w-6" />}
        {queue.length > 0 ? `Dinlemeye başla (${queue.length} kelime)` : 'Dinlenecek kelime yok'}
      </button>
    </div>
  );
}
