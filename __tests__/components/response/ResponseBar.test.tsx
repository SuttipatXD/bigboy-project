/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {ResponseBar} from '@/components/response/ResponseBar';
import {useAppStore, INITIAL_STATE} from '@/store/appStore';
import type {ApiResponse} from '@/types';

const mockResponse: ApiResponse = {
  status: 200,
  statusText: 'OK',
  ok: true,
  time: 145,
  size: 1024,
  body: '{"id":1}',
  headers: [{name: 'content-type', value: 'application/json'}],
  note: null,
};

beforeEach(() => {
  useAppStore.setState({...INITIAL_STATE});
});

// ──────────────────────────────────────────────────────────────
// GREEN
// ──────────────────────────────────────────────────────────────
describe('ResponseBar — GREEN', () => {
  it('renders the Response label', () => {
    render(<ResponseBar />);
    expect(screen.getByText('Response')).toBeInTheDocument();
  });

  it('shows status code when response is set', () => {
    useAppStore.setState({response: mockResponse});
    render(<ResponseBar />);
    expect(screen.getByText(/200/)).toBeInTheDocument();
  });

  it('shows status text when response is set', () => {
    useAppStore.setState({response: mockResponse});
    render(<ResponseBar />);
    expect(screen.getByText(/200 OK/)).toBeInTheDocument();
  });

  it('shows response time in ms', () => {
    useAppStore.setState({response: mockResponse});
    render(<ResponseBar />);
    expect(screen.getByText('145 ms')).toBeInTheDocument();
  });

  it('shows formatted response size', () => {
    useAppStore.setState({response: mockResponse});
    render(<ResponseBar />);
    expect(screen.getByText('1.0 KB')).toBeInTheDocument();
  });

  it('shows BODY tab when response is set', () => {
    useAppStore.setState({response: mockResponse});
    render(<ResponseBar />);
    expect(screen.getByText('BODY')).toBeInTheDocument();
  });

  it('shows HEADERS and RAW tabs when response is set', () => {
    useAppStore.setState({response: mockResponse});
    render(<ResponseBar />);
    expect(screen.getByText('HEADERS')).toBeInTheDocument();
    expect(screen.getByText('RAW')).toBeInTheDocument();
  });

  it('clicking RAW tab updates respTab in store', () => {
    useAppStore.setState({response: mockResponse});
    render(<ResponseBar />);
    fireEvent.click(screen.getByText('RAW'));
    expect(useAppStore.getState().respTab).toBe('raw');
  });

  it('clicking HEADERS tab updates respTab in store', () => {
    useAppStore.setState({response: mockResponse});
    render(<ResponseBar />);
    fireEvent.click(screen.getByText('HEADERS'));
    expect(useAppStore.getState().respTab).toBe('headers');
  });
});

// ──────────────────────────────────────────────────────────────
// RED — no response / error status
// ──────────────────────────────────────────────────────────────
describe('ResponseBar — RED', () => {
  it('does not show tabs when response is null', () => {
    render(<ResponseBar />);
    expect(screen.queryByText('BODY')).not.toBeInTheDocument();
  });

  it('does not show status code when response is null', () => {
    render(<ResponseBar />);
    expect(screen.queryByText(/200/)).not.toBeInTheDocument();
  });

  it('shows 500 status for server error responses', () => {
    useAppStore.setState({
      response: {...mockResponse, status: 500, statusText: 'Internal Server Error'},
    });
    render(<ResponseBar />);
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it('shows 404 status for client error responses', () => {
    useAppStore.setState({
      response: {...mockResponse, status: 404, statusText: 'Not Found'},
    });
    render(<ResponseBar />);
    expect(screen.getByText(/404 Not Found/)).toBeInTheDocument();
  });
});
