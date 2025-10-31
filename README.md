# Pokémon Cards Collection Manager

Application web de gestion de collection de cartes Pokémon avec interface React et backend Node.js/Express. Le projet permet de visualiser, rechercher, filtrer et trier vos cartes Pokémon à partir de données locales (fichiers JSON).

## Vue d'ensemble

Ce projet est composé de deux parties :
- **Backend** (`backend/`) : Serveur Express qui récupère les données depuis des fichiers JSON locaux
- **Frontend** (`frontend/`) : Application React avec interface Material-UI

### Contexte du projet

Initialement, le projet utilisait l'API PokemonTCG pour récupérer les images et informations des cartes. Suite au passage de l'API en version payante, le système a été migré pour utiliser des fichiers JSON locaux stockés dans le dossier `backend/cards/`.

## Structure du projet

```
pokecard/
├── frontend/                       # Application React (Frontend)
│   ├── src/
│   │   ├── App.js               # Composant principal
│   │   ├── App.css              # Styles
│   │   └── assets/              # Images et ressources
│   ├── public/
│   └── package.json
│
├── backend/              # Serveur Node.js (Backend)
│   ├── server/
│   │   └── index.js            # Serveur Express
│   ├── src/
│   │   ├── GetAll.js           # Récupération et enrichissement des cartes
│   │   ├── GetNames.js         # Extraction des noms
│   │   ├── GetFiltered.js      # Filtrage et tri
│   │   └── Pokedex.xlsx        # Fichier Excel de votre collection
│   ├── cards/                  # Fichiers JSON des cartes par set
│   │   ├── sv1.json
│   │   ├── sv2.json
│   │   ├── swsh12.json
│   │   └── ...
│   └── package.json
│
└── package.json                # Scripts d'installation et démarrage globaux
```

## Fonctionnalités

### Interface utilisateur
- Affichage en grille de toutes les cartes de votre collection
- Vue détaillée avec informations complètes (prix, rareté, description)
- Recherche multi-critères par nom de Pokémon avec autocomplétion
- Filtrage par génération (1 à 9)
- Tri avancé :
  - Ordre alphabétique (A-Z et Z-A)
  - Prix croissant/décroissant
  - Rareté croissante/décroissante
- Conservation de la position de scroll

### Backend
- Lecture des données depuis fichiers JSON locaux (plus d'API payante)
- Système de cache pour optimiser les performances
- Enrichissement automatique des données (images, prix, rareté)
- API REST pour le frontend

## Prérequis

- **Node.js** version 14.x ou supérieure
- **npm** (inclus avec Node.js)

## Installation

### Installation complète (recommandé)

Depuis la racine du projet :

```bash
npm install
```

Cette commande installe automatiquement les dépendances du frontend et du backend.

### Installation manuelle (alternative)

Si vous préférez installer manuellement :

**Backend :**
```bash
cd react-node-app
npm install
```

**Frontend :**
```bash
cd client
npm install
```

## Démarrage de l'application

### Option 1 : Démarrage séparé (recommandé pour le développement)

**Terminal 1 - Backend :**
```bash
cd react-node-app
npm start
```
Le serveur démarre sur `http://localhost:3001`

**Terminal 2 - Frontend :**
```bash
cd client
npm start
```
L'application démarre sur `http://localhost:3000`

### Option 2 : Démarrage depuis la racine

```bash
npm start
```

Cette commande démarre le backend ET le frontend en parallèle.

## Utilisation

1. **Assurez-vous que le fichier `Pokedex.xlsx` est à jour** dans `backend/src/`
   - Colonnes requises : `ID`, `Nom`, `Generation`, `Present`, `ID no image`

2. **Vérifiez que les fichiers JSON sont présents** dans `backend/cards/`
   - Format : `{set-code}.json` (ex: `sv1.json`, `swsh12.json`)

3. **Ouvrez votre navigateur** sur `http://localhost:3000`

4. **Utilisez l'interface** :
   - Attendez le chargement initial des cartes
   - Utilisez les filtres pour affiner votre recherche
   - Cliquez sur une carte pour voir les détails
   - Utilisez "Display All" pour réinitialiser

## Build de production

Pour générer une version optimisée pour la production :

```bash
cd client
npm run build
```

Le dossier `frontend/build/` contiendra l'application compilée, qui sera automatiquement servie par le backend Express.

Pour démarrer en production :
```bash
cd react-node-app
npm start
```

L'application complète sera accessible sur `http://localhost:3001`

## Comment fonctionne la récupération des données ?

### Système de fichiers JSON

Les cartes sont stockées dans des fichiers JSON organisés par set. Chaque carte possède un ID au format `AA-BB` :
- `AA` = code du set (ex: "sv1", "swsh12", "xy5")
- `BB` = numéro de la carte dans le set

**Exemple :** L'ID `sv1-25` correspond à :
1. Fichier : `backend/cards/sv1.json`
2. Carte avec `"id": "sv1-25"` dans ce fichier
3. L'image est récupérée depuis le champ `images.small`

### Workflow de récupération

1. Le backend lit votre fichier Excel `Pokedex.xlsx`
2. Pour chaque carte marquée "oui" dans la colonne `Present`
3. Le système extrait le code du set depuis l'ID
4. Il ouvre le fichier JSON correspondant
5. Il recherche la carte avec l'ID exact
6. Il enrichit les données avec l'image, les prix, la rareté, etc.
7. Les données sont mises en cache pendant 3 jours

## Dépannage

### Le backend ne démarre pas
- Vérifiez que Node.js 14+ est installé : `node --version`
- Vérifiez que les dépendances sont installées : `npm install` dans `backend/`
- Vérifiez que le port 3001 n'est pas déjà utilisé

### Le frontend ne trouve pas le backend
- Vérifiez que le backend est bien démarré sur le port 3001
- Vérifiez la configuration du proxy dans `frontend/package.json` : `"proxy": "http://localhost:3001/"`

### Les images ne s'affichent pas
- Vérifiez que les fichiers JSON sont présents dans `backend/cards/`
- Vérifiez que les IDs dans votre Excel correspondent aux IDs des cartes dans les JSON
- Vérifiez les logs du serveur pour voir les erreurs éventuelles

### Le fichier Excel n'est pas lu
- Assurez-vous que `Pokedex.xlsx` est bien dans `backend/src/`
- Vérifiez que le fichier contient les colonnes : `ID`, `Nom`, `Generation`, `Present`, `ID no image`

## Documentation détaillée

Pour plus d'informations sur chaque partie du projet :
- [README Backend](backend/README.md) - Documentation technique du serveur
- [README Frontend](frontend/README.md) - Documentation de l'interface React

## Technologies utilisées

### Backend
- Node.js
- Express.js
- node-cache (système de cache)
- xlsx (lecture du fichier Excel)
- fs/path (lecture des fichiers JSON)

### Frontend
- React 18
- Material-UI (composants d'interface)
- Perfect Scrollbar
- CSS custom

## Auteurs

Projet de gestion de collection de cartes Pokémon développé pour cataloguer et visualiser une collection personnelle.
