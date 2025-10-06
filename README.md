# Visionyze – Test Fullstack (Candidat)

> Ce dépôt est un **squelette**: certaines parties sont **laissées à implémenter** (TODO).  
> Durée: **48h** (charge cible 6–10h).

## 🎯 Objectif
Créer une mini app Next.js + Stripe (mode test) avec persistance PostgreSQL (Prisma) et un mini dashboard `/admin`.

## ✅ À livrer (obligatoire)
1. **Checkout Stripe** (mode test): redirection depuis `/api/checkout`.
2. **Webhook Stripe**: vérifier la signature, traiter `checkout.session.completed`, persister en DB (table `Payment`).
3. **Prisma + PostgreSQL**: modèle existant, migrations et accès DB.
4. **Dashboard `/admin`**: liste des paiements (50 derniers) + total (centimes), colonnes (date, montant, devise, statut, session, email).
5. **Docker**: `docker compose up` lance l'app + Postgres.
6. **README**: étapes d'installation, `.env.example` utilisé, explication des choix (3–10 lignes).

## 🧱 Modèle Prisma
Voir `prisma/schema.prisma` (ne pas casser la compatibilité de base).

## 🛠️ À implémenter (TODO)
- `src/app/api/checkout/route.ts`
- `src/app/api/webhook/route.ts`
- `src/app/admin/page.tsx`
- `src/lib/stripe.ts`

## 🔒 Contraintes
- Variables sensibles en `.env` (voir `.env.example`).
- Écriture en base **depuis le webhook** (source de vérité).
- Idempotence recommandée (ex: upsert par `stripeSessionId`).

## 🚀 Démarrage
```bash
npm i
cp .env.example .env
# Renseignez STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET
npx prisma migrate dev --name init
npm run dev
# Stripe CLI (terminal séparé):
stripe listen --forward-to http://localhost:3000/api/webhook
```

## 🐳 Docker
```bash
cp .env.example .env
docker compose up --build
# Stripe CLI hors conteneur:
stripe listen --forward-to http://localhost:3000/api/webhook
```

## 🔎 Évaluation
- Fonctionnalité complète (paiement → webhook → DB → admin)
- Qualité du code & architecture (TS strict, séparation claire)
- Sécurité (signature webhook, .env, validation)
- DX (Docker, README clair)
- Performance/UX raisonnables (pagination simple acceptée)

## 🧠 À expliquer dans le README
- Pourquoi ce mode d'intégration Stripe ? Limites en production ?
- Points à améliorer avec plus de temps.

Bonne chance !
