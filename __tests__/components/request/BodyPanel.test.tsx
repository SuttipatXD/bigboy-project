/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {BodyPanel} from '@/components/request/BodyPanel';
import {useAppStore, INITIAL_STATE} from '@/store/appStore';

beforeEach(() => {
  useAppStore.setState({...INITIAL_STATE});
});

// ──────────────────────────────────────────────────────────────
// GREEN
// ──────────────────────────────────────────────────────────────
describe('BodyPanel — GREEN', () => {
  it('renders without crashing', () => {
    expect(() => render(<BodyPanel />)).not.toThrow();
  });

  it('renders the JSON Body label', () => {
    render(<BodyPanel />);
    expect(screen.getByText('JSON Body')).toBeInTheDocument();
  });

  it('renders the BEAUTIFY button', () => {
    render(<BodyPanel />);
    expect(screen.getByText('BEAUTIFY')).toBeInTheDocument();
  });

  it('renders a textarea with the current body from store', () => {
    useAppStore.setState({body: '{"a":1}'});
    render(<BodyPanel />);
    expect(screen.getByRole('textbox')).toHaveValue('{"a":1}');
  });

  it('typing in textarea updates body in store', () => {
    render(<BodyPanel />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, {target: {value: '{"x":2}'}});
    expect(useAppStore.getState().body).toBe('{"x":2}');
  });

  it('BEAUTIFY button pretty-prints valid JSON', () => {
    useAppStore.setState({body: '{"b":2,"a":1}'});
    render(<BodyPanel />);
    fireEvent.click(screen.getByText('BEAUTIFY'));
    const beautified = useAppStore.getState().body;
    expect(beautified).toContain('\n');
    expect(JSON.parse(beautified)).toEqual({b: 2, a: 1});
  });
});

// ──────────────────────────────────────────────────────────────
// RED
// ──────────────────────────────────────────────────────────────
describe('BodyPanel — RED', () => {
  it('BEAUTIFY is a no-op for malformed JSON', () => {
    useAppStore.setState({body: 'not json {{{{'});
    render(<BodyPanel />);
    fireEvent.click(screen.getByText('BEAUTIFY'));
    expect(useAppStore.getState().body).toBe('not json {{{{');
  });

  it('BEAUTIFY is a no-op for empty body', () => {
    useAppStore.setState({body: ''});
    render(<BodyPanel />);
    fireEvent.click(screen.getByText('BEAUTIFY'));
    expect(useAppStore.getState().body).toBe('');
  });
});
