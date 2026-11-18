import { Check, ShieldCheck } from 'lucide-react';
import './guidance-notes.css';

export function GuidanceNotes({ notes }: { notes: readonly string[] }) {
  const seen = new Set<string>();
  const unique = notes.map(note => note.trim()).filter(note => {
    const key = note.toLocaleLowerCase().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (!unique.length) return null;
  return <section className="component-notes component-guidance"><h2><ShieldCheck size={17} aria-hidden="true" />Implementation notes</h2><ul>{unique.map(note => <li key={note}><Check size={13} aria-hidden="true" /><span>{note}</span></li>)}</ul>{unique.some(note => /\bGrid\b/.test(note)) && <p className="component-guidance-layout-link"><a href="#layout">Layout and Grid examples</a></p>}</section>;
}
