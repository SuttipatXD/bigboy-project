'use client';

import React from 'react';
import {hlLine} from '@/lib/jsonHighlight';

interface JsonViewerProps {
  readonly text: string;
}

export function JsonViewer({text}: JsonViewerProps) {
  let pretty = text;
  let isJson = true;
  try {
    pretty = JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    isJson = false;
  }

  const lines = pretty.split('\n');

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: 12.5,
        lineHeight: 1.75,
      }}
    >
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              textAlign: 'right',
              paddingRight: 16,
              color: 'var(--gutter)',
              userSelect: 'none',
              paddingLeft: 16,
            }}
          >
            {i + 1}
          </div>
          <div
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: 'var(--fg)',
              paddingRight: 16,
            }}
          >
            {isJson ? hlLine(line) : line}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
