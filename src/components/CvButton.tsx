import { useState, type MouseEvent } from 'react';
import { links } from '../content/site';
import { IconFile } from './Icons';

const FILENAME = 'Jude-Adjei-CV.pdf';

// On a normal host the link downloads the PDF directly.
// Inside a claude.ai Artifact (where plain downloads are blocked) it uses the
// viewer's `downloads` capability to save the same file.
export function CvButton({ className = 'btn btn-ghost', label = 'Download my CV' }: { className?: string; label?: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  const onClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    const claude = (window as any).claude;
    if (!claude?.use) return; // regular website: let the browser download it
    e.preventDefault();
    setMsg(null);
    try {
      const downloads = await claude.use('downloads');
      if (!downloads) { window.open(links.cvPdf, '_blank', 'noopener'); return; }
      const blob = await (await fetch(links.cvPdf)).blob();
      await downloads.save({ filename: FILENAME, data: blob });
    } catch (err: any) {
      if (err?.code !== 'declined') setMsg('The download didn’t start. The full CV is on the CV page.');
    }
  };
  return (
    <span className="inline-flex flex-col gap-1">
      <a href={links.cvPdf} download={FILENAME} onClick={onClick} className={className}>
        <IconFile className="h-4 w-4" /> {label}
      </a>
      {msg && <span className="text-xs text-muted" role="status">{msg}</span>}
    </span>
  );
}
