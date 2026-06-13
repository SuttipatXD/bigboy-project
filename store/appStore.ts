'use client';

import {create} from 'zustand';
import type {
  ApiResponse,
  AuthState,
  EnvVar,
  HistoryEntry,
  HttpMethod,
  KeyValueRow,
  ReqTab,
  RespTab,
  SideTab,
  Theme,
} from '@/types';

export interface AppState {
  theme: Theme;
  method: HttpMethod;
  url: string;
  reqTab: ReqTab;
  sideTab: SideTab;
  respTab: RespTab;
  methodOpen: boolean;
  envOpen: boolean;
  env: string;
  loading: boolean;
  loadingTick: number;
  response: ApiResponse | null;
  params: KeyValueRow[];
  headers: KeyValueRow[];
  auth: AuthState;
  body: string;
  envVars: Record<string, EnvVar[]>;
  history: HistoryEntry[];
}

export interface AppActions {
  setTheme: (theme: Theme) => void;
  setMethod: (method: HttpMethod) => void;
  setUrl: (url: string) => void;
  setReqTab: (tab: ReqTab) => void;
  setSideTab: (tab: SideTab) => void;
  setRespTab: (tab: RespTab) => void;
  toggleMethodOpen: () => void;
  toggleEnvOpen: () => void;
  closeMenus: () => void;
  setEnv: (env: string) => void;
  setLoading: (loading: boolean) => void;
  setLoadingTick: (fn: (prev: number) => number) => void;
  setResponse: (response: ApiResponse | null) => void;
  // params
  updateParam: (index: number, field: 'key' | 'value', val: string) => void;
  toggleParam: (index: number) => void;
  removeParam: (index: number) => void;
  addParam: () => void;
  // headers
  updateHeader: (index: number, field: 'key' | 'value', val: string) => void;
  toggleHeader: (index: number) => void;
  removeHeader: (index: number) => void;
  addHeader: () => void;
  // auth
  setAuthType: (type: AuthState['type']) => void;
  setAuthToken: (token: string) => void;
  setAuthUser: (user: string) => void;
  setAuthPass: (pass: string) => void;
  // body
  setBody: (body: string) => void;
  // env vars
  updateEnvVar: (index: number, field: 'key' | 'value', val: string) => void;
  toggleEnvVar: (index: number) => void;
  removeEnvVar: (index: number) => void;
  addEnvVar: () => void;
  // history
  pushHistory: (entry: HistoryEntry) => void;
  // load a collection/history item
  loadRequest: (method: HttpMethod, url: string, tab?: ReqTab) => void;
}

export const INITIAL_STATE: AppState = {
  theme: 'void',
  method: 'GET',
  url: '{{base_url}}/users/1',
  reqTab: 'params',
  sideTab: 'collections',
  respTab: 'body',
  methodOpen: false,
  envOpen: false,
  env: 'DEV',
  loading: false,
  loadingTick: 0,
  response: null,
  params: [{key: '', value: '', on: true}],
  headers: [{key: 'Accept', value: 'application/json', on: true}],
  auth: {type: 'none', token: '{{token}}', user: '', pass: ''},
  body: '{\n  "title": "big boy",\n  "body": "shipping it",\n  "userId": 1\n}',
  envVars: {
    DEV: [
      {key: 'base_url', value: 'https://jsonplaceholder.typicode.com', on: true},
      {key: 'token', value: 'dev-7f3a-secret', on: true},
    ],
    STAGING: [
      {key: 'base_url', value: 'https://staging.api.bigboy.dev', on: true},
      {key: 'token', value: 'stg-9c21-token', on: true},
    ],
    PROD: [
      {key: 'base_url', value: 'https://api.bigboy.dev', on: true},
      {key: 'token', value: '', on: false},
    ],
  },
  history: [],
};

function updateRowIn(
  rows: KeyValueRow[],
  index: number,
  field: 'key' | 'value',
  val: string,
): KeyValueRow[] {
  return rows.map((r, i) => (i === index ? {...r, [field]: val} : r));
}

function toggleRowIn(rows: KeyValueRow[], index: number): KeyValueRow[] {
  return rows.map((r, i) => (i === index ? {...r, on: !r.on} : r));
}

function removeRowIn(rows: KeyValueRow[], index: number): KeyValueRow[] {
  return rows.filter((_, i) => i !== index);
}

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  ...INITIAL_STATE,

  setTheme: (theme) => set({theme}),
  setMethod: (method) => set({method, methodOpen: false}),
  setUrl: (url) => set({url}),
  setReqTab: (reqTab) => set({reqTab}),
  setSideTab: (sideTab) => set({sideTab}),
  setRespTab: (respTab) => set({respTab}),
  toggleMethodOpen: () =>
    set((s) => ({methodOpen: !s.methodOpen, envOpen: false})),
  toggleEnvOpen: () =>
    set((s) => ({envOpen: !s.envOpen, methodOpen: false})),
  closeMenus: () => set({methodOpen: false, envOpen: false}),
  setEnv: (env) => set({env, envOpen: false}),
  setLoading: (loading) => set({loading}),
  setLoadingTick: (fn) => set((s) => ({loadingTick: fn(s.loadingTick)})),
  setResponse: (response) => set({response}),

  updateParam: (index, field, val) =>
    set((s) => ({params: updateRowIn(s.params, index, field, val)})),
  toggleParam: (index) =>
    set((s) => ({params: toggleRowIn(s.params, index)})),
  removeParam: (index) =>
    set((s) => ({params: removeRowIn(s.params, index)})),
  addParam: () =>
    set((s) => ({params: [...s.params, {key: '', value: '', on: true}]})),

  updateHeader: (index, field, val) =>
    set((s) => ({headers: updateRowIn(s.headers, index, field, val)})),
  toggleHeader: (index) =>
    set((s) => ({headers: toggleRowIn(s.headers, index)})),
  removeHeader: (index) =>
    set((s) => ({headers: removeRowIn(s.headers, index)})),
  addHeader: () =>
    set((s) => ({headers: [...s.headers, {key: '', value: '', on: true}]})),

  setAuthType: (type) =>
    set((s) => ({auth: {...s.auth, type}})),
  setAuthToken: (token) =>
    set((s) => ({auth: {...s.auth, token}})),
  setAuthUser: (user) =>
    set((s) => ({auth: {...s.auth, user}})),
  setAuthPass: (pass) =>
    set((s) => ({auth: {...s.auth, pass}})),

  setBody: (body) => set({body}),

  updateEnvVar: (index, field, val) =>
    set((s) => {
      const vars = (s.envVars[s.env] ?? []).map((r, i) =>
        i === index ? {...r, [field]: val} : r,
      );
      return {envVars: {...s.envVars, [s.env]: vars}};
    }),
  toggleEnvVar: (index) =>
    set((s) => {
      const vars = (s.envVars[s.env] ?? []).map((r, i) =>
        i === index ? {...r, on: !r.on} : r,
      );
      return {envVars: {...s.envVars, [s.env]: vars}};
    }),
  removeEnvVar: (index) =>
    set((s) => {
      const vars = (s.envVars[s.env] ?? []).filter((_, i) => i !== index);
      return {envVars: {...s.envVars, [s.env]: vars}};
    }),
  addEnvVar: () =>
    set((s) => {
      const vars = [...(s.envVars[s.env] ?? []), {key: '', value: '', on: true}];
      return {envVars: {...s.envVars, [s.env]: vars}};
    }),

  pushHistory: (entry) =>
    set((s) => ({history: [entry, ...s.history].slice(0, 40)})),

  loadRequest: (method, url, tab) =>
    set({
      method,
      url,
      reqTab: tab ?? (method === 'GET' || method === 'DELETE' ? 'params' : 'body'),
      methodOpen: false,
      envOpen: false,
    }),
}));
