# YAKO AFRICA — corrigé du lab

Application React/Vite, construction Docker multi-stage, Nginx sur 10000 et CI GitHub Actions.

```bash
npm ci
npm run build
docker build --build-arg APP_VERSION=local-v1 -t yako-react:v1 .
docker run --rm yako-react:v1 nginx -t
docker run -d --name yako-react-local -p 127.0.0.1:8080:10000 yako-react:v1
```

Ouvrir http://localhost:8080, /health et /version.txt.
Nettoyage : docker rm -f yako-react-local

Render : Git Provider → dépôt → branche main → Docker → port 10000 → health /health → After CI Checks Pass. Attendre la CI verte de main avant la création. Le service Render reconstruit sa propre image.

Ce dossier est un corrigé de référence. Ne pas l’ajouter comme sous-dossier au dépôt du lab. Le manuel explique le déroulement complet, le travail par PR et le rollback.
