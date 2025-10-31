# Backend - Serveur API Pokemon Cards

Ce dossier contient le backend de l'application de gestion de collection de cartes Pokémon. Le serveur Express récupère les données depuis les fichiers JSON locaux et les met à disposition du frontend via une API REST.

## Structure du projet

```
backend/
├── server/
│   └── index.js          # Point d'entrée du serveur Express
├── src/
│   ├── GetAll.js         # Récupération de toutes les cartes avec enrichissement
│   ├── GetNames.js       # Extraction des noms des Pokémon
│   ├── GetFiltered.js    # Filtrage et tri des cartes
│   └── Pokedex.xlsx      # Fichier Excel listant votre collection
├── cards/                # Dossier contenant les fichiers JSON des cartes
│   ├── sv1.json
│   ├── sv2.json
│   └── ...               # Un fichier JSON par set de cartes
└── package.json
```

## Fonctionnement technique

### Récupération des données locales

Le système n'utilise plus l'API PokemonTCG (devenue payante) mais récupère les données depuis des fichiers JSON locaux stockés dans le dossier `cards/`.

#### Principe de résolution des IDs
Les IDs des cartes sont au format `AA-BB` où :
- `AA` = code du set (ex: "sv1", "swsh12", "xy5")
- `BB` = numéro de la carte dans le set

**Exemple**: Pour l'ID `sv1-25`
1. Extraction du set: `sv1`
2. Ouverture du fichier: `cards/sv1.json`
3. Recherche de la carte avec l'ID exact `sv1-25`
4. Récupération de `images.small` pour l'image de la carte

### Modules principaux

#### GetAll.js
Fonction principale `getImage()` qui :
1. Lit le fichier Excel `Pokedex.xlsx` contenant votre liste de cartes
2. Pour chaque carte marquée "oui" dans la colonne `Present`:
   - Appelle `findCardInJSON(id)` pour récupérer les données depuis les fichiers JSON
   - Extrait l'image, les prix, la rareté, la description, etc.
   - Gère les erreurs avec un fallback vers une URL par défaut
3. Retourne un objet complet avec toutes les cartes enrichies

**Fonction `findCardInJSON(cardId)`**:
```javascript
// Extrait le code du set depuis l'ID (partie avant le tiret)
const setCode = cardId.split('-')[0];  // "sv1-25" → "sv1"

// Construit le chemin vers le fichier JSON
const jsonPath = path.join(__dirname, '..', 'cards', `${setCode}.json`);

// Lit et parse le JSON, puis cherche la carte avec l'ID exact
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const card = jsonData.find(c => c.id === cardId);
```

#### GetNames.js
Extrait la liste de tous les noms de Pokémon depuis le fichier Excel pour alimenter l'autocomplete du frontend.

#### GetFiltered.js
Fournit deux fonctions:
- `getFiltered()`: Filtre les cartes par nom ou génération
- `getOrdered()`: Trie les cartes par prix, nom ou rareté (ascendant/descendant)

### API Endpoints

Le serveur expose 4 endpoints REST:

#### `GET /getall`
Récupère toutes les cartes avec leurs informations complètes.
- **Cache**: 259200 secondes (3 jours)
- **Réponse**: `{ cachedData: {...} }`

#### `GET /getnames`
Récupère la liste des noms de Pokémon pour l'autocomplete.
- **Cache**: 3600 secondes (1 heure)
- **Réponse**: `{ cachedData: ["Pikachu", "Charizard", ...] }`

#### `GET /getone?names=...&generation=...`
Filtre les cartes selon les critères.
- **Params**: `names` (array), `generation` (number)
- **Réponse**: `{ filtered: [...] }`

#### `GET /getordered?type=...`
Trie les cartes selon le type demandé.
- **Params**: `type` (1-6)
  - 1: Ordre alphabétique
  - 2: Ordre alphabétique inverse
  - 3: Prix croissant
  - 4: Prix décroissant
  - 5: Rareté croissante
  - 6: Rareté décroissante
- **Réponse**: `{ Ordered: [...] }`

### Système de cache

Le serveur utilise `node-cache` pour limiter le nombre de lectures de fichiers:
- Les données complètes sont mises en cache pendant 3 jours
- Les noms sont mis en cache pendant 1 heure
- Le cache se vide automatiquement après expiration

### Service de fichiers statiques

Le serveur sert également le build du frontend React:
```javascript
app.use(express.static(path.resolve(__dirname, '../../frontend/build')));
```

## Prérequis

- Node.js 14.x ou supérieur
- Fichier Excel `Pokedex.xlsx` avec les colonnes:
  - `ID`: ID de la carte au format TCG (ex: "sv1-25")
  - `ID no image`: "no image" si pas d'image disponible
  - `Present`: "oui" si la carte est dans votre collection
  - `Nom`: Nom du Pokémon
  - `Generation`: Numéro de génération

## Installation

```bash
npm install
```

## Démarrage

```bash
npm start
```

Le serveur démarre sur le port 3001 (ou le port défini dans `process.env.PORT`).

## Dépendances principales

- **express**: Serveur web
- **node-cache**: Système de cache en mémoire
- **xlsx**: Lecture du fichier Excel
- **fs/path**: Lecture des fichiers JSON locaux
