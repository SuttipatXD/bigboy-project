/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, screen} from '@testing-library/react';
import {JsonViewer} from '@/components/response/JsonViewer';

// ──────────────────────────────────────────────────────────────
// GREEN
// ──────────────────────────────────────────────────────────────
describe('JsonViewer — GREEN', () => {
  it('renders without crashing', () => {
    expect(() => render(<JsonViewer text='{"id":1}' />)).not.toThrow();
  });

  it('displays line numbers starting from 1', () => {
    render(<JsonViewer text='{"id":1}' />);
    // Multiple elements may contain "1" (line num + JSON value) — just confirm it exists
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });

  it('pretty-prints valid JSON across multiple lines', () => {
    render(<JsonViewer text='{"a":1,"b":2}' />);
    // pretty-printed JSON has ≥ 4 lines, so line numbers 3 and 4 appear uniquely
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders text content of a JSON key', () => {
    render(<JsonViewer text='{"name":"Alice"}' />);
    expect(screen.getByText(/"name"/)).toBeInTheDocument();
  });

  it('renders text content of a JSON string value', () => {
    render(<JsonViewer text='{"name":"Alice"}' />);
    expect(screen.getByText(/"Alice"/)).toBeInTheDocument();
  });

  it('renders all lines for a 3-line object', () => {
    render(<JsonViewer text='{"a":1}' />);
    // JSON.stringify({"a":1}, null, 2) → 3 lines
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────────────────────
// RED — malformed / edge case input
// ──────────────────────────────────────────────────────────────
describe('JsonViewer — RED', () => {
  it('does not crash on invalid JSON', () => {
    expect(() => render(<JsonViewer text="not json {{{" />)).not.toThrow();
  });

  it('renders raw text when JSON is invalid', () => {
    render(<JsonViewer text="plain text" />);
    expect(screen.getByText('plain text')).toBeInTheDocument();
  });

  it('renders an empty viewer for empty string', () => {
    render(<JsonViewer text="" />);
    // empty string split by \n gives one empty line, line number 1 shown
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('handles a JSON array at top level', () => {
    expect(() => render(<JsonViewer text='[1,2,3]' />)).not.toThrow();
  });
});
