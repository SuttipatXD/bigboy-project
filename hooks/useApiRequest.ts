'use client';

import {useCallback, useRef} from 'react';
import {useAppStore} from '@/store/appStore';
import {buildUrl, buildHeaders, fmtSize, mock} from '@/lib/httpClient';
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

      const res = await fetch(resolvedUrl, opts);
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
    } catch {
      const time = Math.round(performance.now() - t0);
      const fallback = mock(resolvedUrl, method);
      fallback.time = time;
      fallback.note =
        'Live request blocked by sandbox — showing a sample response';

      stopTimer();

      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random()}`,
        method,
        url: resolvedUrl,
        status: fallback.status,
        time,
        ts: Date.now(),
      };
      store.pushHistory(entry);
      store.setResponse(fallback);
      store.setRespTab('body');
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  return {send};
}
