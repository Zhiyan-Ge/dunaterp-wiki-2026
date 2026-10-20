export type ContentBlock =
  | { kind: 'paragraph' | 'heading'; text: string }
  | { kind: 'equation'; text: string; label: string }
  | { kind: 'code'; text: string; label: string }
  | { kind: 'figure'; src: string; alt: string; caption: string }
  | { kind: 'figure-grid'; figures: { src: string; alt: string; caption: string }[] }
  | { kind: 'member-grid'; members: TeamMember[] }
  | { kind: 'chapter-grid'; items: { index: string; title: string; text: string; href: string }[] }
  | { kind: 'table'; caption: string; columns: string[]; rows: string[][]; collapsed?: boolean }
  | { kind: 'links'; links: { label: string; href: string }[] }
  | { kind: 'wet-lab-overview' }
  | { kind: 'wet-lab-method'; id: string; introHtml: string; html: string; protocolTitle: string; headings: { id: string; title: string }[] }
  | { kind: 'download'; src: string; label: string }
  | { kind: 'pdf'; src: string; downloadSrc: string; label: string }
  | { kind: 'pbr-widget' | 'docking-viewer' }
  | { kind: 'safety-overview' | 'safety-results' };

export type TeamMember = {
  givenName: string;
  familyName: string;
  major: string;
  src: string;
};

export type WikiReference = {
  label: string;
  href: string;
  kind?: 'Article' | 'Dataset' | 'Database' | 'Software' | 'Image' | 'Web resource';
};
