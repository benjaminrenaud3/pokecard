# TODO - Améliorations du projet Pokémon Cards Collection

Ce document liste toutes les améliorations à apporter au projet, organisées par priorité et catégorie.

## 🔴 CRITIQUE - À faire en priorité

### Bugs et problèmes majeurs

- [ ] **#7** - Renommer les fonctions avec des noms descriptifs
  - `get3()` → `getCollectionData()` ou `getExcelData()`
  - `call` → `cardData` ou `jsonCard`
  - `myKey` → `cardIndex` ou `rowIndex`
  - Fichier: `backend/src/GetAll.js`

- [ ] **#8** - Corriger les variables globales
  - Lignes 61-62 dans `GetAll.js` : ajouter `const` ou `let` devant `id` et `call`
  - Risque de pollution du scope global

- [ ] **#11** - Corriger l'erreur de structure de données
  - Ligne 48 `GetAll.js` : `call?.data.subtype` devrait être `call?.subtypes`
  - Vérifier la structure réelle des objets dans les JSON

- [ ] **#13** - Utiliser la comparaison stricte
  - Ligne 8 `GetFiltered.js` : remplacer `==` par `===`
  - Éviter les bugs de coercition de types

- [ ] **#18** - Corriger la gestion du cache
  - Les endpoints `/getone` et `/getordered` dépendent du cache mais ne le rechargent pas
  - Si le cache expire, les filtres retournent `null`
  - Solution: vérifier et recharger le cache si nécessaire

- [ ] **#20** - Ajouter la gestion d'erreurs côté frontend
  - Ajouter des `try/catch` sur tous les appels API dans `App.js`
  - Afficher un message d'erreur à l'utilisateur si le serveur est down
  - Créer un composant `ErrorMessage.jsx`

- [ ] **#38** - Optimiser la lecture des fichiers JSON
  - Créer un cache en mémoire des JSON au démarrage du serveur
  - Éviter de lire les fichiers à chaque requête
  - Utiliser une Map ou un objet pour stocker les données

## 🟠 IMPORTANT - À faire rapidement

### Architecture et refactoring

- [ ] **#1** - Réorganiser le backend
  - Créer `backend/controllers/` pour la logique métier
  - Créer `backend/services/` pour les services (lecture JSON, Excel)
  - Créer `backend/routes/` pour séparer les routes
  - Déplacer la logique hors de `server/index.js`

- [ ] **#2** - Centraliser la configuration
  - Créer `backend/config.js` avec toutes les constantes
  - Externaliser: chemins, durées de cache, port, URLs par défaut

- [ ] **#3** - Ajouter un système de logging
  - Installer `winston` ou `pino`
  - Remplacer les `console.log` commentés
  - Logger les erreurs au lieu de les avaler silencieusement

- [ ] **#4** - Utiliser des variables d'environnement
  - Créer `.env` et `.env.example`
  - Installer `dotenv`
  - Gérer les différences dev/prod (chemins, ports)

- [ ] **#5** - Découper le composant App.js en composants
  - Créer `frontend/src/components/CardGrid.jsx`
  - Créer `frontend/src/components/CardDetail.jsx`
  - Créer `frontend/src/components/FilterPanel.jsx`
  - Créer `frontend/src/components/SearchBar.jsx`
  - App.js fait 200 lignes, trop complexe

- [ ] **#6** - Améliorer la gestion d'état
  - Créer un custom hook `useCards()` pour centraliser la logique
  - Considérer React Context pour l'état global
  - Ou Redux si le projet grandit

- [ ] **#16** - Corriger l'ordre des middlewares
  - Déplacer `app.get('*')` après `app.listen()`
  - Actuellement risque de capturer les routes API

- [ ] **#19** - Ajouter les codes de statut HTTP appropriés
  - Retourner 404 si carte non trouvée
  - Retourner 500 en cas d'erreur serveur
  - Retourner 400 pour validation échouée

- [ ] **#27** - Rendre l'application responsive
  - Remplacer les dimensions fixes par des unités relatives
  - Ajouter des media queries pour mobile/tablette
  - Tester sur différentes tailles d'écran

- [ ] **#31** - Améliorer le feedback utilisateur
  - Ajouter un loader lors du tri/filtrage
  - Afficher un message si aucune carte ne correspond
  - Ajouter des notifications toast pour les actions

### UX/UI

- [ ] **#32** - Corriger le bouton "Display All"
  - Réinitialiser aussi les filtres dans l'UI
  - Actuellement les champs restent remplis

- [ ] **#33** - Améliorer la vue détaillée
  - Ajouter un fond overlay semi-transparent
  - Empêcher la carte de sortir de l'écran
  - Ajouter un bouton de fermeture explicite (X)

- [ ] **#34** - Gérer les images manquantes
  - Créer une image placeholder locale
  - L'URL par défaut actuelle ne donne rien

## 🟡 MOYEN - Améliorations importantes

### Code Quality

- [ ] **#9** - Optimiser les imports
  - Déplacer `fs`, `path`, `XLSX` en haut des fichiers
  - Ne pas les importer dans chaque fonction

- [ ] **#10** - Optimiser `findCardInJSON()`
  - Créer un cache en mémoire des JSON déjà lus
  - Utiliser une Map: `cardId → cardData`
  - Éviter de relire le fichier à chaque appel

- [ ] **#12** - Rendre `completeData()` immutable
  - Ne pas modifier directement l'objet passé en paramètre
  - Retourner un nouvel objet créé avec spread operator

- [ ] **#14** - Retirer les async inutiles
  - `getFiltered` et `getOrdered` ne sont pas vraiment async
  - Retirer le mot-clé ou documenter pourquoi

- [ ] **#15** - Permettre filtres combinés
  - Actuellement: nom OU génération
  - Objectif: nom ET génération simultanément

- [ ] **#17** - Ajouter la validation des inputs
  - Valider les query params (names, generation, type)
  - Protéger contre les injections
  - Utiliser une lib comme `joi` ou `express-validator`

- [ ] **#21** - Ajouter des états de loading séparés
  - `isLoadingInitial`, `isLoadingSearch`, `isLoadingSort`
  - Afficher des loaders appropriés pour chaque action

- [ ] **#22** - Optimiser les renders avec useMemo
  - `Object.entries(data).map()` recalculé à chaque render
  - Utiliser `useMemo` pour mémoriser le résultat

- [ ] **#23** - Améliorer l'accessibilité
  - Ajouter des attributs ARIA
  - Gérer la fermeture au clavier (Échap)
  - Améliorer les alt des images

- [ ] **#24** - Nettoyer le code mort
  - Supprimer lignes 87-91 dans App.js (code commenté)
  - Supprimer les console.log commentés (lignes 76, 82, 93)

- [ ] **#25** - Retirer le filtre "Possede" inutilisé
  - Ligne 23 App.js : défini mais jamais utilisé
  - Le retirer ou l'implémenter

- [ ] **#26** - Créer des constantes pour les URLs
  - `'https://images.pokemontcg.io/'` répété 4 fois
  - Créer `const DEFAULT_IMAGE_URL`

### CSS et Styling

- [ ] **#28** - Utiliser des unités relatives
  - Remplacer les px fixes par rem, %, vw, vh
  - Améliorer la scalabilité

- [ ] **#29** - Corriger le CSS inline
  - Ligne 74-75 App.css : `display: 'grid'` en string ne fonctionne pas
  - Corriger ou déplacer dans un vrai fichier CSS

- [ ] **#30** - Utiliser des variables CSS
  - Définir `--primary-color`, `--background-color`, etc.
  - Faciliter le theming et la maintenance

### Performance

- [ ] **#39** - Implémenter le lazy loading des images
  - Charger les images au fur et à mesure du scroll
  - Utiliser `IntersectionObserver` ou une lib comme `react-lazy-load-image-component`

- [ ] **#40** - Optimiser les imports Material-UI
  - Utiliser imports nommés: `import Button from '@mui/material/Button'`
  - Réduire la taille du bundle

## 🟢 NICE TO HAVE - Fonctionnalités futures

### Tests et Documentation

- [ ] **#41** - Ajouter des tests
  - Tests unitaires avec Jest pour le backend
  - Tests de composants avec React Testing Library
  - Tests d'intégration pour l'API

- [ ] **#42** - Documenter le code
  - Ajouter des commentaires JSDoc
  - Considérer une migration vers TypeScript
  - Ou utiliser JSDoc pour le typage

- [ ] **#43** - Améliorer le système de logs
  - Remplacer console.log par un vrai logger
  - Niveaux: debug, info, warn, error
  - Rotation des fichiers de logs

### Nouvelles fonctionnalités

- [ ] **#44** - Recherche avancée
  - Recherche par rareté
  - Recherche par type de Pokémon
  - Recherche par set/extension
  - Combinaison de multiples filtres

- [ ] **#45** - Statistiques de collection
  - Nombre total de cartes
  - Valeur totale de la collection
  - Graphiques (cartes par génération, par rareté)
  - Top 10 des cartes les plus chères

- [ ] **#46** - Export de données
  - Export CSV des résultats filtrés
  - Export PDF de la collection
  - Export Excel avec statistiques

- [ ] **#47** - Système de favoris/wishlist
  - Marquer des cartes favorites
  - Liste des cartes manquantes (wishlist)
  - Système de notes personnelles

- [ ] **#48** - Mode sombre
  - Toggle dark/light theme
  - Sauvegarder la préférence dans localStorage
  - Améliorer le confort visuel

### Mobile

- [ ] **#49** - Rendre l'app responsive
  - Layout adapté mobile/tablette
  - Utiliser CSS Grid/Flexbox avec media queries
  - Tester sur différents devices

- [ ] **#50** - Ajouter des touch gestures
  - Swipe pour fermer la vue détaillée
  - Pinch to zoom sur les cartes
  - Améliorer l'expérience tactile

### Sécurité

- [ ] **#35** - Sécuriser les messages d'erreur
  - Ne pas exposer les chemins de fichiers
  - Messages génériques côté client
  - Détails techniques uniquement dans les logs serveur

- [ ] **#36** - Limiter les requêtes
  - Limite sur le nombre de noms dans la recherche
  - Rate limiting sur l'API
  - Protéger contre les abus

- [ ] **#37** - Configurer CORS correctement
  - Ajouter le middleware CORS
  - Définir les origines autorisées
  - Important si déployé sur des domaines différents

---

## 📋 Roadmap suggérée

### Phase 1 - Corrections critiques (1-2 jours)
- [ ] Tous les points 🔴 CRITIQUE (#7, #8, #11, #13, #18, #20, #38)

### Phase 2 - Refactoring architecture (3-5 jours)
- [ ] Points 🟠 IMPORTANT architecture (#1, #2, #3, #4, #5, #6)
- [ ] Points 🟠 UX critiques (#32, #33, #34)

### Phase 3 - Améliorations code (2-3 jours)
- [ ] Points 🟡 MOYEN code quality (#9-#26)
- [ ] Points 🟡 CSS (#28-#30)

### Phase 4 - Performance et mobile (2-3 jours)
- [ ] Point #27 Responsive
- [ ] Points #39, #40 Performance
- [ ] Points #49, #50 Mobile

### Phase 5 - Features et polish (selon besoins)
- [ ] Tests (#41)
- [ ] Nouvelles fonctionnalités (#44-#48)
- [ ] Sécurité (#35-#37)

---

## 📝 Notes

- Cette liste a été générée le 2025-10-05
- Contexte: Migration de l'API PokemonTCG payante vers fichiers JSON locaux
- Voir `IMPROVEMENTS.md` pour les détails complets de chaque point
- Voir les README pour la documentation du projet

## 🎯 Prochaines étapes immédiates recommandées

1. Corriger les variables globales (#8)
2. Ajouter la gestion d'erreurs frontend (#20)
3. Optimiser le cache JSON (#38)
4. Créer le fichier de configuration (#2)
5. Découper App.js en composants (#5)
