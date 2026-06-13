'use client';

interface RawViewerProps {
  readonly text: string;
}

export function RawViewer({text}: RawViewerProps) {
  return (
    <pre
      style={{
        padding: '14px 16px',
        margin: 0,
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: 12,
        lineHeight: 1.7,
        color: 'var(--fg)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {text}
    </pre>
  );
}
