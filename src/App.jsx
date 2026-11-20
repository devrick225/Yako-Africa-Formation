import React, { useEffect, useState } from 'react';

const fichiers = import.meta.glob('./participants/*.js', { eager: true, import: 'default' });
const participants = Object.values(fichiers);
const etapes = ['Code', 'Pull request', 'CI', 'Déploiement'];

function Icon({ type }) {
  const paths = {
    code: 'm8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 22',
    check: 'm5 12 4 4L19 6',
    cloud: 'M7 18a5 5 0 0 1-1-10 7 7 0 0 1 13 2 4 4 0 0 1-1 8H7m5-8v7m-3-3 3 3 3-3',
  };
  return <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[type] || paths.check}/></svg>;
}

export default function App() {
  const [version, setVersion] = useState('chargement…');
  const [livraisons, setLivraisons] = useState(0);
  useEffect(() => {
    fetch('/version.txt', { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error('Version indisponible'); return r.text(); })
      .then(v => setVersion(v.trim()))
      .catch(() => setVersion('développement local'));
  }, []);
  return <>
    <header className="top"><a className="brand" href="#accueil"><span className="logo">Y</span> YAKO AFRICA <small>DEVOPS LAB</small></a><a href="#participants" className="nav">Notre équipe ↗</a></header>
    <main id="accueil">
      <section className="hero">
        <div><span className="badge"><span className="dot"/> ATELIER PRATIQUE</span>
          <h1>Notre première livraison automatisée</h1>
          <p className="lead">Du code au navigateur : construisons, vérifions et déployons notre application ensemble.</p>
          <div className="actions"><a href="#participants" className="button">Découvrir l’équipe <span>↗</span></a><span className="release">Version pédagogique <strong>V1</strong></span></div>
        </div>
        <aside className="terminal"><div className="terminal-head"><i/><i/><i/><span>livraison.log</span></div><div className="terminal-body"><p><b>$</b> git push origin ma-branche</p><p><b>✓</b> Code partagé</p><p><b>✓</b> Image Docker construite</p><p><b>✓</b> Vérifications HTTP</p><p><b>→</b> Prochaine étape : Render</p></div><small>Schéma pédagogique — consulter GitHub et Render pour les vrais résultats.</small></aside>
      </section>
      <section className="pipeline" aria-label="Parcours de livraison">{etapes.map((etape, i) => <div key={etape}><span className="step">0{i+1}</span><strong>{etape}</strong>{i < etapes.length-1 && <span className="arrow">→</span>}</div>)}</section>
      <section className="features"><article><Icon type="code"/><h2>Construire</h2><p>React et Vite produisent les fichiers du site. Docker prépare leur environnement.</p></article><article><Icon type="check"/><h2>Vérifier</h2><p>GitHub Actions construit l’image et contrôle les réponses du conteneur.</p></article><article><Icon type="cloud"/><h2>Livrer</h2><p>Après validation de main, Render construit et met la nouvelle version en ligne.</p></article></section>
      <section id="participants"><div className="section-title"><div><span className="eyebrow">UNE ÉQUIPE, UN DÉPÔT</span><h2>Les contributeurs de la livraison</h2></div><span className="count">{participants.length} contribution(s)</span></div><div className="people">{participants.map((p, i) => <article className="person" key={i}><div className="avatar">{String(p.nom).slice(0, 1)}</div><h3>{p.nom}</h3><span>{p.role}</span><p>{p.message}</p></article>)}</div></section>
      <section className="demo"><div><h2>Un petit test dans le navigateur</h2><p>Ce compteur reste en mémoire dans ce navigateur. Il revient à zéro au rechargement.</p></div><button onClick={() => setLivraisons(n => n + 1)}>Test du bouton · {livraisons}</button></section>
      <footer><span>YAKO AFRICA · Formation DevOps</span><span>Commit servi : <code>{version}</code></span></footer>
    </main>
  </>;
}
