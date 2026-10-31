import type { ReactNode } from 'react';

interface CollectionPageProps {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}

export function CollectionPage({ title, description, actions, children, footer }: CollectionPageProps) {
  return (
    <section className="collection-page" aria-labelledby="collection-heading">
      <header className="collection-header">
        <div className="collection-heading-row">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h1 id="collection-heading">{title}</h1>
          </div>
          {actions}
        </div>
        <p className="collection-description">{description}</p>
        <p className="preview-label">Layout preview · Fictional sample data</p>
      </header>
      <div className="collection-scroll" role="region" aria-label={`${title} table`} tabIndex={0}>
        {children}
      </div>
      <footer className="collection-footer">{footer}</footer>
    </section>
  );
}
