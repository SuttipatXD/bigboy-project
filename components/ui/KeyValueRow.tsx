'use client';

interface KeyValueRowProps {
  rowKey: string;
  value: string;
  on: boolean;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  onToggle: () => void;
  onKeyChange: (val: string) => void;
  onValueChange: (val: string) => void;
  onRemove: () => void;
}

export function KeyValueRow({
  rowKey,
  value,
  on,
  keyPlaceholder = 'KEY',
  valuePlaceholder = 'VALUE',
  onToggle,
  onKeyChange,
  onValueChange,
  onRemove,
}: KeyValueRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid var(--border)',
        background: 'var(--panel)',
      }}
    >
      {/* checkbox */}
      <div
        onClick={onToggle}
        style={{
          width: 15,
          height: 15,
          margin: '0 9px',
          flexShrink: 0,
          cursor: 'pointer',
          border: '1px solid var(--border)',
          background: on ? 'var(--accent)' : 'transparent',
        }}
      />
      {/* key input */}
      <input
        value={rowKey}
        onChange={(e) => onKeyChange(e.target.value)}
        placeholder={keyPlaceholder}
        spellCheck={false}
        style={{
          width: '40%',
          minWidth: 0,
          background: 'transparent',
          border: 'none',
          borderLeft: '1px solid var(--border)',
          outline: 'none',
          color: 'var(--accent)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          padding: '8px 10px',
        }}
      />
      {/* value input */}
      <input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={valuePlaceholder}
        spellCheck={false}
        style={{
          flex: 1,
          minWidth: 0,
          background: 'transparent',
          border: 'none',
          borderLeft: '1px solid var(--border)',
          outline: 'none',
          color: 'var(--fg)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          padding: '8px 10px',
        }}
      />
      {/* remove */}
      <div
        onClick={onRemove}
        style={{
          padding: '0 11px',
          cursor: 'pointer',
          color: 'var(--muted)',
          fontSize: 15,
          alignSelf: 'stretch',
          display: 'flex',
          alignItems: 'center',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLDivElement).style.color = 'var(--fg)')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLDivElement).style.color = 'var(--muted)')
        }
      >
        ×
      </div>
    </div>
  );
}
