import { useEffect, useRef, useState } from 'react';
import { CollectionPage } from '../../shared/components/CollectionPage';
import { previewModels } from './previewModels';
import type { ModelPreviewRow } from './previewModels';

export function ModelsPage({ rows = previewModels }: { rows?: readonly ModelPreviewRow[] }) {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set());
  const selectAll = useRef<HTMLInputElement>(null);
  const selectedCount = rows.filter((row) => selectedIds.has(row.id)).length;
  const allSelected = rows.length > 0 && selectedCount === rows.length;
  const partiallySelected = selectedCount > 0 && !allSelected;

  useEffect(() => {
    if (selectAll.current) selectAll.current.indeterminate = partiallySelected;
  }, [partiallySelected]);

  function toggleRow(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <CollectionPage title="Models" description="Organize research ideas before putting them into practice."
      actions={<div className="collection-actions"><button disabled>Create</button><button disabled>Delete selected</button></div>}
      footer={<>
        <div className="selection-summary"><span role="status">{selectedCount} of {rows.length} selected</span><button disabled={selectedCount === 0} onClick={() => setSelectedIds(new Set())}>Clear selection</button></div>
        <span>Creating, editing, and deleting models is not available in this preview.</span>
      </>}>
      <table className="collection-table">
        <caption className="visually-hidden">Model research collections — fictional layout preview</caption>
        <thead><tr>
          <th scope="col" className="checkbox-column"><input ref={selectAll} type="checkbox" aria-label="Select all models" checked={allSelected} disabled={rows.length === 0} onChange={() => setSelectedIds(allSelected ? new Set() : new Set(rows.map((row) => row.id)))} /></th>
          <th scope="col">Model name</th><th scope="col">Created</th><th scope="col">Updated</th><th scope="col">Updated by</th>
        </tr></thead>
        <tbody>
          {rows.map((row) => <tr key={row.id} className={selectedIds.has(row.id) ? 'selected-row' : undefined}>
            <td className="checkbox-column"><input type="checkbox" aria-label={`Select ${row.name}`} checked={selectedIds.has(row.id)} onChange={() => toggleRow(row.id)} /></td>
            <th scope="row">{row.name}</th><td><time dateTime={row.createdAt}>{row.createdAt}</time></td><td><time dateTime={row.updatedAt}>{row.updatedAt}</time></td><td>{row.updatedBy}</td>
          </tr>)}
          {rows.length === 0 && <tr><td colSpan={5} className="collection-empty">No models to display.</td></tr>}
        </tbody>
      </table>
    </CollectionPage>
  );
}
