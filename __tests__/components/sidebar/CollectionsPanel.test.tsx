/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {CollectionsPanel} from '@/components/sidebar/CollectionsPanel';
import {useAppStore, INITIAL_STATE} from '@/store/appStore';

beforeEach(() => {
  useAppStore.setState({...INITIAL_STATE});
});

// ──────────────────────────────────────────────────────────────
// GREEN
// ──────────────────────────────────────────────────────────────
describe('CollectionsPanel — GREEN', () => {
  it('renders without crashing', () => {
    expect(() => render(<CollectionsPanel />)).not.toThrow();
  });

  it('shows the JSONPlaceholder group header', () => {
    render(<CollectionsPanel />);
    expect(screen.getByText(/JSONPlaceholder/)).toBeInTheDocument();
  });

  it('renders 8 collection items', () => {
    render(<CollectionsPanel />);
    // Each item shows its method: count all GET/POST/PUT/PATCH/DELETE labels
    const methods = screen.getAllByText(/^(GET|POST|PUT|PATCH|DELETE)$/);
    expect(methods).toHaveLength(8);
  });

  it('renders GET /users/1 item', () => {
    render(<CollectionsPanel />);
    expect(screen.getByText('/users/1')).toBeInTheDocument();
  });

  it('renders POST /posts item', () => {
    render(<CollectionsPanel />);
    expect(screen.getByText('/posts')).toBeInTheDocument();
  });

  it('clicking a GET item sets method to GET in store', () => {
    render(<CollectionsPanel />);
    // Click /users/1 item
    fireEvent.click(screen.getByText('/users/1'));
    expect(useAppStore.getState().method).toBe('GET');
  });

  it('clicking a DELETE item sets method to DELETE in store', () => {
    render(<CollectionsPanel />);
    // The DELETE item — click the DELETE label (or the parent row)
    const deleteItems = screen.getAllByText('DELETE');
    fireEvent.click(deleteItems[0]);
    expect(useAppStore.getState().method).toBe('DELETE');
  });

  it('clicking /users/1 sets url with {{base_url}} in store', () => {
    render(<CollectionsPanel />);
    fireEvent.click(screen.getByText('/users/1'));
    expect(useAppStore.getState().url).toBe('{{base_url}}/users/1');
  });
});

// ──────────────────────────────────────────────────────────────
// RED
// ──────────────────────────────────────────────────────────────
describe('CollectionsPanel — RED', () => {
  it('strips {{base_url}} prefix from displayed paths', () => {
    render(<CollectionsPanel />);
    // None of the displayed items should show "{{base_url}}" literally
    expect(screen.queryByText(/\{\{base_url\}\}/)).not.toBeInTheDocument();
  });
});
