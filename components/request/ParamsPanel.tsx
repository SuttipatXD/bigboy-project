'use client';

import {useAppStore} from '@/store/appStore';
import {KeyValueRow} from '@/components/ui/KeyValueRow';

export function ParamsPanel() {
  const {params, updateParam, toggleParam, removeParam, addParam} =
    useAppStore();

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
      {params.map((row, i) => (
        <KeyValueRow
          key={i}
          rowKey={row.key}
          value={row.value}
          on={row.on}
          keyPlaceholder="KEY"
          valuePlaceholder="VALUE"
          onToggle={() => toggleParam(i)}
          onKeyChange={(val) => updateParam(i, 'key', val)}
          onValueChange={(val) => updateParam(i, 'value', val)}
          onRemove={() => removeParam(i)}
        />
      ))}
      <div
        onClick={addParam}
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
        + ADD PARAM
      </div>
    </div>
  );
}
