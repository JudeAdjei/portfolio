import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => { document.title = 'Page not found · Jude Adjei'; }, []);
  return (
    <section className="gutter py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-sm text-accent">Error 404</p>
        <h1 className="mt-4 text-4xl font-extrabold">Page not found</h1>
        <p className="mt-3 text-muted">The link may be out of date. Try the projects or the home page.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/" className="btn btn-primary">Home</Link>
          <Link to="/projects" className="btn btn-ghost">Projects</Link>
        </div>
      </div>
    </section>
  );
}
