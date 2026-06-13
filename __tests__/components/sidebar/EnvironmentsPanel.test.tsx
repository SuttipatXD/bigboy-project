/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {EnvironmentsPanel} from '@/components/sidebar/EnvironmentsPanel';
import {useAppStore, INITIAL_STATE} from '@/store/appStore';

beforeEach(() => {
  useAppStore.setState({...INITIAL_STATE});
});

// ──────────────────────────────────────────────────────────────
// GREEN
// ──────────────────────────────────────────────────────────────
describe('EnvironmentsPanel — GREEN', () => {
  it('renders without crashing', () => {
    expect(() => render(<EnvironmentsPanel />)).not.toThrow();
  });

  it('shows the active environment name in the header', () => {
    render(<EnvironmentsPanel />);
    expect(screen.getByText(/DEV · Variables/)).toBeInTheDocument();
  });

  it('renders rows for DEV env vars (base_url and token)', () => {
    render(<EnvironmentsPanel />);
    const inputs = screen.getAllByRole('textbox');
    // 2 DEV vars × 2 inputs each = 4
    expect(inputs.length).toBe(4);
  });

  it('shows the base_url key', () => {
    render(<EnvironmentsPanel />);
    const keyInputs = screen.getAllByPlaceholderText('KEY');
    expect(keyInputs[0]).toHaveValue('base_url');
  });

  it('shows the base_url value', () => {
    render(<EnvironmentsPanel />);
    const valueInputs = screen.getAllByPlaceholderText('VALUE');
    expect(valueInputs[0]).toHaveValue('https://jsonplaceholder.typicode.com');
  });

  it('renders the + ADD VARIABLE button', () => {
    render(<EnvironmentsPanel />);
    expect(screen.getByText('+ ADD VARIABLE')).toBeInTheDocument();
  });

  it('clicking + ADD VARIABLE adds a row to the current env', () => {
    const before = useAppStore.getState().envVars['DEV']!.length;
    render(<EnvironmentsPanel />);
    fireEvent.click(screen.getByText('+ ADD VARIABLE'));
    expect(useAppStore.getState().envVars['DEV']).toHaveLength(before + 1);
  });

  it('editing a key input updates the env var in the store', () => {
    render(<EnvironmentsPanel />);
    const keyInputs = screen.getAllByPlaceholderText('KEY');
    fireEvent.change(keyInputs[0], {target: {value: 'api_key'}});
    expect(useAppStore.getState().envVars['DEV']![0].key).toBe('api_key');
  });

  it('clicking × removes the env var row', () => {
    const before = useAppStore.getState().envVars['DEV']!.length;
    render(<EnvironmentsPanel />);
    fireEvent.click(screen.getAllByText('×')[0]);
    expect(useAppStore.getState().envVars['DEV']).toHaveLength(before - 1);
  });

  it('shows USE IN REQUESTS usage hint', () => {
    render(<EnvironmentsPanel />);
    expect(screen.getByText(/USE IN REQUESTS/i)).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────────────────────
// RED
// ──────────────────────────────────────────────────────────────
describe('EnvironmentsPanel — RED', () => {
  it('renders correctly when active env has no variables', () => {
    useAppStore.setState({
      envVars: {DEV: [], STAGING: [], PROD: []},
      env: 'DEV',
    });
    expect(() => render(<EnvironmentsPanel />)).not.toThrow();
  });

  it('shows STAGING header when env is STAGING', () => {
    useAppStore.setState({env: 'STAGING'});
    render(<EnvironmentsPanel />);
    expect(screen.getByText(/STAGING · Variables/)).toBeInTheDocument();
  });
});
