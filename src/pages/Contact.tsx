import { useState, type FormEvent } from 'react';
import { formEndpoint, links, profile } from '../content/site';
import { CopyButton, ExtLink, Note, Section } from '../components/ui';
import { IconGitHub, IconLinkedIn, IconMail } from '../components/Icons';

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
const empty: Fields = { name: '', email: '', subject: '', message: '' };

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = 'Enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter an email address like name@company.com.';
  if (f.subject.trim().length < 3) e.subject = 'Add a short subject.';
  if (f.message.trim().length < 20) e.message = 'Write at least 20 characters so I can reply properly.';
  return e;
}

export default function Contact() {
  const [f, setF] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error' | 'offline'>('idle');
  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(f);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`c-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    // Inside the claude.ai preview the page cannot reach any server: offer the email route.
    if ((window as any).claude?.use) { setState('offline'); return; }
    setState('sending');
    try {
      let res: Response;
      if (formEndpoint) {
        res = await fetch(formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(f) });
      } else {
        // Netlify Forms: the hidden form named "contact" in index.html registers the fields.
        const body = new URLSearchParams({ 'form-name': 'contact', 'bot-field': '', ...f }).toString();
        res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      }
      if (!res.ok) throw new Error(String(res.status));
      setState('sent');
      setF(empty);
    } catch {
      setState('error');
    }
  };

  const draft = `To: ${profile.email}\nSubject: ${f.subject}\n\n${f.message}\n\n${f.name}\n${f.email}`;
  const field = (k: keyof Fields, label: string, type = 'text', area = false) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`c-${k}`} className="text-sm font-semibold">{label}</label>
      {area ? (
        <textarea id={`c-${k}`} rows={6} className="field" value={f[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `c-${k}-err` : undefined} />
      ) : (
        <input id={`c-${k}`} type={type} className="field" value={f[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `c-${k}-err` : undefined} autoComplete={k === 'email' ? 'email' : k === 'name' ? 'name' : 'off'} />
      )}
      {errors[k] && <p id={`c-${k}-err`} className="text-sm text-bad">{errors[k]}</p>}
    </div>
  );

  return (
    <Section eyebrow="Contact" title="Let’s talk about a data role" intro="Interested in working together or discussing a data opportunity? Recruiters and hiring managers are welcome to get in touch.">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-3">
          <div className="card p-5">
            <div className="flex items-center gap-2 text-sm text-muted"><IconMail className="h-4 w-4 text-accent" /> Email</div>
            <p className="mt-1 select-all break-all font-mono text-fg">{profile.email}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton text={profile.email} label="Copy email" />
              <a href={`mailto:${profile.email}`} className="btn btn-ghost !py-1.5 !px-3 !text-xs">Open in email app</a>
            </div>
          </div>
          <ExtLink href={links.linkedin} className="card flex items-center gap-3 p-5 hover:border-accent/60"><IconLinkedIn className="text-accent" /><span><span className="block font-semibold">LinkedIn</span><span className="text-sm text-muted">linkedin.com/in/judeadjei</span></span></ExtLink>
          <ExtLink href={links.github} className="card flex items-center gap-3 p-5 hover:border-accent/60"><IconGitHub className="text-accent" /><span><span className="block font-semibold">GitHub</span><span className="text-sm text-muted">github.com/J2ju</span></span></ExtLink>
        </div>

        <form noValidate onSubmit={submit} className="card flex flex-col gap-4 p-5 sm:p-6" aria-describedby="form-status">
          <div className="grid gap-4 sm:grid-cols-2">
            {field('name', 'Name')}
            {field('email', 'Email', 'email')}
          </div>
          {field('subject', 'Subject')}
          {field('message', 'Message', 'text', true)}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="btn btn-primary" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'}</button>
          </div>
          <div id="form-status" aria-live="polite">
            {state === 'sent' && <Note>Message sent. Thanks, I’ll reply by email.</Note>}
            {state === 'error' && <Note tone="warn">The message couldn’t be sent just now. Please email <span className="select-all font-mono text-fg">{profile.email}</span> directly.</Note>}
            {state === 'offline' && (
              <Note tone="warn">
                <p>To send from this preview, copy your message and email it to <span className="select-all font-mono text-fg">{profile.email}</span>.</p>
                <div className="mt-2"><CopyButton text={draft} label="Copy message" /></div>
              </Note>
            )}
          </div>
        </form>
      </div>
    </Section>
  );
}
