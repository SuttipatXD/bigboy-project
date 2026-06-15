'use client';

import {useRef} from 'react';
import {useAppStore} from '@/store/appStore';
import {METHOD_COLORS} from '@/lib/themes';
import {parsePostmanCollection} from '@/lib/postmanImport';
import type {CollectionItem, HttpMethod} from '@/types';

const BUILT_IN: CollectionItem[] = [
  {method: 'GET', url: '{{base_url}}/users'},
  {method: 'GET', url: '{{base_url}}/users/1'},
  {method: 'GET', url: '{{base_url}}/posts?userId=1'},
  {method: 'GET', url: '{{base_url}}/todos/1'},
  {method: 'POST', url: '{{base_url}}/posts'},
  {method: 'PUT', url: '{{base_url}}/posts/1'},
  {method: 'PATCH', url: '{{base_url}}/posts/1'},
  {method: 'DELETE', url: '{{base_url}}/posts/1'},
];

function ItemRow({item, onClick}: {item: CollectionItem; onClick: () => void}) {
  const label = item.name || item.url.replace('{{base_url}}', '');
  const color = METHOD_COLORS[item.method] ?? 'var(--muted)';
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px 8px 26px',
        cursor: 'pointer',
        borderLeft: '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = 'var(--hover)';
        el.style.borderLeftColor = 'var(--accent)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = 'transparent';
        el.style.borderLeftColor = 'transparent';
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-archivo), sans-serif',
          fontWeight: 800,
          fontSize: 9,
          letterSpacing: '0.05em',
          width: 42,
          flexShrink: 0,
          color,
        }}
      >
        {item.method}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: 11,
          color: 'var(--fg)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function GroupHeader({
  label,
  onRemove,
}: {
  label: string;
  onRemove?: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        color: 'var(--muted)',
        fontFamily: 'var(--font-archivo), sans-serif',
        fontWeight: 700,
        fontSize: 10,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{color: 'var(--accent)'}}>▸</span>
      <span style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
        {label}
      </span>
      {onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Remove collection"
          style={{cursor: 'pointer', opacity: 0.5, fontSize: 11, lineHeight: 1}}
          onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.opacity = '1')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.opacity = '0.5')}
        >
          ✕
        </span>
      )}
    </div>
  );
}

export function CollectionsPanel() {
  const {loadRequest, loadItem, collections, importCollection, removeCollection} = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        const collection = parsePostmanCollection(json);
        importCollection(collection);
      } catch {
        alert('ไม่สามารถอ่านไฟล์ได้ — กรุณาใช้ไฟล์ Postman Collection (.json)');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div style={{padding: '10px 0'}}>
      {/* Import button */}
      <div style={{padding: '4px 14px 10px'}}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{display: 'none'}}
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%',
            padding: '7px 0',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 700,
            fontSize: 9,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.borderColor = 'var(--accent)';
            el.style.color = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.borderColor = 'var(--border)';
            el.style.color = 'var(--muted)';
          }}
        >
          + Import Postman Collection
        </button>
      </div>

      {/* Built-in collection */}
      <GroupHeader label="JSONPlaceholder" />
      {BUILT_IN.map((item, i) => (
        <ItemRow
          key={i}
          item={item}
          onClick={() => loadRequest(item.method as HttpMethod, item.url)}
        />
      ))}

      {/* Imported collections */}
      {collections.map((col, ci) => (
        <div key={ci} style={{marginTop: 10}}>
          <GroupHeader label={col.name} onRemove={() => removeCollection(ci)} />
          {col.items.map((item, ii) => (
            <ItemRow key={ii} item={item} onClick={() => loadItem(item)} />
          ))}
          {col.items.length === 0 && (
            <div
              style={{
                padding: '6px 26px',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: 10,
                color: 'var(--muted)',
              }}
            >
              No requests found
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
