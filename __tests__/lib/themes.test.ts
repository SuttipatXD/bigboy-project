import {THEMES, METHOD_COLORS, themeToCssVars} from '@/lib/themes';
import type {Theme} from '@/types';

const THEME_NAMES: Theme[] = ['void', 'paper', 'punch'];
const REQUIRED_TOKENS = [
  'bg', 'panel', 'panel2', 'fg', 'muted', 'border',
  'hover', 'accent', 'accentFg',
  'synKey', 'synStr', 'synNum', 'synBool', 'synNull', 'synPunct', 'gutter',
] as const;

// ──────────────────────────────────────────────────────────────
// THEMES — GREEN
// ──────────────────────────────────────────────────────────────
describe('THEMES — GREEN', () => {
  it('defines exactly three themes: void, paper, punch', () => {
    expect(Object.keys(THEMES)).toEqual(['void', 'paper', 'punch']);
  });

  it.each(THEME_NAMES)(
    '%s theme has all required token keys',
    (name) => {
      const theme = THEMES[name];
      for (const key of REQUIRED_TOKENS) {
        expect(theme).toHaveProperty(key);
      }
    },
  );

  it('VOID theme uses dark background and green accent', () => {
    expect(THEMES.void.bg).toBe('#0a0a0a');
    expect(THEMES.void.accent).toBe('#00d8a0');
  });

  it('PAPER theme uses a light background', () => {
    const bg = THEMES.paper.bg;
    // Light background starts with #f
    expect(bg.startsWith('#f')).toBe(true);
  });

  it('PUNCH theme uses lime accent', () => {
    expect(THEMES.punch.accent).toBe('#c6ff00');
  });

  it.each(THEME_NAMES)(
    '%s theme accent and accentFg are different colours',
    (name) => {
      expect(THEMES[name].accent).not.toBe(THEMES[name].accentFg);
    },
  );
});

// ──────────────────────────────────────────────────────────────
// METHOD_COLORS — GREEN
// ──────────────────────────────────────────────────────────────
describe('METHOD_COLORS — GREEN', () => {
  it('provides colours for all five HTTP methods', () => {
    const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    for (const m of methods) {
      expect(METHOD_COLORS[m]).toBeDefined();
      expect(typeof METHOD_COLORS[m]).toBe('string');
    }
  });

  it('GET is green', () => {
    expect(METHOD_COLORS['GET']).toBe('#00d8a0');
  });

  it('DELETE is red', () => {
    expect(METHOD_COLORS['DELETE']).toBe('#ff4d4d');
  });
});

// ──────────────────────────────────────────────────────────────
// themeToCssVars — GREEN
// ──────────────────────────────────────────────────────────────
describe('themeToCssVars — GREEN', () => {
  it('returns an object with CSS custom property keys (--prefix)', () => {
    const vars = themeToCssVars(THEMES.void);
    for (const key of Object.keys(vars)) {
      expect(key.startsWith('--')).toBe(true);
    }
  });

  it('maps accent to --accent', () => {
    const vars = themeToCssVars(THEMES.void);
    expect(vars['--accent']).toBe(THEMES.void.accent);
  });

  it('maps bg to --bg', () => {
    const vars = themeToCssVars(THEMES.paper);
    expect(vars['--bg']).toBe(THEMES.paper.bg);
  });

  it('produces 16 CSS variable entries (one per token)', () => {
    const vars = themeToCssVars(THEMES.punch);
    expect(Object.keys(vars).length).toBe(16);
  });
});

// ──────────────────────────────────────────────────────────────
// RED — edge cases
// ──────────────────────────────────────────────────────────────
describe('THEMES — RED — edge cases', () => {
  it('undefined method has no entry in METHOD_COLORS', () => {
    expect(METHOD_COLORS['OPTIONS']).toBeUndefined();
  });

  it('all theme token values are non-empty strings', () => {
    for (const name of THEME_NAMES) {
      const theme = THEMES[name];
      for (const key of REQUIRED_TOKENS) {
        const val = theme[key as keyof typeof theme];
        expect(typeof val).toBe('string');
        expect((val as string).length).toBeGreaterThan(0);
      }
    }
  });

  it('VOID and PAPER bg colours differ (dark vs light)', () => {
    expect(THEMES.void.bg).not.toBe(THEMES.paper.bg);
  });
});
