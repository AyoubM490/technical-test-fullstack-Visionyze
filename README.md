# Visionyze – Test Fullstack (Ayoub Chahir)

## Installation

1. Copier .env.example en .env et remplir les variables (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET).
2. Installer les dépendances : npm install
3. Lancer le serveur : npm run dev

## Fonctionnalités & Choix techniques
- Paiements Stripe Checkout créés côté serveur, sécurisés et conformes PCI.
- Webhook minimal pour enregistrer les paiements dans Prisma.
- Dashboard /admin affichant date, montant, devise, statut, session, email.
- Pagination côté serveur avec boutons Précédent / Suivant.
- Limites : gestion minimale des erreurs et abonnements, pas de multi-produits avancé.
- Améliorations possibles : filtres, recherche, export CSV, logs et sécurité renforcée.