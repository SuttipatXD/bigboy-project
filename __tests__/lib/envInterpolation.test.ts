import {subst} from '@/lib/envInterpolation';
import type {EnvVar} from '@/types';

const vars: EnvVar[] = [
  {key: 'base_url', value: 'https://api.example.com', on: true},
  {key: 'token', value: 'secret-abc', on: true},
  {key: 'disabled', value: 'should-not-appear', on: false},
  {key: 'empty_key', value: 'ignored', on: true},
];

// ──────────────────────────────────────────────────────────────
// GREEN — expected correct behaviour
// ──────────────────────────────────────────────────────────────
describe('subst — GREEN', () => {
  it('replaces a single {{variable}} with its value', () => {
    expect(subst('{{base_url}}/users', vars)).toBe(
      'https://api.example.com/users',
    );
  });

  it('replaces multiple different variables in one string', () => {
    expect(subst('{{base_url}}/auth?token={{token}}', vars)).toBe(
      'https://api.example.com/auth?token=secret-abc',
    );
  });

  it('handles whitespace inside braces: {{ base_url }}', () => {
    expect(subst('{{ base_url }}/users', vars)).toBe(
      'https://api.example.com/users',
    );
  });

  it('returns the original string when no template placeholders are present', () => {
    expect(subst('plain-string', vars)).toBe('plain-string');
  });

  it('returns empty string for empty input', () => {
    expect(subst('', vars)).toBe('');
  });

  it('returns empty string for empty string with empty vars array', () => {
    expect(subst('', [])).toBe('');
  });

  it('replaces the same variable used twice', () => {
    expect(subst('{{base_url}}-{{base_url}}', vars)).toBe(
      'https://api.example.com-https://api.example.com',
    );
  });
});

// ──────────────────────────────────────────────────────────────
// RED — edge cases and failure paths
// ──────────────────────────────────────────────────────────────
describe('subst — RED — edge cases', () => {
  it('keeps {{unknown}} unchanged when variable is not in the list', () => {
    expect(subst('{{unknown}}', vars)).toBe('{{unknown}}');
  });

  it('does NOT substitute a disabled variable', () => {
    expect(subst('{{disabled}}', vars)).toBe('{{disabled}}');
  });

  it('does NOT substitute when vars array is empty', () => {
    expect(subst('{{base_url}}/users', [])).toBe('{{base_url}}/users');
  });

  it('does NOT substitute a row whose key is empty string (even if on=true)', () => {
    const withEmptyKey: EnvVar[] = [{key: '', value: 'x', on: true}];
    expect(subst('{{}}', withEmptyKey)).toBe('{{}}');
  });

  it('handles a string that is only braces with no content', () => {
    expect(subst('{{}}', vars)).toBe('{{}}');
  });

  it('handles a null-ish value (uses empty string as fallback via ??)', () => {
    // subst uses `String(str ?? '')` so undefined-like inputs return ''
    expect(subst(undefined as unknown as string, vars)).toBe('');
  });

  it('leaves partially matched patterns intact when var is missing', () => {
    expect(subst('prefix{{missing}}suffix', vars)).toBe(
      'prefix{{missing}}suffix',
    );
  });
});
