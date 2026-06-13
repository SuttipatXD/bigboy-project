'use client';

import {useAppStore} from '@/store/appStore';
import {subst} from '@/lib/envInterpolation';
import type {AuthType} from '@/types';

const AUTH_TYPES: Array<{key: AuthType; label: string}> = [
  {key: 'none', label: 'None'},
  {key: 'bearer', label: 'Bearer'},
  {key: 'basic', label: 'Basic'},
];

export function AuthPanel() {
  const {
    auth,
    setAuthType,
    setAuthToken,
    setAuthUser,
    setAuthPass,
    env,
    envVars,
  } = useAppStore();

  const vars = envVars[env] ?? [];
  const tokenPreview = subst(auth.token, vars) || '—';

  return (
    <div>
      {/* Auth type tabs */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          border: '1px solid var(--border)',
          width: 'fit-content',
          marginBottom: 14,
        }}
      >
        {AUTH_TYPES.map(({key, label}, idx) => {
          const active = auth.type === key;
          const isLast = idx === AUTH_TYPES.length - 1;
          return (
            <div
              key={key}
              onClick={() => setAuthType(key)}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                fontFamily: 'var(--font-archivo), sans-serif',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.06em',
                borderRight: !isLast ? '1px solid var(--border)' : 'none',
                color: active ? 'var(--accent-fg)' : 'var(--muted)',
                background: active ? 'var(--accent)' : 'transparent',
              }}
            >
              {label.toUpperCase()}
            </div>
          );
        })}
      </div>

      {/* None */}
      {auth.type === 'none' && (
        <div
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 12,
            color: 'var(--muted)',
            padding: '10px 0',
          }}
        >
          No authorization sent with this request.
        </div>
      )}

      {/* Bearer */}
      {auth.type === 'bearer' && (
        <div>
          <div
            style={{
              fontFamily: 'var(--font-archivo), sans-serif',
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: 6,
            }}
          >
            Token
          </div>
          <input
            value={auth.token}
            onChange={(e) => setAuthToken(e.target.value)}
            placeholder="paste token or use {{token}}"
            spellCheck={false}
            style={{
              width: '100%',
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              outline: 'none',
              color: 'var(--fg)',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 12,
              padding: '10px 12px',
            }}
            onFocus={(e) =>
              ((e.currentTarget as HTMLInputElement).style.borderColor =
                'var(--accent)')
            }
            onBlur={(e) =>
              ((e.currentTarget as HTMLInputElement).style.borderColor =
                'var(--border)')
            }
          />
          <div
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 10,
              color: 'var(--muted)',
              marginTop: 8,
            }}
          >
            → Authorization: Bearer{' '}
            <span style={{color: 'var(--accent)'}}>{tokenPreview}</span>
          </div>
        </div>
      )}

      {/* Basic */}
      {auth.type === 'basic' && (
        <div style={{display: 'flex', gap: 10}}>
          <div style={{flex: 1}}>
            <div
              style={{
                fontFamily: 'var(--font-archivo), sans-serif',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: 6,
              }}
            >
              Username
            </div>
            <input
              value={auth.user}
              onChange={(e) => setAuthUser(e.target.value)}
              placeholder="username"
              spellCheck={false}
              style={{
                width: '100%',
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                outline: 'none',
                color: 'var(--fg)',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: 12,
                padding: '10px 12px',
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor =
                  'var(--accent)')
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor =
                  'var(--border)')
              }
            />
          </div>
          <div style={{flex: 1}}>
            <div
              style={{
                fontFamily: 'var(--font-archivo), sans-serif',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: 6,
              }}
            >
              Password
            </div>
            <input
              type="password"
              value={auth.pass}
              onChange={(e) => setAuthPass(e.target.value)}
              placeholder="password"
              style={{
                width: '100%',
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                outline: 'none',
                color: 'var(--fg)',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: 12,
                padding: '10px 12px',
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor =
                  'var(--accent)')
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor =
                  'var(--border)')
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
