export type Theme = 'void' | 'paper' | 'punch';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ReqTab = 'params' | 'headers' | 'auth' | 'body';

export type SideTab = 'collections' | 'history' | 'env';

export type RespTab = 'body' | 'headers' | 'raw';

export type AuthType = 'none' | 'bearer' | 'basic';

export interface KeyValueRow {
  key: string;
  value: string;
  on: boolean;
}

export interface AuthState {
  type: AuthType;
  token: string;
  user: string;
  pass: string;
}

export interface EnvVar {
  key: string;
  value: string;
  on: boolean;
}

export interface HistoryEntry {
  id: string;
  method: HttpMethod;
  url: string;
  status: number;
  time: number;
  ts: number;
}

export interface ResponseHeader {
  name: string;
  value: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  ok: boolean;
  time: number;
  size: number;
  body: string;
  headers: ResponseHeader[];
  note: string | null;
}

export interface ThemeTokens {
  bg: string;
  panel: string;
  panel2: string;
  fg: string;
  muted: string;
  border: string;
  hover: string;
  accent: string;
  accentFg: string;
  synKey: string;
  synStr: string;
  synNum: string;
  synBool: string;
  synNull: string;
  synPunct: string;
  gutter: string;
}

export interface CollectionItem {
  method: HttpMethod;
  url: string;
}
