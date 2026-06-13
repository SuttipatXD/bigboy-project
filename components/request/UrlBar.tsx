'use client';

import {useAppStore} from '@/store/appStore';
import {METHOD_COLORS} from '@/lib/themes';
import {buildUrl} from '@/lib/httpClient';
import {useApiRequest} from '@/hooks/useApiRequest';
import type {HttpMethod} from '@/types';

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export function UrlBar() {
  const {
    method,
    url,
    params,
    env,
    envVars,
    loading,
    methodOpen,
    setUrl,
    setMethod,
    toggleMethodOpen,
    closeMenus,
  } = useAppStore();

  const {send} = useApiRequest();

  const vars = envVars[env] ?? [];
  const resolvedUrl = buildUrl(url, params, vars);
  const methodColor = METHOD_COLORS[method] ?? 'var(--muted)';

  return (
    <div
      style={{
        flexShrink: 0,
        padding: '14px 16px 12px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{display: 'flex', border: '1px solid var(--border)'}}>
        {/* Method picker */}
        <div style={{position: 'relative', flexShrink: 0}}>
          <div
            onClick={toggleMethodOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 14px',
              height: 42,
              cursor: 'pointer',
              borderRight: '1px solid var(--border)',
              background: 'var(--panel2)',
              minWidth: 108,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background =
                'var(--hover)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background =
                'var(--panel2)')
            }
          >
            <span
              style={{
                fontFamily: 'var(--font-archivo), sans-serif',
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: '0.04em',
                color: methodColor,
              }}
            >
              {method}
            </span>
            <span style={{flex: 1}} />
            <span style={{fontSize: 9, color: 'var(--muted)'}}>▼</span>
          </div>

          {methodOpen && (
            <>
              <div
                onClick={closeMenus}
                style={{position: 'fixed', inset: 0, zIndex: 40}}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  zIndex: 50,
                  minWidth: 130,
                  border: '1px solid var(--border)',
                  background: 'var(--panel)',
                }}
              >
                {HTTP_METHODS.map((m) => (
                  <div
                    key={m}
                    onClick={() => setMethod(m)}
                    style={{
                      padding: '9px 14px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-archivo), sans-serif',
                      fontWeight: 800,
                      fontSize: 12,
                      letterSpacing: '0.04em',
                      color: METHOD_COLORS[m] ?? 'var(--muted)',
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
                    {m}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* URL input */}
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          spellCheck={false}
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--fg)',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 13,
            padding: '0 14px',
          }}
        />

        {/* Send button */}
        <div
          onClick={loading ? undefined : send}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 104,
            padding: '0 22px',
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 900,
            fontSize: 13,
            letterSpacing: '0.08em',
            color: 'var(--accent-fg)',
            background: 'var(--accent)',
            opacity: loading ? 0.6 : 1,
            flexShrink: 0,
          }}
        >
          {loading ? 'SENDING' : 'SEND'}
        </div>
      </div>

      {/* Resolved URL preview */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 8,
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: 10,
          color: 'var(--muted)',
        }}
      >
        <span style={{color: 'var(--accent)'}}>↳</span>
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {resolvedUrl}
        </span>
      </div>
    </div>
  );
}
