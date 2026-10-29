import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import ProjectsPage from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import CvPage from './pages/Cv';
import Contact from './pages/Contact';
import Links from './pages/Links';
import NotFound from './pages/NotFound';

const titles: Record<string, string> = {
  '/': 'View my portfolio',
  '/projects': 'Projects · Jude Adjei',
  '/about': 'About · Jude Adjei',
  '/cv': 'CV & Certificates · Jude Adjei',
  '/contact': 'Contact · Jude Adjei',
  '/links': 'Links · Jude Adjei',
};

function ScrollAndTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (titles[pathname]) document.title = titles[pathname];
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Layout>
      <ScrollAndTitle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/cv" element={<CvPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/links" element={<Links />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
