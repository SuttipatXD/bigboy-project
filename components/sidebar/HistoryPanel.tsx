'use client';

import {useAppStore} from '@/store/appStore';
import {METHOD_COLORS} from '@/lib/themes';
import type {HttpMethod} from '@/types';

function statusColor(status: number): string {
  if (status >= 500) return '#ff4d4d';
  if (status >= 400) return '#ffb000';
  return 'var(--accent)';
}

export function HistoryPanel() {
  const {history, loadRequest} = useAppStore();

  if (history.length === 0) {
    return (
      <div
        style={{
          padding: '40px 18px',
          textAlign: 'center',
          color: 'var(--muted)',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: 11,
          lineHeight: 1.8,
        }}
      >
        NO REQUESTS YET
        <br />
        <span style={{opacity: 0.6}}>↳ hit SEND to log one</span>
      </div>
    );
  }

  return (
    <div style={{padding: '8px 0'}}>
      {history.map((h) => {
        const color = METHOD_COLORS[h.method] ?? 'var(--muted)';
        const path = h.url.replace(/^https?:\/\//, '');
        const meta = `${h.time} ms · ${new Date(h.ts).toLocaleTimeString()}`;
        return (
          <div
            key={h.id}
            onClick={() => loadRequest(h.method as HttpMethod, h.url)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 14px',
              cursor: 'pointer',
              borderBottom: '1px solid var(--border)',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background =
                'var(--hover)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background =
                'transparent')
            }
          >
            <span
              style={{
                fontFamily: 'var(--font-archivo), sans-serif',
                fontWeight: 800,
                fontSize: 9,
                width: 42,
                flexShrink: 0,
                color,
              }}
            >
              {h.method}
            </span>
            <div style={{flex: 1, minWidth: 0}}>
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: 11,
                  color: 'var(--fg)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {path}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: 9,
                  color: 'var(--muted)',
                  marginTop: 2,
                }}
              >
                {meta}
              </div>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: 10,
                fontWeight: 700,
                color: statusColor(h.status),
              }}
            >
              {h.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}
