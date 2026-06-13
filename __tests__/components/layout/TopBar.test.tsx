/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {TopBar} from '@/components/layout/TopBar';
import {useAppStore, INITIAL_STATE} from '@/store/appStore';

beforeEach(() => {
  useAppStore.setState({...INITIAL_STATE});
});

// ──────────────────────────────────────────────────────────────
// GREEN
// ──────────────────────────────────────────────────────────────
describe('TopBar — GREEN', () => {
  it('renders the BigBoy logo text', () => {
    render(<TopBar />);
    expect(screen.getByText('BigBoy')).toBeInTheDocument();
  });

  it('renders the API Client badge', () => {
    render(<TopBar />);
    expect(screen.getByText('API Client')).toBeInTheDocument();
  });

  it('shows the current active environment (DEV by default)', () => {
    render(<TopBar />);
    expect(screen.getByText('DEV')).toBeInTheDocument();
  });

  it('renders all three theme buttons: VOID, PAPER, PUNCH', () => {
    render(<TopBar />);
    expect(screen.getByText('VOID')).toBeInTheDocument();
    expect(screen.getByText('PAPER')).toBeInTheDocument();
    expect(screen.getByText('PUNCH')).toBeInTheDocument();
  });

  it('clicking PAPER theme button sets theme to paper in store', () => {
    render(<TopBar />);
    fireEvent.click(screen.getByText('PAPER'));
    expect(useAppStore.getState().theme).toBe('paper');
  });

  it('clicking PUNCH theme button sets theme to punch in store', () => {
    render(<TopBar />);
    fireEvent.click(screen.getByText('PUNCH'));
    expect(useAppStore.getState().theme).toBe('punch');
  });

  it('clicking VOID theme button keeps/sets theme to void in store', () => {
    useAppStore.setState({theme: 'paper'});
    render(<TopBar />);
    fireEvent.click(screen.getByText('VOID'));
    expect(useAppStore.getState().theme).toBe('void');
  });

  it('clicking the env button toggles the dropdown open', () => {
    render(<TopBar />);
    expect(useAppStore.getState().envOpen).toBe(false);
    // click the env button (the DEV text is inside it)
    fireEvent.click(screen.getByText('DEV'));
    expect(useAppStore.getState().envOpen).toBe(true);
  });

  it('shows env options when dropdown is open', () => {
    useAppStore.setState({envOpen: true});
    render(<TopBar />);
    expect(screen.getAllByText('DEV').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('STAGING')).toBeInTheDocument();
    expect(screen.getByText('PROD')).toBeInTheDocument();
  });

  it('clicking STAGING in dropdown sets env to STAGING', () => {
    useAppStore.setState({envOpen: true});
    render(<TopBar />);
    fireEvent.click(screen.getByText('STAGING'));
    expect(useAppStore.getState().env).toBe('STAGING');
  });
});

// ──────────────────────────────────────────────────────────────
// RED — edge cases
// ──────────────────────────────────────────────────────────────
describe('TopBar — RED', () => {
  it('env dropdown is not shown when envOpen=false', () => {
    render(<TopBar />);
    expect(screen.queryByText('STAGING')).not.toBeInTheDocument();
  });

  it('click-away overlay closes the env dropdown', () => {
    useAppStore.setState({envOpen: true});
    const {container} = render(<TopBar />);
    // The fixed overlay div is the first fixed-position element
    const overlay = container.querySelector('[style*="position: fixed"]') as HTMLElement;
    fireEvent.click(overlay);
    expect(useAppStore.getState().envOpen).toBe(false);
  });
});
