import { LinkHub } from '../components/LinkHub';
import { profile } from '../content/site';

export default function Links() {
  return (
    <section className="gutter py-14">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl border border-line bg-raised font-display text-3xl font-extrabold text-accent" aria-hidden="true">JA</div>
          <h1 className="mt-4 text-3xl font-extrabold">{profile.name}</h1>
          <p className="mt-2 font-mono text-xs text-accent">{profile.headline}</p>
          <p className="mt-3 max-w-xl text-muted">{profile.statement}</p>
        </div>
        <div className="mt-8 [&_ul]:!grid-cols-1 sm:[&_ul]:!grid-cols-2"><LinkHub /></div>
      </div>
    </section>
  );
}
