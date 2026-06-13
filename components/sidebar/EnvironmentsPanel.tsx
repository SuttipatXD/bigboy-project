'use client';

import {useAppStore} from '@/store/appStore';
import {KeyValueRow} from '@/components/ui/KeyValueRow';

export function EnvironmentsPanel() {
  const {
    env,
    envVars,
    updateEnvVar,
    toggleEnvVar,
    removeEnvVar,
    addEnvVar,
  } = useAppStore();

  const rows = envVars[env] ?? [];

  return (
    <div style={{padding: 14}}>
      <div
        style={{
          color: 'var(--muted)',
          fontFamily: 'var(--font-archivo), sans-serif',
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        {env} · Variables
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--border)',
              background: 'var(--panel2)',
            }}
          >
            {/* checkbox */}
            <div
              onClick={() => toggleEnvVar(i)}
              style={{
                width: 15,
                height: 15,
                margin: '0 9px',
                flexShrink: 0,
                cursor: 'pointer',
                border: '1px solid var(--border)',
                background: row.on ? 'var(--accent)' : 'transparent',
              }}
            />
            {/* key */}
            <input
              value={row.key}
              onChange={(e) => updateEnvVar(i, 'key', e.target.value)}
              placeholder="KEY"
              spellCheck={false}
              style={{
                width: '42%',
                minWidth: 0,
                background: 'transparent',
                border: 'none',
                borderLeft: '1px solid var(--border)',
                outline: 'none',
                color: 'var(--accent)',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: 11,
                padding: '7px 8px',
              }}
            />
            {/* value */}
            <input
              value={row.value}
              onChange={(e) => updateEnvVar(i, 'value', e.target.value)}
              placeholder="VALUE"
              spellCheck={false}
              style={{
                flex: 1,
                minWidth: 0,
                background: 'transparent',
                border: 'none',
                borderLeft: '1px solid var(--border)',
                outline: 'none',
                color: 'var(--fg)',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: 11,
                padding: '7px 8px',
              }}
            />
            {/* remove */}
            <div
              onClick={() => removeEnvVar(i)}
              style={{
                padding: '0 9px',
                cursor: 'pointer',
                color: 'var(--muted)',
                fontSize: 14,
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.color = 'var(--fg)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.color =
                  'var(--muted)')
              }
            >
              ×
            </div>
          </div>
        ))}
      </div>

      {/* Add row */}
      <div
        onClick={addEnvVar}
        style={{
          marginTop: 10,
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
        + ADD VARIABLE
      </div>

      {/* Usage hint */}
      <div
        style={{
          marginTop: 16,
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: 10,
          lineHeight: 1.8,
          color: 'var(--muted)',
          borderTop: '1px solid var(--border)',
          paddingTop: 12,
        }}
      >
        USE IN REQUESTS:
        <br />
        <span style={{color: 'var(--accent)'}}>{'{{base_url}}'}</span>
        /users/1
      </div>
    </div>
  );
}
