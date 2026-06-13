import type {EnvVar} from '@/types';

/** Replaces {{name}} placeholders in `str` with matching enabled env vars. */
export function subst(str: string, vars: EnvVar[]): string {
  const enabled = vars.filter((v) => v.on && v.key);
  return String(str ?? '').replace(
    /\{\{\s*([\w.\-]+)\s*\}\}/g,
    (_match, name: string) => {
      const found = enabled.find((v) => v.key === name);
      return found ? found.value : _match;
    },
  );
}
