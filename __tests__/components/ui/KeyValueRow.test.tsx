/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {KeyValueRow} from '@/components/ui/KeyValueRow';

const defaultProps = {
  rowKey: 'Content-Type',
  value: 'application/json',
  on: true,
  onToggle: jest.fn(),
  onKeyChange: jest.fn(),
  onValueChange: jest.fn(),
  onRemove: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ──────────────────────────────────────────────────────────────
// GREEN — renders correct content
// ──────────────────────────────────────────────────────────────
describe('KeyValueRow — GREEN', () => {
  it('renders the key input with the given value', () => {
    render(<KeyValueRow {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    const keyInput = inputs[0];
    expect(keyInput).toHaveValue('Content-Type');
  });

  it('renders the value input with the given value', () => {
    render(<KeyValueRow {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    const valueInput = inputs[1];
    expect(valueInput).toHaveValue('application/json');
  });

  it('calls onKeyChange when key input changes', () => {
    render(<KeyValueRow {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], {target: {value: 'X-Custom'}});
    expect(defaultProps.onKeyChange).toHaveBeenCalledWith('X-Custom');
  });

  it('calls onValueChange when value input changes', () => {
    render(<KeyValueRow {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], {target: {value: 'text/plain'}});
    expect(defaultProps.onValueChange).toHaveBeenCalledWith('text/plain');
  });

  it('calls onToggle when the checkbox div is clicked', () => {
    const {container} = render(<KeyValueRow {...defaultProps} />);
    // Checkbox is the first div child inside the component's root flex div
    const checkbox = container.querySelector('div > div > div') as HTMLElement;
    fireEvent.click(checkbox);
    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove when the × button is clicked', () => {
    render(<KeyValueRow {...defaultProps} />);
    const removeBtn = screen.getByText('×');
    fireEvent.click(removeBtn);
    expect(defaultProps.onRemove).toHaveBeenCalledTimes(1);
  });

  it('renders default placeholder KEY when keyPlaceholder not given', () => {
    render(<KeyValueRow {...defaultProps} rowKey="" />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveAttribute('placeholder', 'KEY');
  });

  it('renders default placeholder VALUE when valuePlaceholder not given', () => {
    render(<KeyValueRow {...defaultProps} value="" />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[1]).toHaveAttribute('placeholder', 'VALUE');
  });

  it('renders custom placeholder when provided', () => {
    render(
      <KeyValueRow
        {...defaultProps}
        keyPlaceholder="PARAM"
        valuePlaceholder="VAL"
      />,
    );
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveAttribute('placeholder', 'PARAM');
    expect(inputs[1]).toHaveAttribute('placeholder', 'VAL');
  });
});

// ──────────────────────────────────────────────────────────────
// RED — edge cases
// ──────────────────────────────────────────────────────────────
describe('KeyValueRow — RED', () => {
  it('renders with on=false (checkbox visually unchecked)', () => {
    const {container} = render(
      <KeyValueRow {...defaultProps} on={false} />,
    );
    // Checkbox is the first div inside the root flex container
    const checkbox = container.querySelector('div > div > div') as HTMLElement;
    expect(checkbox.style.background).toBe('transparent');
  });

  it('renders with empty key and value without crashing', () => {
    expect(() =>
      render(<KeyValueRow {...defaultProps} rowKey="" value="" />),
    ).not.toThrow();
  });

  it('does not call onKeyChange when value input changes', () => {
    render(<KeyValueRow {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], {target: {value: 'something'}});
    expect(defaultProps.onKeyChange).not.toHaveBeenCalled();
  });
});
