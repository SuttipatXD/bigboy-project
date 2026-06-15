import type {AuthState, Collection, CollectionItem, HttpMethod, KeyValueRow} from '@/types';

interface PmUrl {
  raw?: string;
  query?: Array<{key: string; value?: string; disabled?: boolean}>;
}

interface PmHeader {
  key: string;
  value: string;
  disabled?: boolean;
}

interface PmAuth {
  type: string;
  bearer?: Array<{key: string; value: string}>;
  basic?: Array<{key: string; value: string}>;
}

interface PmBody {
  mode: string;
  raw?: string;
}

interface PmRequest {
  method?: string;
  url?: string | PmUrl;
  header?: PmHeader[];
  body?: PmBody;
  auth?: PmAuth;
}

interface PmItem {
  name?: string;
  request?: PmRequest;
  item?: PmItem[];
}

interface PmCollection {
  info?: {name?: string};
  item?: PmItem[];
}

const VALID_METHODS = new Set<string>(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);

function extractBaseUrl(url: string | PmUrl | undefined): string {
  if (!url) return '';
  const raw = typeof url === 'string' ? url : (url.raw ?? '');
  return raw.split('?')[0];
}

function extractParams(url: string | PmUrl | undefined): KeyValueRow[] {
  if (!url || typeof url === 'string') return [];
  return (url.query ?? [])
    .filter((q) => q.key)
    .map((q) => ({key: q.key, value: q.value ?? '', on: !q.disabled}));
}

function extractHeaders(headers?: PmHeader[]): KeyValueRow[] {
  return (headers ?? [])
    .filter((h) => h.key)
    .map((h) => ({key: h.key ?? '', value: h.value ?? '', on: !h.disabled}));
}

function extractAuth(auth?: PmAuth): AuthState {
  const none: AuthState = {type: 'none', token: '', user: '', pass: ''};
  if (!auth || auth.type === 'noauth') return none;
  if (auth.type === 'bearer') {
    const token = auth.bearer?.find((b) => b.key === 'token')?.value ?? '';
    return {type: 'bearer', token, user: '', pass: ''};
  }
  if (auth.type === 'basic') {
    const user = auth.basic?.find((b) => b.key === 'username')?.value ?? '';
    const pass = auth.basic?.find((b) => b.key === 'password')?.value ?? '';
    return {type: 'basic', token: '', user, pass};
  }
  return none;
}

function flattenItems(items: PmItem[]): CollectionItem[] {
  const result: CollectionItem[] = [];
  for (const item of items) {
    if (item.item) {
      result.push(...flattenItems(item.item));
    } else if (item.request) {
      const req = item.request;
      const method = (req.method ?? 'GET').toUpperCase();
      if (!VALID_METHODS.has(method)) continue;
      result.push({
        name: item.name ?? '',
        method: method as HttpMethod,
        url: extractBaseUrl(req.url),
        params: extractParams(req.url),
        headers: extractHeaders(req.header),
        body: req.body?.mode === 'raw' ? (req.body.raw ?? '') : '',
        auth: extractAuth(req.auth),
      });
    }
  }
  return result;
}

export function parsePostmanCollection(raw: unknown): Collection {
  const data = raw as PmCollection;
  return {
    name: data.info?.name ?? 'Imported Collection',
    items: flattenItems(data.item ?? []),
  };
}
