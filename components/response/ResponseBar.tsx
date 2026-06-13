'use client';

import {useAppStore} from '@/store/appStore';
import {fmtSize} from '@/lib/httpClient';
import type {RespTab} from '@/types';

const RESP_TABS: Array<{key: RespTab; label: string}> = [
  {key: 'body', label: 'Body'},
  {key: 'headers', label: 'Headers'},
  {key: 'raw', label: 'Raw'},
];

function statusColor(status: number): string {
  if (status >= 500) return '#ff4d4d';
  if (status >= 400) return '#ffb000';
  return 'var(--accent)';
}

export function ResponseBar() {
  const {response, respTab, setRespTab} = useAppStore();

  return (
    <div
      style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--panel)',
        paddingRight: 8,
      }}
    >
      {/* Status info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 16px',
          height: 42,
          flex: 1,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 800,
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}
        >
          Response
        </span>

        {response && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 11,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: statusColor(response.status),
              }}
            >
              {response.status} {response.statusText}
            </span>
            <span style={{color: 'var(--muted)'}}>{response.time} ms</span>
            <span style={{color: 'var(--muted)'}}>{fmtSize(response.size)}</span>
          </div>
        )}
      </div>

      {/* Tabs — only shown when there is a response */}
      {response && (
        <div style={{display: 'flex'}}>
          {RESP_TABS.map(({key, label}) => {
            const active = respTab === key;
            return (
              <div
                key={key}
                onClick={() => setRespTab(key)}
                style={{
                  padding: '12px 14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-archivo), sans-serif',
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  color: active ? 'var(--fg)' : 'var(--muted)',
                  borderBottom: active
                    ? '2px solid var(--accent)'
                    : '2px solid transparent',
                }}
              >
                {label.toUpperCase()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
