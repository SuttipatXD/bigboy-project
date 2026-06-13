'use client';

import {useAppStore} from '@/store/appStore';

export function BodyPanel() {
  const {body, setBody} = useAppStore();

  function beautify() {
    try {
      setBody(JSON.stringify(JSON.parse(body), null, 2));
    } catch {
      // malformed JSON — no-op
    }
  }

  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}
        >
          JSON Body
        </span>
        <span style={{flex: 1}} />
        <div
          onClick={beautify}
          style={{
            border: '1px solid var(--border)',
            padding: '4px 10px',
            cursor: 'pointer',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 10,
            letterSpacing: '0.06em',
            color: 'var(--fg)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = 'var(--accent)';
            el.style.color = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = 'var(--border)';
            el.style.color = 'var(--fg)';
          }}
        >
          BEAUTIFY
        </div>
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        spellCheck={false}
        style={{
          flex: 1,
          width: '100%',
          minHeight: 96,
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          outline: 'none',
          color: 'var(--fg)',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: 12,
          lineHeight: 1.7,
          padding: 12,
        }}
        onFocus={(e) =>
          ((e.currentTarget as HTMLTextAreaElement).style.borderColor =
            'var(--accent)')
        }
        onBlur={(e) =>
          ((e.currentTarget as HTMLTextAreaElement).style.borderColor =
            'var(--border)')
        }
      />
    </div>
  );
}
