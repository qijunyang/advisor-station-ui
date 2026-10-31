import { useEffect, useRef, useState } from 'react';
import { CollectionPage } from '../../shared/components/CollectionPage';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';
import { RowActionMenu } from '../../shared/components/RowActionMenu';
import { ModelDialog } from './components/ModelDialog';
import type { ModelDraft } from './components/ModelDialog';
import { previewModels } from './previewModels';
import type { ModelPreviewRow } from './previewModels';

type DialogTarget = { mode: 'create' } | { mode: 'view' | 'edit'; model: ModelPreviewRow };

export function ModelsPage({ rows = previewModels }: { rows?: readonly ModelPreviewRow[] }) {
  const [models, setModels] = useState(() => rows.map((row) => ({ ...row })));
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [dialog, setDialog] = useState<DialogTarget | null>(null);
  const [deleteTargets, setDeleteTargets] = useState<readonly ModelPreviewRow[] | null>(null);
  const selectAll = useRef<HTMLInputElement>(null);
  const createButton = useRef<HTMLButtonElement>(null);
  const selectedModels = models.filter((row) => selectedIds.has(row.id));
  const selectedCount = selectedModels.length;
  const allSelected = models.length > 0 && selectedCount === models.length;
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

  function saveModel(draft: ModelDraft) {
    const date = new Date().toISOString().slice(0, 10);
    if (dialog?.mode === 'create') {
      setModels((current) => [{ ...draft, id: crypto.randomUUID(), createdAt: date, updatedAt: date, createdBy: 'Demo advisor', updatedBy: 'Demo advisor' }, ...current]);
    } else if (dialog?.mode === 'edit') {
      setModels((current) => current.map((row) => row.id === dialog.model.id ? { ...row, ...draft, updatedAt: date, updatedBy: 'Demo advisor' } : row));
    }
    setDialog(null);
  }

  function deleteModels() {
    const ids = new Set(deleteTargets!.map((row) => row.id));
    setModels((current) => current.filter((row) => !ids.has(row.id)));
    setSelectedIds((current) => new Set([...current].filter((id) => !ids.has(id))));
    setDeleteTargets(null);
  }

  return <>
    <CollectionPage title="Models" description="Organize research ideas before putting them into practice."
      actions={<div className="collection-actions">
        <button ref={createButton} className="primary-button" onClick={() => setDialog({ mode: 'create' })}>Create</button>
        <button disabled={selectedCount === 0} onClick={() => setDeleteTargets(selectedModels)}>Delete selected</button>
      </div>}
      footer={<>
        <div className="selection-summary"><span role="status">{selectedCount} of {models.length} selected</span><button disabled={selectedCount === 0} onClick={() => setSelectedIds(new Set())}>Clear selection</button></div>
        <span>Preview changes reset when you leave or refresh this page.</span>
      </>}>
      <table className="collection-table">
        <caption className="visually-hidden">Model research collections — fictional layout preview</caption>
        <thead><tr>
          <th scope="col" className="checkbox-column"><input ref={selectAll} type="checkbox" aria-label="Select all models" checked={allSelected} disabled={models.length === 0} onChange={() => setSelectedIds(allSelected ? new Set() : new Set(models.map((row) => row.id)))} /></th>
          <th scope="col">Model name</th><th scope="col">Created</th><th scope="col">Updated</th><th scope="col">Updated by</th><th scope="col">Actions</th>
        </tr></thead>
        <tbody>
          {models.map((row) => <tr key={row.id} className={selectedIds.has(row.id) ? 'selected-row' : undefined}>
            <td className="checkbox-column"><input type="checkbox" aria-label={`Select ${row.name}`} checked={selectedIds.has(row.id)} onChange={() => toggleRow(row.id)} /></td>
            <th scope="row">{row.name}</th><td><time dateTime={row.createdAt}>{row.createdAt}</time></td><td><time dateTime={row.updatedAt}>{row.updatedAt}</time></td><td>{row.updatedBy}</td>
            <td><RowActionMenu label={`Actions for ${row.name}`} actions={[
              { label: 'View', onSelect: () => setDialog({ mode: 'view', model: row }) },
              { label: 'Edit', onSelect: () => setDialog({ mode: 'edit', model: row }) },
              { label: 'Delete', destructive: true, onSelect: () => setDeleteTargets([row]) },
            ]} /></td>
          </tr>)}
          {models.length === 0 && <tr><td colSpan={6} className="collection-empty">No models to display.</td></tr>}
        </tbody>
      </table>
    </CollectionPage>
    {dialog?.mode === 'create' && <ModelDialog mode="create" onSave={saveModel} onClose={() => setDialog(null)} fallbackFocusRef={createButton} />}
    {dialog?.mode === 'edit' && <ModelDialog mode="edit" model={dialog.model} onSave={saveModel} onClose={() => setDialog(null)} fallbackFocusRef={createButton} />}
    {dialog?.mode === 'view' && <ModelDialog mode="view" model={dialog.model} onClose={() => setDialog(null)} fallbackFocusRef={createButton} />}
    {deleteTargets && <ConfirmDialog title={deleteTargets.length === 1 ? 'Delete model' : 'Delete selected models'} message="Delete these models from this preview? This cannot be undone."
      names={deleteTargets.map((row) => row.name)} onConfirm={deleteModels} onCancel={() => setDeleteTargets(null)} fallbackFocusRef={createButton} />}
  </>;
}
