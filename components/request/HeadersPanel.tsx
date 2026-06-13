'use client';

import {useAppStore} from '@/store/appStore';
import {KeyValueRow} from '@/components/ui/KeyValueRow';

export function HeadersPanel() {
  const {headers, updateHeader, toggleHeader, removeHeader, addHeader} =
    useAppStore();

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
      {headers.map((row, i) => (
        <KeyValueRow
          key={i}
          rowKey={row.key}
          value={row.value}
          on={row.on}
          keyPlaceholder="HEADER"
          valuePlaceholder="VALUE"
          onToggle={() => toggleHeader(i)}
          onKeyChange={(val) => updateHeader(i, 'key', val)}
          onValueChange={(val) => updateHeader(i, 'value', val)}
          onRemove={() => removeHeader(i)}
        />
      ))}
      <div
        onClick={addHeader}
        style={{
          border: '1px dashed var(--border)',
          padding: 8,
          textAlign: 'center',
          cursor: 'pointer',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: 11,
          color: 'var(--muted)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'var(--accent)';
          el.style.color = 'var(--accent)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'var(--border)';
          el.style.color = 'var(--muted)';
        }}
      >
        + ADD HEADER
      </div>
    </div>
  );
}
