/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {HistoryPanel} from '@/components/sidebar/HistoryPanel';
import {useAppStore, INITIAL_STATE} from '@/store/appStore';
import type {HistoryEntry} from '@/types';

function makeEntry(n: number, status = 200): HistoryEntry {
  return {
    id: `id-${n}`,
    method: 'GET',
    url: `https://api.example.com/users/${n}`,
    status,
    time: n * 10,
    ts: 1700000000000 + n * 1000,
  };
}

beforeEach(() => {
  useAppStore.setState({...INITIAL_STATE});
});

// ──────────────────────────────────────────────────────────────
// GREEN
// ──────────────────────────────────────────────────────────────
describe('HistoryPanel — GREEN', () => {
  it('shows empty state message when history is empty', () => {
    render(<HistoryPanel />);
    expect(screen.getByText(/NO REQUESTS YET/i)).toBeInTheDocument();
  });

  it('renders a history entry when one exists', () => {
    useAppStore.setState({history: [makeEntry(1)]});
    render(<HistoryPanel />);
    expect(screen.queryByText(/NO REQUESTS YET/i)).not.toBeInTheDocument();
  });

  it('shows the HTTP method of the entry', () => {
    useAppStore.setState({history: [makeEntry(1)]});
    render(<HistoryPanel />);
    expect(screen.getByText('GET')).toBeInTheDocument();
  });

  it('shows the status code of the entry', () => {
    useAppStore.setState({history: [makeEntry(1, 201)]});
    render(<HistoryPanel />);
    expect(screen.getByText('201')).toBeInTheDocument();
  });

  it('shows the stripped URL path (no protocol)', () => {
    useAppStore.setState({history: [makeEntry(1)]});
    render(<HistoryPanel />);
    expect(screen.getByText(/api.example.com\/users\/1/)).toBeInTheDocument();
  });

  it('renders multiple entries', () => {
    useAppStore.setState({history: [makeEntry(1), makeEntry(2), makeEntry(3)]});
    render(<HistoryPanel />);
    const methods = screen.getAllByText('GET');
    expect(methods.length).toBe(3);
  });

  it('clicking an entry loads the request into the store', () => {
    useAppStore.setState({history: [makeEntry(1)]});
    render(<HistoryPanel />);
    // Click the row (the path text)
    fireEvent.click(screen.getByText(/api.example.com\/users\/1/));
    expect(useAppStore.getState().url).toBe('https://api.example.com/users/1');
    expect(useAppStore.getState().method).toBe('GET');
  });
});

// ──────────────────────────────────────────────────────────────
// RED
// ──────────────────────────────────────────────────────────────
describe('HistoryPanel — RED', () => {
  it('renders hint text in empty state', () => {
    render(<HistoryPanel />);
    expect(screen.getByText(/hit SEND to log one/i)).toBeInTheDocument();
  });

  it('shows 404 status code for client error entry', () => {
    useAppStore.setState({history: [makeEntry(1, 404)]});
    render(<HistoryPanel />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('shows 500 status code for server error entry', () => {
    useAppStore.setState({history: [makeEntry(1, 500)]});
    render(<HistoryPanel />);
    expect(screen.getByText('500')).toBeInTheDocument();
  });
});
