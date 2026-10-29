import { certificates, links, profile, timeline } from '../content/site';
import { Section, ExtLink } from '../components/ui';
import { IconBadge, IconExternal, IconLinkedIn } from '../components/Icons';
import { CvButton } from '../components/CvButton';
import cvImg from '../assets/cv-page.webp';

const expertise = ['Business insights generation', 'Statistical analysis & hypothesis testing', 'Performance monitoring', 'Building predictive models', 'Data visualisation & reporting', 'Stakeholder communication', 'SQL, Excel, Python and R', 'Data collection & quality', 'Automation dashboards'];

export default function CvPage() {
  return (
    <>
      <Section eyebrow="CV" title="Curriculum vitae" intro="My CV is below. Download the PDF to keep a copy.">
        <div className="flex flex-wrap gap-2">
          <CvButton className="btn btn-primary" label="Download CV (PDF)" />
          <ExtLink href={links.linkedin} className="btn btn-ghost"><IconLinkedIn className="h-4 w-4" /> LinkedIn profile</ExtLink>
        </div>
        <figure className="card mt-8 overflow-hidden mx-auto max-w-3xl">
          <img src={cvImg} alt="Jude Adjei CV: Data Scientist. England, United Kingdom; adjeijude24@gmail.com; LinkedIn; portfolio link. Area of expertise, MSc Financial Technology and Business Analytics at the University of Chester (Oct 2025 – Oct 2026), Mail Sorter at Royal Mail (Oct 2025 – present), Sales Analyst at Pep’s Restaurant (Nov 2024 – Oct 2025), Google Data Analytics Professional Certificate." className="w-full h-auto bg-white" />
        </figure>
      </Section>
      <Section eyebrow="Certificates" title="Certificates & professional development" className="!pt-0">
        <ul className="grid gap-3 sm:grid-cols-2">
          {certificates.map((c) => (
            <li key={c.name} className="card flex items-start gap-3 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-raised text-accent"><IconBadge /></span>
              <div className="min-w-0">
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-muted">{c.issuer} · via Coursera</p>
                {c.url ? <ExtLink href={c.url} className="mt-2 inline-flex items-center gap-1 text-sm text-accent">View credential <IconExternal className="h-4 w-4" /></ExtLink> : null}
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
