/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, screen} from '@testing-library/react';
import {RawViewer} from '@/components/response/RawViewer';

describe('RawViewer — GREEN', () => {
  it('renders the given text verbatim', () => {
    render(<RawViewer text="hello world" />);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  it('renders inside a <pre> element', () => {
    const {container} = render(<RawViewer text="test" />);
    expect(container.querySelector('pre')).not.toBeNull();
  });

  it('renders JSON string unchanged', () => {
    const json = '{"id":1,"name":"Alice"}';
    render(<RawViewer text={json} />);
    expect(screen.getByText(json)).toBeInTheDocument();
  });

  it('renders multi-line text', () => {
    render(<RawViewer text={'line1\nline2'} />);
    expect(screen.getByText(/line1/)).toBeInTheDocument();
  });
});

describe('RawViewer — RED', () => {
  it('renders empty string without crashing', () => {
    expect(() => render(<RawViewer text="" />)).not.toThrow();
  });

  it('renders special HTML characters safely', () => {
    render(<RawViewer text="<script>alert(1)</script>" />);
    // Should be in the document as text, not executed
    expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument();
  });
});
