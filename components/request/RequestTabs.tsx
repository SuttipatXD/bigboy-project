'use client';

import {useAppStore} from '@/store/appStore';
import type {ReqTab} from '@/types';

const TABS: Array<{key: ReqTab; label: string}> = [
  {key: 'params', label: 'Params'},
  {key: 'headers', label: 'Headers'},
  {key: 'auth', label: 'Auth'},
  {key: 'body', label: 'Body'},
];

export function RequestTabs() {
  const {reqTab, setReqTab, params, headers, auth, body, method} =
    useAppStore();

  const counts: Record<ReqTab, number> = {
    params: params.filter((p) => p.on && p.key).length,
    headers: headers.filter((h) => h.on && h.key).length,
    auth: auth.type !== 'none' ? 1 : 0,
    body:
      !['GET', 'HEAD'].includes(method) && body.trim() ? 1 : 0,
  };

  return (
    <div
      style={{
        flexShrink: 0,
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        padding: '0 8px',
      }}
    >
      {TABS.map(({key, label}) => {
        const active = reqTab === key;
        const count = counts[key];
        return (
          <div
            key={key}
            onClick={() => setReqTab(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '12px 16px',
              cursor: 'pointer',
              fontFamily: 'var(--font-archivo), sans-serif',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.04em',
              color: active ? 'var(--fg)' : 'var(--muted)',
              borderBottom: active
                ? '2px solid var(--accent)'
                : '2px solid transparent',
            }}
          >
            {label}
            {count > 0 && (
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'var(--accent-fg)',
                  background: 'var(--accent)',
                  padding: '1px 5px',
                  minWidth: 14,
                  textAlign: 'center',
                }}
              >
                {count}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
