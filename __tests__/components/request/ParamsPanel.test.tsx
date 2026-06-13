/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {ParamsPanel} from '@/components/request/ParamsPanel';
import {useAppStore, INITIAL_STATE} from '@/store/appStore';

beforeEach(() => {
  useAppStore.setState({...INITIAL_STATE});
});

// ──────────────────────────────────────────────────────────────
// GREEN
// ──────────────────────────────────────────────────────────────
describe('ParamsPanel — GREEN', () => {
  it('renders without crashing', () => {
    expect(() => render(<ParamsPanel />)).not.toThrow();
  });

  it('renders the + ADD PARAM button', () => {
    render(<ParamsPanel />);
    expect(screen.getByText('+ ADD PARAM')).toBeInTheDocument();
  });

  it('renders one row per param in the store', () => {
    useAppStore.setState({
      params: [
        {key: 'page', value: '1', on: true},
        {key: 'limit', value: '20', on: true},
      ],
    });
    render(<ParamsPanel />);
    const inputs = screen.getAllByRole('textbox');
    // 2 rows × 2 inputs each = 4 textboxes
    expect(inputs.length).toBe(4);
  });

  it('clicking + ADD PARAM adds a row to the store', () => {
    const before = useAppStore.getState().params.length;
    render(<ParamsPanel />);
    fireEvent.click(screen.getByText('+ ADD PARAM'));
    expect(useAppStore.getState().params).toHaveLength(before + 1);
  });

  it('editing the key input updates the store', () => {
    useAppStore.setState({params: [{key: '', value: '', on: true}]});
    render(<ParamsPanel />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], {target: {value: 'myKey'}});
    expect(useAppStore.getState().params[0].key).toBe('myKey');
  });

  it('editing the value input updates the store', () => {
    useAppStore.setState({params: [{key: '', value: '', on: true}]});
    render(<ParamsPanel />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], {target: {value: 'myValue'}});
    expect(useAppStore.getState().params[0].value).toBe('myValue');
  });

  it('clicking × removes the param row from the store', () => {
    useAppStore.setState({params: [{key: 'x', value: '1', on: true}]});
    render(<ParamsPanel />);
    fireEvent.click(screen.getByText('×'));
    expect(useAppStore.getState().params).toHaveLength(0);
  });
});

// ──────────────────────────────────────────────────────────────
// RED
// ──────────────────────────────────────────────────────────────
describe('ParamsPanel — RED', () => {
  it('renders with empty params array without crashing', () => {
    useAppStore.setState({params: []});
    expect(() => render(<ParamsPanel />)).not.toThrow();
  });

  it('shows no row inputs when params is empty', () => {
    useAppStore.setState({params: []});
    render(<ParamsPanel />);
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
  });
});
