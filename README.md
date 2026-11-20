# YAKO AFRICA — application de départ

Support du lab React → Docker → GitHub Actions → Render.

Node 22.12 minimum recommandé dans la branche Node 22 ; utiliser une version compatible maintenue.

```bash
npm ci
npm run dev
npm run build
```

Les cartes de l’équipe sont chargées depuis src/participants/*.js. Chaque fichier exporte un objet avec nom, role et message. Le compteur du navigateur est temporaire. Le terminal affiché est un schéma pédagogique, pas le résultat réel de la CI.

Ne copier dans le dépôt que les fichiers de ce dossier, pas le dossier parent de formation. Suivre le manuel du formateur pour ajouter Docker et GitHub Actions progressivement. Aucun backend ni variable secrète n’est requis.
