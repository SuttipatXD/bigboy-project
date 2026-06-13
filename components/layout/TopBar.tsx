'use client';

import {useAppStore} from '@/store/appStore';
import type {Theme} from '@/types';

const THEMES: Theme[] = ['void', 'paper', 'punch'];

export function TopBar() {
  const {
    theme,
    setTheme,
    env,
    envVars,
    envOpen,
    toggleEnvOpen,
    setEnv,
    closeMenus,
  } = useAppStore();

  const envNames = Object.keys(envVars);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        height: 54,
        flexShrink: 0,
        padding: '0 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--panel)',
      }}
    >
      {/* Logo */}
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <div
          style={{width: 15, height: 15, background: 'var(--accent)', flexShrink: 0}}
        />
        <span
          style={{
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 900,
            fontSize: 19,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: 'var(--fg)',
          }}
        >
          BigBoy
        </span>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: '0.18em',
            color: 'var(--muted)',
            border: '1px solid var(--border)',
            padding: '3px 6px',
            textTransform: 'uppercase',
          }}
        >
          API Client
        </span>
      </div>

      <div style={{flex: 1}} />

      {/* Environment selector */}
      <div style={{position: 'relative'}}>
        <div
          onClick={toggleEnvOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid var(--border)',
            padding: '7px 11px',
            cursor: 'pointer',
            background: 'var(--panel2)',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.borderColor =
              'var(--muted)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.borderColor =
              'var(--border)')
          }
        >
          <span
            style={{
              width: 7,
              height: 7,
              background: 'var(--accent)',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--fg)',
            }}
          >
            {env}
          </span>
          <span style={{fontSize: 9, color: 'var(--muted)'}}>▼</span>
        </div>

        {envOpen && (
          <>
            {/* click-away */}
            <div
              onClick={closeMenus}
              style={{position: 'fixed', inset: 0, zIndex: 40}}
            />
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                zIndex: 50,
                minWidth: 160,
                border: '1px solid var(--border)',
                background: 'var(--panel)',
              }}
            >
              {envNames.map((name) => (
                <div
                  key={name}
                  onClick={() => setEnv(name)}
                  style={{
                    padding: '9px 14px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: env === name ? 'var(--accent)' : 'var(--fg)',
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
                  {name}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Theme switcher */}
      <div style={{display: 'flex', border: '1px solid var(--border)'}}>
        {THEMES.map((t) => {
          const active = theme === t;
          return (
            <div
              key={t}
              onClick={() => setTheme(t)}
              style={{
                padding: '7px 12px',
                cursor: 'pointer',
                fontFamily: 'var(--font-archivo), sans-serif',
                fontWeight: 800,
                fontSize: 10,
                letterSpacing: '0.1em',
                color: active ? 'var(--accent-fg)' : 'var(--muted)',
                background: active ? 'var(--accent)' : 'transparent',
              }}
            >
              {t.toUpperCase()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
