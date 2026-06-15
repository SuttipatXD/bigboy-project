'use client';

import {useCallback, useRef} from 'react';
import {useAppStore} from '@/store/appStore';
import {buildUrl, buildHeaders} from '@/lib/httpClient';
import {subst} from '@/lib/envInterpolation';
import type {HistoryEntry} from '@/types';

export function useApiRequest() {
  const store = useAppStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const send = useCallback(async () => {
    if (store.loading) return;

    const {method, url, params, headers, auth, body, env, envVars} = store;
    const vars = envVars[env] ?? [];

    const resolvedUrl = buildUrl(url, params, vars);
    const resolvedHeaders = buildHeaders(headers, auth, method, body, vars);

    const unresolvedVars = resolvedUrl.match(/\{\{[\w.\-]+\}\}/g);
    if (unresolvedVars) {
      store.setResponse({
        status: 0,
        statusText: 'Unresolved Variables',
        ok: false,
        time: 0,
        size: 0,
        body: '',
        headers: [],
        note: `URL contains unresolved variables: ${unresolvedVars.join(', ')} — add them in the Env panel or rename to match your collection`,
      });
      return;
    }

    if (!/^https?:\/\//i.test(resolvedUrl)) {
      store.setResponse({
        status: 0,
        statusText: 'Invalid URL',
        ok: false,
        time: 0,
        size: 0,
        body: '',
        headers: [],
        note: `URL must start with http:// or https:// — got: "${resolvedUrl}"`,
      });
      return;
    }

    store.setLoading(true);
    store.setResponse(null);
    store.closeMenus();

    let tick = 0;
    timerRef.current = setInterval(() => {
      tick += 1;
      store.setLoadingTick(() => tick);
    }, 220);

    const t0 = performance.now();

    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    try {
      const opts: RequestInit = {method, headers: resolvedHeaders};
      if (!['GET', 'HEAD'].includes(method) && body.trim()) {
        opts.body = subst(body, vars);
      }

      const proxyHeaders = {...resolvedHeaders, 'x-proxy-url': resolvedUrl};
      const res = await fetch('/api/proxy', {...opts, headers: proxyHeaders});
      const text = await res.text();
      const time = Math.round(performance.now() - t0);
      const size = new Blob([text]).size;
      const responseHeaders = [...res.headers.entries()].map(
        ([name, value]) => ({name, value}),
      );

      stopTimer();

      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random()}`,
        method,
        url: resolvedUrl,
        status: res.status,
        time,
        ts: Date.now(),
      };
      store.pushHistory(entry);
      store.setResponse({
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        time,
        size,
        body: text,
        headers: responseHeaders,
        note: null,
      });
      store.setRespTab('body');
    } catch (err) {
      const time = Math.round(performance.now() - t0);
      const message = err instanceof Error ? err.message : String(err);
      const isCors =
        message.toLowerCase().includes('failed to fetch') ||
        message.toLowerCase().includes('network');

      stopTimer();

      store.setResponse({
        status: 0,
        statusText: 'Network Error',
        ok: false,
        time,
        size: 0,
        body: '',
        headers: [],
        note: isCors
          ? `CORS or network error — the server at "${resolvedUrl}" blocked the request from the browser. Use a proxy or enable CORS on your server. (${message})`
          : message,
      });
      store.setRespTab('body');
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  return {send};
}
