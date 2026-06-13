/**
 * Tests for the Zustand appStore — every action GREEN + RED.
 *
 * Pattern: reset to INITIAL_STATE before each test so tests are independent.
 */
import {useAppStore, INITIAL_STATE} from '@/store/appStore';
import type {HistoryEntry} from '@/types';

/** Fresh store state for every test. */
beforeEach(() => {
  useAppStore.setState({...INITIAL_STATE});
});

const s = () => useAppStore.getState();
const act = useAppStore.getState;

// ──────────────────────────────────────────────────────────────
// Initial state
// ──────────────────────────────────────────────────────────────
describe('INITIAL_STATE', () => {
  it('starts with theme void', () => {
    expect(s().theme).toBe('void');
  });

  it('starts with method GET', () => {
    expect(s().method).toBe('GET');
  });

  it('starts with history empty', () => {
    expect(s().history).toHaveLength(0);
  });

  it('starts with loading false', () => {
    expect(s().loading).toBe(false);
  });

  it('starts with methodOpen and envOpen both false', () => {
    expect(s().methodOpen).toBe(false);
    expect(s().envOpen).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────
// setTheme
// ──────────────────────────────────────────────────────────────
describe('setTheme — GREEN', () => {
  it('switches to paper theme', () => {
    s().setTheme('paper');
    expect(s().theme).toBe('paper');
  });

  it('switches to punch theme', () => {
    s().setTheme('punch');
    expect(s().theme).toBe('punch');
  });

  it('can cycle back to void', () => {
    s().setTheme('paper');
    s().setTheme('void');
    expect(s().theme).toBe('void');
  });
});

// ──────────────────────────────────────────────────────────────
// setMethod
// ──────────────────────────────────────────────────────────────
describe('setMethod — GREEN', () => {
  it('updates method to POST', () => {
    s().setMethod('POST');
    expect(s().method).toBe('POST');
  });

  it('closes the method dropdown when method is set', () => {
    useAppStore.setState({methodOpen: true});
    s().setMethod('PUT');
    expect(s().methodOpen).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────
// toggleMethodOpen / toggleEnvOpen / closeMenus
// ──────────────────────────────────────────────────────────────
describe('menu toggles — GREEN', () => {
  it('toggleMethodOpen opens the dropdown', () => {
    s().toggleMethodOpen();
    expect(s().methodOpen).toBe(true);
  });

  it('toggleMethodOpen also closes envOpen', () => {
    useAppStore.setState({envOpen: true});
    s().toggleMethodOpen();
    expect(s().envOpen).toBe(false);
    expect(s().methodOpen).toBe(true);
  });

  it('toggleEnvOpen opens env dropdown', () => {
    s().toggleEnvOpen();
    expect(s().envOpen).toBe(true);
  });

  it('toggleEnvOpen also closes methodOpen', () => {
    useAppStore.setState({methodOpen: true});
    s().toggleEnvOpen();
    expect(s().methodOpen).toBe(false);
    expect(s().envOpen).toBe(true);
  });

  it('closeMenus closes both dropdowns', () => {
    useAppStore.setState({methodOpen: true, envOpen: true});
    s().closeMenus();
    expect(s().methodOpen).toBe(false);
    expect(s().envOpen).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────
// setEnv
// ──────────────────────────────────────────────────────────────
describe('setEnv — GREEN', () => {
  it('sets the active env', () => {
    s().setEnv('STAGING');
    expect(s().env).toBe('STAGING');
  });

  it('closes envOpen after setting env', () => {
    useAppStore.setState({envOpen: true});
    s().setEnv('PROD');
    expect(s().envOpen).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────
// params CRUD
// ──────────────────────────────────────────────────────────────
describe('params CRUD — GREEN', () => {
  it('addParam appends an empty row', () => {
    const before = s().params.length;
    s().addParam();
    expect(s().params).toHaveLength(before + 1);
    const last = s().params[s().params.length - 1];
    expect(last).toEqual({key: '', value: '', on: true});
  });

  it('updateParam sets key at a given index', () => {
    s().addParam();
    const idx = s().params.length - 1;
    s().updateParam(idx, 'key', 'myKey');
    expect(s().params[idx].key).toBe('myKey');
  });

  it('updateParam sets value at a given index', () => {
    s().addParam();
    const idx = s().params.length - 1;
    s().updateParam(idx, 'value', 'myValue');
    expect(s().params[idx].value).toBe('myValue');
  });

  it('toggleParam flips on from true to false', () => {
    s().addParam();
    const idx = s().params.length - 1;
    expect(s().params[idx].on).toBe(true);
    s().toggleParam(idx);
    expect(s().params[idx].on).toBe(false);
  });

  it('toggleParam flips on back to true', () => {
    s().addParam();
    const idx = s().params.length - 1;
    s().toggleParam(idx);
    s().toggleParam(idx);
    expect(s().params[idx].on).toBe(true);
  });

  it('removeParam removes the row at the given index', () => {
    s().addParam();
    const before = s().params.length;
    s().removeParam(0);
    expect(s().params).toHaveLength(before - 1);
  });
});

describe('params CRUD — RED', () => {
  it('updateParam at out-of-range index leaves params unchanged', () => {
    const before = [...s().params];
    s().updateParam(999, 'key', 'x');
    expect(s().params).toEqual(before);
  });

  it('toggleParam at out-of-range index leaves params unchanged', () => {
    const before = [...s().params];
    s().toggleParam(999);
    expect(s().params).toEqual(before);
  });
});

// ──────────────────────────────────────────────────────────────
// headers CRUD
// ──────────────────────────────────────────────────────────────
describe('headers CRUD — GREEN', () => {
  it('addHeader appends a blank row', () => {
    const before = s().headers.length;
    s().addHeader();
    expect(s().headers).toHaveLength(before + 1);
  });

  it('updateHeader changes the key', () => {
    s().updateHeader(0, 'key', 'Content-Type');
    expect(s().headers[0].key).toBe('Content-Type');
  });

  it('toggleHeader flips the on flag', () => {
    const initial = s().headers[0].on;
    s().toggleHeader(0);
    expect(s().headers[0].on).toBe(!initial);
  });

  it('removeHeader removes the first row', () => {
    const before = s().headers.length;
    s().removeHeader(0);
    expect(s().headers).toHaveLength(before - 1);
  });
});

// ──────────────────────────────────────────────────────────────
// auth
// ──────────────────────────────────────────────────────────────
describe('auth — GREEN', () => {
  it('setAuthType changes auth type to bearer', () => {
    s().setAuthType('bearer');
    expect(s().auth.type).toBe('bearer');
  });

  it('setAuthToken updates the token field', () => {
    s().setAuthToken('tok-123');
    expect(s().auth.token).toBe('tok-123');
  });

  it('setAuthUser updates the user field', () => {
    s().setAuthUser('admin');
    expect(s().auth.user).toBe('admin');
  });

  it('setAuthPass updates the pass field', () => {
    s().setAuthPass('secret');
    expect(s().auth.pass).toBe('secret');
  });
});

// ──────────────────────────────────────────────────────────────
// body
// ──────────────────────────────────────────────────────────────
describe('setBody — GREEN', () => {
  it('sets body string', () => {
    s().setBody('{"foo":"bar"}');
    expect(s().body).toBe('{"foo":"bar"}');
  });

  it('can set body to empty string', () => {
    s().setBody('');
    expect(s().body).toBe('');
  });
});

// ──────────────────────────────────────────────────────────────
// envVars CRUD
// ──────────────────────────────────────────────────────────────
describe('envVars CRUD — GREEN', () => {
  it('addEnvVar adds a row to the active env', () => {
    const before = (s().envVars['DEV'] ?? []).length;
    s().addEnvVar();
    expect(s().envVars['DEV']).toHaveLength(before + 1);
  });

  it('updateEnvVar sets the key for a given index', () => {
    s().updateEnvVar(0, 'key', 'api_key');
    expect(s().envVars['DEV']![0].key).toBe('api_key');
  });

  it('toggleEnvVar flips on for the given row', () => {
    const initial = s().envVars['DEV']![0].on;
    s().toggleEnvVar(0);
    expect(s().envVars['DEV']![0].on).toBe(!initial);
  });

  it('removeEnvVar removes the row at the index', () => {
    const before = s().envVars['DEV']!.length;
    s().removeEnvVar(0);
    expect(s().envVars['DEV']).toHaveLength(before - 1);
  });

  it('envVars for other envs are unaffected by DEV changes', () => {
    const stagingBefore = [...(s().envVars['STAGING'] ?? [])];
    s().addEnvVar();
    expect(s().envVars['STAGING']).toEqual(stagingBefore);
  });
});

describe('envVars CRUD — RED', () => {
  it('removing a var at out-of-range index leaves envVars unchanged', () => {
    const before = [...(s().envVars['DEV'] ?? [])];
    s().removeEnvVar(999);
    expect(s().envVars['DEV']).toEqual(before);
  });
});

// ──────────────────────────────────────────────────────────────
// pushHistory
// ──────────────────────────────────────────────────────────────
const makeEntry = (n: number): HistoryEntry => ({
  id: `id-${n}`,
  method: 'GET',
  url: `https://example.com/${n}`,
  status: 200,
  time: n * 10,
  ts: Date.now() + n,
});

describe('pushHistory — GREEN', () => {
  it('adds an entry to the history array', () => {
    s().pushHistory(makeEntry(1));
    expect(s().history).toHaveLength(1);
  });

  it('prepends — most recent entry is first', () => {
    s().pushHistory(makeEntry(1));
    s().pushHistory(makeEntry(2));
    expect(s().history[0].id).toBe('id-2');
  });
});

describe('pushHistory — RED (cap at 40)', () => {
  it('caps history at 40 entries', () => {
    for (let i = 0; i < 45; i++) {
      s().pushHistory(makeEntry(i));
    }
    expect(s().history).toHaveLength(40);
  });

  it('oldest entries are dropped when cap is exceeded', () => {
    for (let i = 0; i < 45; i++) {
      s().pushHistory(makeEntry(i));
    }
    // last entry pushed was i=44, first in array should be id-44
    expect(s().history[0].id).toBe('id-44');
    // entry id-0 (oldest) should no longer be present
    expect(s().history.some((e) => e.id === 'id-0')).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────
// loadRequest
// ──────────────────────────────────────────────────────────────
describe('loadRequest — GREEN', () => {
  it('sets method and url', () => {
    s().loadRequest('POST', 'https://api.example.com/posts');
    expect(s().method).toBe('POST');
    expect(s().url).toBe('https://api.example.com/posts');
  });

  it('defaults reqTab to body for POST', () => {
    s().loadRequest('POST', 'https://api.example.com/posts');
    expect(s().reqTab).toBe('body');
  });

  it('defaults reqTab to params for GET', () => {
    s().loadRequest('GET', 'https://api.example.com/users');
    expect(s().reqTab).toBe('params');
  });

  it('defaults reqTab to params for DELETE', () => {
    s().loadRequest('DELETE', 'https://api.example.com/users/1');
    expect(s().reqTab).toBe('params');
  });

  it('respects explicit tab override', () => {
    s().loadRequest('POST', 'https://api.example.com', 'headers');
    expect(s().reqTab).toBe('headers');
  });

  it('closes all menus', () => {
    useAppStore.setState({methodOpen: true, envOpen: true});
    s().loadRequest('GET', 'https://api.example.com');
    expect(s().methodOpen).toBe(false);
    expect(s().envOpen).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────
// setResponse / setLoading / setLoadingTick / setRespTab / setReqTab / setSideTab / setUrl
// ──────────────────────────────────────────────────────────────
describe('misc setters — GREEN', () => {
  it('setUrl updates url', () => {
    s().setUrl('https://new.example.com');
    expect(s().url).toBe('https://new.example.com');
  });

  it('setLoading true then false', () => {
    s().setLoading(true);
    expect(s().loading).toBe(true);
    s().setLoading(false);
    expect(s().loading).toBe(false);
  });

  it('setLoadingTick uses updater function', () => {
    s().setLoadingTick((prev) => prev + 1);
    expect(s().loadingTick).toBe(1);
  });

  it('setResponse stores the response', () => {
    const resp = {
      status: 200,
      statusText: 'OK',
      ok: true,
      time: 42,
      size: 100,
      body: '{}',
      headers: [],
      note: null,
    };
    s().setResponse(resp);
    expect(s().response).toEqual(resp);
  });

  it('setResponse null clears response', () => {
    s().setResponse(null);
    expect(s().response).toBeNull();
  });

  it('setReqTab updates the tab', () => {
    s().setReqTab('body');
    expect(s().reqTab).toBe('body');
  });

  it('setSideTab updates the tab', () => {
    s().setSideTab('history');
    expect(s().sideTab).toBe('history');
  });

  it('setRespTab updates the response tab', () => {
    s().setRespTab('raw');
    expect(s().respTab).toBe('raw');
  });
});
