# Frontend - Interface de gestion de collection Pokémon

Application React qui affiche et gère votre collection de cartes Pokémon avec des fonctionnalités de recherche, filtrage et tri.

## Structure du projet

```
client/
├── public/               # Fichiers statiques
├── src/
│   ├── App.js           # Composant principal
│   ├── App.css          # Styles de l'application
│   ├── index.js         # Point d'entrée React
│   └── assets/          # Images et ressources
└── package.json
```

## Fonctionnalités

### 1. Affichage des cartes
- Vue en grille de toutes les cartes de votre collection
- Images récupérées depuis les fichiers JSON locaux via le backend
- Affichage d'une pokéball animée pendant le chargement

### 2. Vue détaillée
Cliquez sur une carte pour voir :
- Image en grand format
- Nom du Pokémon
- Description (flavor text)
- ID de la carte
- Nom du set
- Rareté
- Prix sur Cardmarket (tendance)
- Prix sur TCGplayer (market)

Cliquez à nouveau pour revenir à la liste (la position de scroll est conservée).

### 3. Recherche et filtres

#### Autocomplete multi-sélection
- Champ de recherche avec autocomplétion
- Sélection multiple de Pokémon par nom
- Bouton "Clear names" pour réinitialiser la sélection

#### Filtre par génération
Sélecteur permettant de filtrer par génération (1 à 9).

#### Bouton "Search"
Applique les filtres sélectionnés (noms et/ou génération).

### 4. Tri des cartes

Menu déroulant "Order By" proposant 6 options :
1. **Ordre alphabétique** (A → Z)
2. **Ordre alphabétique inverse** (Z → A)
3. **Prix croissant** (moins cher → plus cher)
4. **Prix décroissant** (plus cher → moins cher)
5. **Rareté croissante**
6. **Rareté décroissante**

Le tri exclut automatiquement les cartes sans image.

### 5. Bouton "Display All"
Réinitialise tous les filtres et affiche l'intégralité de la collection.

## Architecture technique

### État de l'application (useState)

```javascript
const [data, setData] = useState(null);           // Données des cartes
const [names, setNames] = useState(null);         // Liste des noms pour autocomplete
const [isLoading, setIsLoading] = useState(true); // État de chargement
const [selectedCarte, setSelectedCarte] = useState(null); // Carte sélectionnée
const [isOrdered, setOrder] = useState('');       // Type de tri actif
const [scrollPosition, setScrollPosition] = useState(0); // Position du scroll
const [filtres, setFilter] = useState({          // Filtres actifs
  Names: [],
  Generation: 1,
  Possede: ""
});
```

### Appels API

#### Chargement initial
```javascript
useEffect(() => {
  fetchData();    // Récupère toutes les cartes
  fetchNames();   // Récupère la liste des noms
}, []);
```

#### Endpoints utilisés
- `GET /getall` : Toutes les cartes
- `GET /getnames` : Noms pour autocomplete
- `GET /getone?generation=X&names=Y` : Cartes filtrées
- `GET /getordered?type=X` : Cartes triées

### Gestion du scroll
Le système conserve la position de scroll lors de l'ouverture d'une carte :
1. Au clic sur une carte, la position est sauvegardée
2. En mode détail, l'utilisateur voit la carte en grand
3. Au retour à la liste, le scroll revient à la position exacte

```javascript
function handleCarteClick(carte) {
  setScrollPosition(listRef.current.scrollTop);  // Sauvegarde
  setSelectedCarte(carte);
}

function handleBackToList() {
  setSelectedCarte(null);
  listRef.current.scrollTop = scrollPosition;    // Restauration
}
```

### Composants Material-UI utilisés

- **Autocomplete** : Recherche multi-sélection de Pokémon
- **TextField** : Champs de saisie
- **Select/MenuItem** : Sélecteurs de génération et tri
- **Button** : Boutons d'action
- **FormControl/InputLabel** : Conteneurs de formulaires

### Proxy API
Le fichier `package.json` configure un proxy vers le backend :
```json
"proxy": "http://localhost:3001/"
```

Cela permet d'appeler `/getall` au lieu de `http://localhost:3001/getall`.

## Gestion des images

### Chargement
```javascript
<img
  src={carte.image ? carte.image : 'https://images.pokemontcg.io/'}
  alt="pokemon"
/>
```

### Fallback
Si aucune image n'est disponible, l'URL par défaut de PokemonTCG est utilisée (affiche un placeholder).

## Styles

L'application utilise CSS custom (App.css) combiné avec les composants Material-UI pour :
- Layout responsive
- Grille de cartes
- Animations de chargement
- Vue détaillée en overlay

## Installation

```bash
npm install
```

## Démarrage en développement

```bash
npm start
```

L'application démarre sur `http://localhost:3000` et se connecte automatiquement au backend sur le port 3001.

## Build de production

```bash
npm run build
```

Génère un dossier `build/` optimisé pour la production, servi par le backend Express.

## Dépendances principales

- **react** & **react-dom** : Framework React
- **@mui/material** : Composants Material-UI
- **@emotion/react** & **@emotion/styled** : Styling pour Material-UI
- **perfect-scrollbar** : Amélioration du scroll
