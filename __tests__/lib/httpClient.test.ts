import {buildUrl, buildHeaders, fmtSize, mock} from '@/lib/httpClient';
import type {AuthState, EnvVar, KeyValueRow} from '@/types';

const envVars: EnvVar[] = [
  {key: 'base_url', value: 'https://api.example.com', on: true},
  {key: 'token', value: 'my-token', on: true},
];

const noAuth: AuthState = {type: 'none', token: '', user: '', pass: ''};

// ──────────────────────────────────────────────────────────────
// buildUrl — GREEN
// ──────────────────────────────────────────────────────────────
describe('buildUrl — GREEN', () => {
  it('returns resolved URL with no params', () => {
    expect(buildUrl('{{base_url}}/users', [], envVars)).toBe(
      'https://api.example.com/users',
    );
  });

  it('appends a single enabled param as query string', () => {
    const params: KeyValueRow[] = [{key: 'page', value: '1', on: true}];
    expect(buildUrl('https://api.example.com/users', params, [])).toBe(
      'https://api.example.com/users?page=1',
    );
  });

  it('appends multiple enabled params joined with &', () => {
    const params: KeyValueRow[] = [
      {key: 'page', value: '1', on: true},
      {key: 'limit', value: '20', on: true},
    ];
    expect(buildUrl('https://api.example.com/users', params, [])).toBe(
      'https://api.example.com/users?page=1&limit=20',
    );
  });

  it('uses & when URL already has a query string', () => {
    const params: KeyValueRow[] = [{key: 'extra', value: 'val', on: true}];
    expect(buildUrl('https://api.example.com/users?userId=1', params, [])).toBe(
      'https://api.example.com/users?userId=1&extra=val',
    );
  });

  it('substitutes {{variable}} in param value', () => {
    const params: KeyValueRow[] = [
      {key: 'auth', value: '{{token}}', on: true},
    ];
    expect(buildUrl('https://api.example.com', params, envVars)).toBe(
      'https://api.example.com?auth=my-token',
    );
  });

  it('URL-encodes special characters in param key and value', () => {
    const params: KeyValueRow[] = [
      {key: 'q', value: 'hello world&more', on: true},
    ];
    const result = buildUrl('https://api.example.com', params, []);
    expect(result).toContain('hello%20world%26more');
  });
});

// ──────────────────────────────────────────────────────────────
// buildUrl — RED
// ──────────────────────────────────────────────────────────────
describe('buildUrl — RED — edge cases', () => {
  it('skips disabled params (on=false)', () => {
    const params: KeyValueRow[] = [
      {key: 'skip', value: 'me', on: false},
      {key: 'keep', value: 'this', on: true},
    ];
    const result = buildUrl('https://api.example.com', params, []);
    expect(result).not.toContain('skip');
    expect(result).toContain('keep=this');
  });

  it('skips params with empty key (even if on=true)', () => {
    const params: KeyValueRow[] = [{key: '', value: 'value', on: true}];
    expect(buildUrl('https://api.example.com', params, [])).toBe(
      'https://api.example.com',
    );
  });

  it('returns bare URL when all params are disabled', () => {
    const params: KeyValueRow[] = [
      {key: 'a', value: '1', on: false},
      {key: 'b', value: '2', on: false},
    ];
    expect(buildUrl('https://api.example.com', params, [])).toBe(
      'https://api.example.com',
    );
  });

  it('returns bare URL when params array is empty', () => {
    expect(buildUrl('https://api.example.com', [], [])).toBe(
      'https://api.example.com',
    );
  });
});

// ──────────────────────────────────────────────────────────────
// buildHeaders — GREEN
// ──────────────────────────────────────────────────────────────
describe('buildHeaders — GREEN', () => {
  it('merges enabled header rows into result', () => {
    const headers: KeyValueRow[] = [
      {key: 'Accept', value: 'application/json', on: true},
    ];
    const result = buildHeaders(headers, noAuth, 'GET', '', []);
    expect(result['Accept']).toBe('application/json');
  });

  it('adds Bearer Authorization header when auth.type is bearer', () => {
    const auth: AuthState = {type: 'bearer', token: 'abc', user: '', pass: ''};
    const result = buildHeaders([], auth, 'GET', '', []);
    expect(result['Authorization']).toBe('Bearer abc');
  });

  it('substitutes env vars inside Bearer token', () => {
    const auth: AuthState = {
      type: 'bearer',
      token: '{{token}}',
      user: '',
      pass: '',
    };
    const result = buildHeaders([], auth, 'GET', '', envVars);
    expect(result['Authorization']).toBe('Bearer my-token');
  });

  it('adds Basic Authorization header (base64 user:pass)', () => {
    const auth: AuthState = {
      type: 'basic',
      token: '',
      user: 'user',
      pass: 'pass',
    };
    const result = buildHeaders([], auth, 'GET', '', []);
    expect(result['Authorization']).toBe('Basic ' + btoa('user:pass'));
  });

  it('auto-adds Content-Type: application/json for POST with body', () => {
    const result = buildHeaders(
      [],
      noAuth,
      'POST',
      '{"key":"value"}',
      [],
    );
    expect(result['Content-Type']).toBe('application/json');
  });

  it('auto-adds Content-Type for PUT with body', () => {
    const result = buildHeaders([], noAuth, 'PUT', '{"a":1}', []);
    expect(result['Content-Type']).toBe('application/json');
  });
});

// ──────────────────────────────────────────────────────────────
// buildHeaders — RED
// ──────────────────────────────────────────────────────────────
describe('buildHeaders — RED — edge cases', () => {
  it('skips disabled header rows (on=false)', () => {
    const headers: KeyValueRow[] = [
      {key: 'X-Skip', value: 'yes', on: false},
      {key: 'X-Keep', value: 'yes', on: true},
    ];
    const result = buildHeaders(headers, noAuth, 'GET', '', []);
    expect(result['X-Skip']).toBeUndefined();
    expect(result['X-Keep']).toBe('yes');
  });

  it('does NOT add Authorization when auth.type is none', () => {
    const result = buildHeaders([], noAuth, 'GET', '', []);
    expect(result['Authorization']).toBeUndefined();
  });

  it('does NOT add Authorization when bearer token is empty string', () => {
    const auth: AuthState = {type: 'bearer', token: '', user: '', pass: ''};
    const result = buildHeaders([], auth, 'GET', '', []);
    expect(result['Authorization']).toBeUndefined();
  });

  it('does NOT auto-add Content-Type for GET with a body string', () => {
    const result = buildHeaders(
      [],
      noAuth,
      'GET',
      '{"a":1}',
      [],
    );
    expect(result['Content-Type']).toBeUndefined();
  });

  it('does NOT auto-add Content-Type when body is empty/whitespace', () => {
    const result = buildHeaders([], noAuth, 'POST', '   ', []);
    expect(result['Content-Type']).toBeUndefined();
  });

  it('does NOT overwrite existing Content-Type header with auto value', () => {
    const headers: KeyValueRow[] = [
      {key: 'Content-Type', value: 'text/plain', on: true},
    ];
    const result = buildHeaders(headers, noAuth, 'POST', '{"a":1}', []);
    expect(result['Content-Type']).toBe('text/plain');
  });
});

// ──────────────────────────────────────────────────────────────
// fmtSize — GREEN
// ──────────────────────────────────────────────────────────────
describe('fmtSize — GREEN', () => {
  it('returns "X B" for values less than 1024', () => {
    expect(fmtSize(512)).toBe('512 B');
  });

  it('returns "X.X KB" for values >= 1024 and < 1 MB', () => {
    expect(fmtSize(2048)).toBe('2.0 KB');
  });

  it('returns "X.XX MB" for values >= 1 MB', () => {
    expect(fmtSize(2 * 1024 * 1024)).toBe('2.00 MB');
  });
});

// ──────────────────────────────────────────────────────────────
// fmtSize — RED — boundary values
// ──────────────────────────────────────────────────────────────
describe('fmtSize — RED — boundaries', () => {
  it('returns "0 B" for 0 bytes', () => {
    expect(fmtSize(0)).toBe('0 B');
  });

  it('returns "1023 B" for 1023 bytes (just below 1 KB)', () => {
    expect(fmtSize(1023)).toBe('1023 B');
  });

  it('returns "1.0 KB" for exactly 1024 bytes', () => {
    expect(fmtSize(1024)).toBe('1.0 KB');
  });

  it('returns "1 B" for 1 byte', () => {
    expect(fmtSize(1)).toBe('1 B');
  });
});

// ──────────────────────────────────────────────────────────────
// mock — GREEN
// ──────────────────────────────────────────────────────────────
describe('mock — GREEN', () => {
  it('returns GET /users/1 user object with status 200', () => {
    const res = mock('https://api.example.com/users/1', 'GET');
    expect(res.status).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.id).toBe(1);
    expect(body.name).toBe('Leanne Graham');
  });

  it('returns GET /users array with status 200', () => {
    const res = mock('https://api.example.com/users', 'GET');
    expect(res.status).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it('returns POST with status 201 and id 101', () => {
    const res = mock('https://api.example.com/posts', 'POST');
    expect(res.status).toBe(201);
    expect(res.statusText).toBe('Created');
    const body = JSON.parse(res.body);
    expect(body.id).toBe(101);
  });

  it('returns DELETE with status 200 and empty object body', () => {
    const res = mock('https://api.example.com/posts/1', 'DELETE');
    expect(res.status).toBe(200);
    expect(JSON.parse(res.body)).toEqual({});
  });

  it('always returns note: null (no sandbox banner for default mock)', () => {
    expect(mock('https://api.example.com', 'GET').note).toBeNull();
  });

  it('includes content-type header in mock response', () => {
    const res = mock('https://api.example.com', 'GET');
    const ct = res.headers.find((h) => h.name === 'content-type');
    expect(ct).toBeDefined();
    expect(ct?.value).toContain('application/json');
  });
});

// ──────────────────────────────────────────────────────────────
// mock — RED — edge cases
// ──────────────────────────────────────────────────────────────
describe('mock — RED — edge cases', () => {
  it('returns generic resource for unknown GET URL', () => {
    const res = mock('https://api.example.com/unknown/42', 'GET');
    expect(res.status).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('id');
  });

  it('mock response ok is always true', () => {
    expect(mock('https://api.example.com', 'DELETE').ok).toBe(true);
  });

  it('mock size matches the byte length of the body', () => {
    const res = mock('https://api.example.com/users/1', 'GET');
    const expected = new Blob([res.body]).size;
    expect(res.size).toBe(expected);
  });
});
