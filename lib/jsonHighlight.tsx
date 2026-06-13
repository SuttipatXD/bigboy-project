import React from 'react';

const TOKEN_RE =
  /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+\.?\d*(?:[eE][+\-]?\d+)?)|(true|false|null)|([{}\[\],])/g;

/** Returns an array of React nodes with syntax-highlighted spans for one JSON line. */
export function hlLine(line: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  TOKEN_RE.lastIndex = 0;

  while ((match = TOKEN_RE.exec(line)) !== null) {
    if (match.index > last) {
      out.push(line.slice(last, match.index));
    }

    if (match[1] !== undefined) {
      const isKey = Boolean(match[2]);
      out.push(
        <span
          key={key++}
          style={{color: isKey ? 'var(--syn-key)' : 'var(--syn-str)'}}
        >
          {match[1]}
        </span>,
      );
      if (isKey) {
        out.push(
          <span key={key++} style={{color: 'var(--syn-punct)'}}>
            {match[2]}
          </span>,
        );
      }
    } else if (match[3] !== undefined) {
      out.push(
        <span key={key++} style={{color: 'var(--syn-num)'}}>
          {match[3]}
        </span>,
      );
    } else if (match[4] !== undefined) {
      out.push(
        <span
          key={key++}
          style={{color: match[4] === 'null' ? 'var(--syn-null)' : 'var(--syn-bool)'}}
        >
          {match[4]}
        </span>,
      );
    } else if (match[5] !== undefined) {
      out.push(
        <span key={key++} style={{color: 'var(--syn-punct)'}}>
          {match[5]}
        </span>,
      );
    }

    last = TOKEN_RE.lastIndex;
  }

  if (last < line.length) {
    out.push(line.slice(last));
  }

  return out;
}
