import type {ApiResponse, EnvVar, HttpMethod, KeyValueRow, AuthState} from '@/types';
import {subst} from './envInterpolation';

export function buildUrl(
  rawUrl: string,
  params: KeyValueRow[],
  vars: EnvVar[],
): string {
  let url = subst(rawUrl.trim(), vars);
  const active = params.filter((p) => p.on && p.key);
  if (active.length) {
    const qs = active
      .map(
        (p) =>
          `${encodeURIComponent(subst(p.key, vars))}=${encodeURIComponent(subst(p.value, vars))}`,
      )
      .join('&');
    url += (url.includes('?') ? '&' : '?') + qs;
  }
  return url;
}

export function buildHeaders(
  headerRows: KeyValueRow[],
  auth: AuthState,
  method: HttpMethod,
  body: string,
  vars: EnvVar[],
): Record<string, string> {
  const h: Record<string, string> = {};
  headerRows
    .filter((x) => x.on && x.key)
    .forEach((x) => {
      h[subst(x.key, vars)] = subst(x.value, vars);
    });

  if (auth.type === 'bearer' && auth.token) {
    h['Authorization'] = `Bearer ${subst(auth.token, vars)}`;
  }
  if (auth.type === 'basic') {
    h['Authorization'] =
      'Basic ' + btoa(`${auth.user ?? ''}:${auth.pass ?? ''}`);
  }
  if (
    !['GET', 'HEAD'].includes(method) &&
    body.trim() &&
    !h['Content-Type'] &&
    !h['content-type']
  ) {
    h['Content-Type'] = 'application/json';
  }
  return h;
}

export function fmtSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(2)} MB`;
}

/** Returns a plausible mock response when the real fetch is blocked. */
export function mock(url: string, method: HttpMethod): ApiResponse {
  let body: string;
  if (method === 'DELETE') {
    body = '{}';
  } else if (/\/users\/1\b/.test(url)) {
    body = JSON.stringify(
      {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'Sincere@april.biz',
        company: {
          name: 'Romaguera-Crona',
          catchPhrase: 'Multi-layered client-server neural-net',
        },
      },
      null,
      2,
    );
  } else if (/\/users\b/.test(url)) {
    body = JSON.stringify(
      [
        {id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz'},
        {id: 2, name: 'Ervin Howell', email: 'Shanna@melissa.tv'},
      ],
      null,
      2,
    );
  } else if (method === 'POST') {
    body = JSON.stringify(
      {id: 101, title: 'big boy', body: 'shipping it', userId: 1},
      null,
      2,
    );
  } else {
    body = JSON.stringify(
      {id: 1, title: 'sample resource', completed: false},
      null,
      2,
    );
  }

  const size = new Blob([body]).size;
  const status = method === 'POST' ? 201 : 200;
  return {
    status,
    statusText: status === 201 ? 'Created' : 'OK',
    ok: true,
    time: 0,
    size,
    body,
    headers: [
      {name: 'content-type', value: 'application/json; charset=utf-8'},
      {name: 'x-bigboy', value: 'sample-response'},
    ],
    note: null,
  };
}
