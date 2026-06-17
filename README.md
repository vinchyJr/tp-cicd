`frontend` : React + Vite + nginx : Affiche la réponse de l'API en temps réel     
`backend`  : Node.js + Express    : Expose `GET /api/health` => `{ "status": "ok" }` 
`database` : PostgreSQL 15        : Stocke les données, persiste entre les redémarrages 

## Pour lancer le projet

```bash
cp .env.example .env
docker compose up --build
```

Ouvre http://localhost et tu verras la réponse de l'API

## Comment c'est organisé

On a deux réseaux Docker séparés pour isoler les services :

  Navigateur => frontend (nginx) => frontend-net => backend (Express) => backend-net => database (PostgreSQL)

- Le **frontend** parle uniquement au **backend**, il n'a aucun accès direct à la base de données
- Le **backend** est le seul à pouvoir interroger **PostgreSQL**
- nginx fait le relais : les requêtes vers `/api/` sont automatiquement redirigées vers le backend

## Les variables d'environnement

Variable : DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_PORT
Ce que c'est : Utilisateur PostgreSQL, Mot de passe PostgreSQL, Nom de la base de données, Port exposé sur la machine

## Les Dockerfiles multi-stage

Pour garder des images légères en production, chaque Dockerfile passe par deux étapes :

**Backend** : d'abord on installe les dépendances, puis on ne garde que le strict nécessaire pour faire tourner le serveur

**Frontend** : d'abord Vite compile le projet React en fichiers statiques, puis nginx ne prend que ce dossier `dist/`, tout le reste (node_modules, code source) est ignoré

## Le pipeline CI/CD

À chaque `push`, GitHub Actions lance deux jobs en parallèle qui buildent et poussent les images sur Docker Hub :

- `build_backend` → `<DOCKERHUB_USERNAME>/backend`
- `build_frontend` → `<DOCKERHUB_USERNAME>/frontend`

Chaque image reçoit deux tags : le SHA court du commit (pour tracer exactement quelle version est déployée) et `latest`

## Commandes utiles

```bash
docker compose down

# stopper et supprimer le volume de la BDD
docker compose down -v

docker compose ps

docker compose logs backend
docker compose logs frontend
```
