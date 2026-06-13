/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {AuthPanel} from '@/components/request/AuthPanel';
import {useAppStore, INITIAL_STATE} from '@/store/appStore';

beforeEach(() => {
  useAppStore.setState({...INITIAL_STATE});
});

// ──────────────────────────────────────────────────────────────
// GREEN
// ──────────────────────────────────────────────────────────────
describe('AuthPanel — GREEN', () => {
  it('renders NONE, BEARER, BASIC tabs', () => {
    render(<AuthPanel />);
    expect(screen.getByText('NONE')).toBeInTheDocument();
    expect(screen.getByText('BEARER')).toBeInTheDocument();
    expect(screen.getByText('BASIC')).toBeInTheDocument();
  });

  it('shows "No authorization" message when auth type is none', () => {
    render(<AuthPanel />);
    expect(
      screen.getByText(/No authorization sent/i),
    ).toBeInTheDocument();
  });

  it('clicking BEARER sets auth type to bearer in store', () => {
    render(<AuthPanel />);
    fireEvent.click(screen.getByText('BEARER'));
    expect(useAppStore.getState().auth.type).toBe('bearer');
  });

  it('clicking BASIC sets auth type to basic in store', () => {
    render(<AuthPanel />);
    fireEvent.click(screen.getByText('BASIC'));
    expect(useAppStore.getState().auth.type).toBe('basic');
  });

  it('shows token input when auth type is bearer', () => {
    useAppStore.setState({auth: {type: 'bearer', token: '', user: '', pass: ''}});
    render(<AuthPanel />);
    expect(
      screen.getByPlaceholderText(/paste token/i),
    ).toBeInTheDocument();
  });

  it('typing in token input updates auth.token in store', () => {
    useAppStore.setState({auth: {type: 'bearer', token: '', user: '', pass: ''}});
    render(<AuthPanel />);
    const input = screen.getByPlaceholderText(/paste token/i);
    fireEvent.change(input, {target: {value: 'my-secret'}});
    expect(useAppStore.getState().auth.token).toBe('my-secret');
  });

  it('shows username and password inputs when auth type is basic', () => {
    useAppStore.setState({auth: {type: 'basic', token: '', user: '', pass: ''}});
    render(<AuthPanel />);
    expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
  });

  it('typing in username input updates auth.user in store', () => {
    useAppStore.setState({auth: {type: 'basic', token: '', user: '', pass: ''}});
    render(<AuthPanel />);
    fireEvent.change(screen.getByPlaceholderText('username'), {
      target: {value: 'admin'},
    });
    expect(useAppStore.getState().auth.user).toBe('admin');
  });

  it('typing in password input updates auth.pass in store', () => {
    useAppStore.setState({auth: {type: 'basic', token: '', user: '', pass: ''}});
    render(<AuthPanel />);
    fireEvent.change(screen.getByPlaceholderText('password'), {
      target: {value: 'secret'},
    });
    expect(useAppStore.getState().auth.pass).toBe('secret');
  });

  it('shows Authorization preview for bearer token', () => {
    useAppStore.setState({
      auth: {type: 'bearer', token: 'abc', user: '', pass: ''},
    });
    render(<AuthPanel />);
    expect(screen.getByText(/Bearer/)).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────────────────────
// RED
// ──────────────────────────────────────────────────────────────
describe('AuthPanel — RED', () => {
  it('does not show token input when auth type is none', () => {
    render(<AuthPanel />);
    expect(screen.queryByPlaceholderText(/paste token/i)).not.toBeInTheDocument();
  });

  it('does not show username/password when auth type is bearer', () => {
    useAppStore.setState({auth: {type: 'bearer', token: '', user: '', pass: ''}});
    render(<AuthPanel />);
    expect(screen.queryByPlaceholderText('username')).not.toBeInTheDocument();
  });

  it('shows — in preview when bearer token is empty', () => {
    useAppStore.setState({auth: {type: 'bearer', token: '', user: '', pass: ''}});
    render(<AuthPanel />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
