'use client';

import {useAppStore} from '@/store/appStore';
import {METHOD_COLORS} from '@/lib/themes';
import type {CollectionItem, HttpMethod} from '@/types';

const COLLECTION: CollectionItem[] = [
  {method: 'GET', url: '{{base_url}}/users'},
  {method: 'GET', url: '{{base_url}}/users/1'},
  {method: 'GET', url: '{{base_url}}/posts?userId=1'},
  {method: 'GET', url: '{{base_url}}/todos/1'},
  {method: 'POST', url: '{{base_url}}/posts'},
  {method: 'PUT', url: '{{base_url}}/posts/1'},
  {method: 'PATCH', url: '{{base_url}}/posts/1'},
  {method: 'DELETE', url: '{{base_url}}/posts/1'},
];

export function CollectionsPanel() {
  const {loadRequest} = useAppStore();

  return (
    <div style={{padding: '10px 0'}}>
      {/* Group header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          color: 'var(--muted)',
          fontFamily: 'var(--font-archivo), sans-serif',
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        <span style={{color: 'var(--accent)'}}>▸</span> JSONPlaceholder
      </div>

      {COLLECTION.map((item, i) => {
        const path = item.url.replace('{{base_url}}', '');
        const color = METHOD_COLORS[item.method] ?? 'var(--muted)';
        return (
          <div
            key={i}
            onClick={() => loadRequest(item.method as HttpMethod, item.url)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 14px 8px 26px',
              cursor: 'pointer',
              borderLeft: '2px solid transparent',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.background = 'var(--hover)';
              el.style.borderLeftColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.background = 'transparent';
              el.style.borderLeftColor = 'transparent';
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-archivo), sans-serif',
                fontWeight: 800,
                fontSize: 9,
                letterSpacing: '0.05em',
                width: 42,
                flexShrink: 0,
                color,
              }}
            >
              {item.method}
            </span>
            <span
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
            </span>
          </div>
        );
      })}
    </div>
  );
}
