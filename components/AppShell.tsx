'use client';

import {useAppStore} from '@/store/appStore';
import {THEMES, themeToCssVars} from '@/lib/themes';
import {TopBar} from '@/components/layout/TopBar';
import {Sidebar} from '@/components/layout/Sidebar';
import {UrlBar} from '@/components/request/UrlBar';
import {RequestTabs} from '@/components/request/RequestTabs';
import {ParamsPanel} from '@/components/request/ParamsPanel';
import {HeadersPanel} from '@/components/request/HeadersPanel';
import {AuthPanel} from '@/components/request/AuthPanel';
import {BodyPanel} from '@/components/request/BodyPanel';
import {ResponseBar} from '@/components/response/ResponseBar';
import {JsonViewer} from '@/components/response/JsonViewer';
import {RawViewer} from '@/components/response/RawViewer';

const LOADING_DOTS = ['WAITING', 'WAITING.', 'WAITING..', 'WAITING...'];

export function AppShell() {
  const {
    theme,
    reqTab,
    respTab,
    response,
    loading,
    loadingTick,
  } = useAppStore();

  const tokens = THEMES[theme];
  const cssVars = themeToCssVars(tokens) as React.CSSProperties;

  const loadingLabel = LOADING_DOTS[loadingTick % 4];

  const showEmpty = !response && !loading;
  const showRespBody = !!response && !loading && respTab === 'body';
  const showRespHeaders = !!response && !loading && respTab === 'headers';
  const showRespRaw = !!response && !loading && respTab === 'raw';

  return (
    <div
      style={{
        ...cssVars,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: 'var(--bg)',
        color: 'var(--fg)',
        fontFamily: 'var(--font-jetbrains-mono), monospace',
      }}
    >
      <TopBar />

      {/* Main area */}
      <div style={{display: 'flex', flex: 1, minHeight: 0}}>
        <Sidebar />

        {/* Workspace */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            minHeight: 0,
          }}
        >
          <UrlBar />
          <RequestTabs />

          {/* Request panel */}
          <div
            style={{
              flexShrink: 0,
              height: 208,
              overflowY: 'auto',
              padding: '14px 16px',
              background: 'var(--bg)',
            }}
          >
            {reqTab === 'params' && <ParamsPanel />}
            {reqTab === 'headers' && <HeadersPanel />}
            {reqTab === 'auth' && <AuthPanel />}
            {reqTab === 'body' && <BodyPanel />}
          </div>

          <ResponseBar />

          {/* Response body */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              minHeight: 0,
              background: 'var(--bg)',
            }}
          >
            {/* Sandbox note */}
            {response?.note && (
              <div
                style={{
                  padding: '9px 16px',
                  background: 'var(--panel2)',
                  borderBottom: '1px solid var(--border)',
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: 10,
                  color: 'var(--accent)',
                }}
              >
                ⚠ {response.note}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div
                style={{
                  padding: '60px 16px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: 12,
                  color: 'var(--accent)',
                  letterSpacing: '0.1em',
                }}
              >
                {loadingLabel}
              </div>
            )}

            {/* Empty state */}
            {showEmpty && (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 14,
                  padding: 40,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--muted)',
                    fontSize: 20,
                  }}
                >
                  ↳
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    fontSize: 12,
                    color: 'var(--muted)',
                    letterSpacing: '0.06em',
                    lineHeight: 1.8,
                  }}
                >
                  SEND A REQUEST TO INSPECT THE RESPONSE
                  <br />
                  <span style={{opacity: 0.55}}>
                    try the JSONPlaceholder collection in the sidebar
                  </span>
                </div>
              </div>
            )}

            {/* Body (JSON highlighted) */}
            {showRespBody && <JsonViewer text={response!.body} />}

            {/* Headers */}
            {showRespHeaders && (
              <div style={{padding: '8px 0'}}>
                {response!.headers.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 14,
                      padding: '8px 16px',
                      borderBottom: '1px solid var(--border)',
                      fontFamily: 'var(--font-jetbrains-mono), monospace',
                      fontSize: 11,
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--accent)',
                        width: 200,
                        flexShrink: 0,
                        wordBreak: 'break-all',
                      }}
                    >
                      {h.name}
                    </span>
                    <span
                      style={{color: 'var(--fg)', wordBreak: 'break-all'}}
                    >
                      {h.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Raw */}
            {showRespRaw && <RawViewer text={response!.body} />}
          </div>
        </div>
      </div>
    </div>
  );
}
