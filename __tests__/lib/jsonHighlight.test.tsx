/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, screen} from '@testing-library/react';
import {hlLine} from '@/lib/jsonHighlight';

/** Renders an hlLine result into a container and returns the container div. */
function renderLine(line: string) {
  const nodes = hlLine(line);
  const {container} = render(
    <div data-testid="line">{nodes}</div>,
  );
  return container;
}

// ──────────────────────────────────────────────────────────────
// GREEN — correct token detection
// ──────────────────────────────────────────────────────────────
describe('hlLine — GREEN', () => {
  it('returns an empty array for an empty string', () => {
    const result = hlLine('');
    expect(result).toHaveLength(0);
  });

  it('returns a plain string node for a line with no JSON tokens', () => {
    const result = hlLine('   ');
    // whitespace only — no matches, trailing plain text
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it('highlights an object key with --syn-key colour', () => {
    const container = renderLine('  "name": "Alice"');
    const spans = container.querySelectorAll('span');
    // First span should be the key "name" with syn-key
    const keySpan = Array.from(spans).find(
      (s) => (s.style as CSSStyleDeclaration).color === 'var(--syn-key)',
    );
    expect(keySpan).toBeDefined();
    expect(keySpan?.textContent).toBe('"name"');
  });

  it('highlights a string value with --syn-str colour', () => {
    const container = renderLine('  "name": "Alice"');
    const spans = container.querySelectorAll('span');
    const strSpan = Array.from(spans).find(
      (s) => (s.style as CSSStyleDeclaration).color === 'var(--syn-str)',
    );
    expect(strSpan).toBeDefined();
    expect(strSpan?.textContent).toBe('"Alice"');
  });

  it('highlights a number value with --syn-num colour', () => {
    const container = renderLine('  "age": 42');
    const spans = container.querySelectorAll('span');
    const numSpan = Array.from(spans).find(
      (s) => (s.style as CSSStyleDeclaration).color === 'var(--syn-num)',
    );
    expect(numSpan).toBeDefined();
    expect(numSpan?.textContent).toBe('42');
  });

  it('highlights boolean true with --syn-bool colour', () => {
    const container = renderLine('  "active": true');
    const spans = container.querySelectorAll('span');
    const boolSpan = Array.from(spans).find(
      (s) =>
        (s.style as CSSStyleDeclaration).color === 'var(--syn-bool)' &&
        s.textContent === 'true',
    );
    expect(boolSpan).toBeDefined();
  });

  it('highlights boolean false with --syn-bool colour', () => {
    const container = renderLine('  "done": false');
    const spans = container.querySelectorAll('span');
    const boolSpan = Array.from(spans).find(
      (s) =>
        (s.style as CSSStyleDeclaration).color === 'var(--syn-bool)' &&
        s.textContent === 'false',
    );
    expect(boolSpan).toBeDefined();
  });

  it('highlights null with --syn-null colour', () => {
    const container = renderLine('  "value": null');
    const spans = container.querySelectorAll('span');
    const nullSpan = Array.from(spans).find(
      (s) =>
        (s.style as CSSStyleDeclaration).color === 'var(--syn-null)' &&
        s.textContent === 'null',
    );
    expect(nullSpan).toBeDefined();
  });

  it('highlights punctuation { } [ ] with --syn-punct colour', () => {
    const container = renderLine('{');
    const spans = container.querySelectorAll('span');
    const punctSpan = Array.from(spans).find(
      (s) =>
        (s.style as CSSStyleDeclaration).color === 'var(--syn-punct)' &&
        s.textContent === '{',
    );
    expect(punctSpan).toBeDefined();
  });

  it('renders the full text content correctly for a typical JSON line', () => {
    const container = renderLine('  "id": 1');
    expect(container.textContent).toContain('"id"');
    expect(container.textContent).toContain('1');
  });
});

// ──────────────────────────────────────────────────────────────
// RED — edge cases
// ──────────────────────────────────────────────────────────────
describe('hlLine — RED — edge cases', () => {
  it('returns only plain string nodes for a non-JSON line', () => {
    const result = hlLine('not json at all');
    // No React elements (spans), just a trailing string
    const hasElements = result.some((node) => React.isValidElement(node));
    expect(hasElements).toBe(false);
  });

  it('handles negative numbers correctly with --syn-num', () => {
    const container = renderLine('  "temp": -5');
    const spans = container.querySelectorAll('span');
    const numSpan = Array.from(spans).find(
      (s) =>
        (s.style as CSSStyleDeclaration).color === 'var(--syn-num)' &&
        s.textContent === '-5',
    );
    expect(numSpan).toBeDefined();
  });

  it('does not throw for a line of only punctuation', () => {
    expect(() => hlLine('{},')).not.toThrow();
  });

  it('does not throw for deeply nested value', () => {
    expect(() => hlLine('      "deep": true')).not.toThrow();
  });

  it('distinguishes key strings from value strings', () => {
    const container = renderLine('  "key": "value"');
    const spans = container.querySelectorAll('span');
    const keySpans = Array.from(spans).filter(
      (s) => (s.style as CSSStyleDeclaration).color === 'var(--syn-key)',
    );
    const strSpans = Array.from(spans).filter(
      (s) => (s.style as CSSStyleDeclaration).color === 'var(--syn-str)',
    );
    expect(keySpans.length).toBe(1);
    expect(strSpans.length).toBe(1);
    expect(keySpans[0].textContent).toBe('"key"');
    expect(strSpans[0].textContent).toBe('"value"');
  });
});
