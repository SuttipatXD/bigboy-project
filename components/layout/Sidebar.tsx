'use client';

import {useAppStore} from '@/store/appStore';
import {CollectionsPanel} from '@/components/sidebar/CollectionsPanel';
import {HistoryPanel} from '@/components/sidebar/HistoryPanel';
import {EnvironmentsPanel} from '@/components/sidebar/EnvironmentsPanel';
import type {SideTab} from '@/types';

const TABS: Array<{key: SideTab; label: string}> = [
  {key: 'collections', label: 'Collections'},
  {key: 'history', label: 'History'},
  {key: 'env', label: 'Env'},
];

export function Sidebar() {
  const {sideTab, setSideTab} = useAppStore();

  return (
    <div
      style={{
        width: 268,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border)',
        background: 'var(--panel)',
        minHeight: 0,
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        {TABS.map(({key, label}) => {
          const active = sideTab === key;
          return (
            <div
              key={key}
              onClick={() => setSideTab(key)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '12px 4px',
                cursor: 'pointer',
                fontFamily: 'var(--font-archivo), sans-serif',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.1em',
                color: active ? 'var(--fg)' : 'var(--muted)',
                borderBottom: active
                  ? '2px solid var(--accent)'
                  : '2px solid transparent',
                background: active ? 'var(--panel2)' : 'transparent',
              }}
            >
              {label.toUpperCase()}
            </div>
          );
        })}
      </div>

      {/* Panel */}
      <div style={{flex: 1, overflowY: 'auto', minHeight: 0}}>
        {sideTab === 'collections' && <CollectionsPanel />}
        {sideTab === 'history' && <HistoryPanel />}
        {sideTab === 'env' && <EnvironmentsPanel />}
      </div>
    </div>
  );
}
