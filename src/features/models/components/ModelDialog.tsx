import { useId, useRef, useState } from 'react';
import type { FormEvent, RefObject } from 'react';
import { Modal } from '../../../shared/components/Modal';
import type { ModelPreviewRow } from '../previewModels';

export interface ModelDraft { name: string; description: string }

type ModelDialogProps = {
  onClose: () => void;
  fallbackFocusRef?: RefObject<HTMLElement | null>;
} & (
  | { mode: 'create'; onSave: (draft: ModelDraft) => void }
  | { mode: 'edit'; model: ModelPreviewRow; onSave: (draft: ModelDraft) => void }
  | { mode: 'view'; model: ModelPreviewRow }
);

export function ModelDialog(props: ModelDialogProps) {
  const model = props.mode === 'create' ? undefined : props.model;
  const [name, setName] = useState(model?.name ?? '');
  const [description, setDescription] = useState(model?.description ?? '');
  const [error, setError] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const formId = useId();
  const errorId = useId();
  const title = props.mode === 'create' ? 'Create model' : props.mode === 'edit' ? 'Edit model' : 'View model';

  function save(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || name.trim().length > 100 || description.trim().length > 1000) {
      setError('Enter a name of 1–100 characters and a description of at most 1,000 characters.');
      nameRef.current?.focus();
      return;
    }
    if (props.mode !== 'view') props.onSave({ name: name.trim(), description: description.trim() });
  }

  return (
    <Modal title={title} onClose={props.onClose} initialFocusRef={nameRef} fallbackFocusRef={props.fallbackFocusRef}
      footer={props.mode === 'view' ? <button onClick={props.onClose}>Close</button> : <><button onClick={props.onClose}>Cancel</button><button className="primary-button" type="submit" form={formId}>{props.mode === 'create' ? 'Create model' : 'Save changes'}</button></>}>
      {props.mode === 'view' ? <dl className="model-details">
        <dt>Name</dt><dd>{props.model.name}</dd>
        <dt>Description</dt><dd>{props.model.description || 'No description.'}</dd>
        <dt>Created</dt><dd>{props.model.createdAt}</dd>
        <dt>Updated</dt><dd>{props.model.updatedAt}</dd>
        <dt>Updated by</dt><dd>{props.model.updatedBy}</dd>
      </dl> : <form id={formId} onSubmit={save} noValidate className="model-form">
        <label htmlFor={`${formId}-name`}>Name <span aria-hidden="true">*</span></label>
        <input ref={nameRef} id={`${formId}-name`} value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
        <label htmlFor={`${formId}-description`}>Description <span className="optional-label">(optional)</span></label>
        <textarea id={`${formId}-description`} value={description} onChange={(event) => setDescription(event.target.value)} maxLength={1000} rows={4} />
        {error && <p id={errorId} role="alert" className="field-error">{error}</p>}
      </form>}
      <p className="dialog-note">Preview changes last only while this Models page is open. Positions and cash are not included yet.</p>
    </Modal>
  );
}
