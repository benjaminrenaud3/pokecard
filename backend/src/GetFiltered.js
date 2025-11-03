// Fonction pour obtenir le score de rareté (plus le score est élevé, plus c'est rare)
function getRarityScore(rarity) {
    const rarityScores = {
        // Raretés standard
        'Common': 1,
        'Uncommon': 2,
        'Rare': 3,
        'Rare Holo': 4,
        'Rare Holo EX': 5,

        // Raretés spéciales anciennes générations
        'Rare Prism Star': 6,

        // Raretés GX/V/VMAX
        'Rare Holo GX': 7,
        'Rare Holo V': 8,
        'Rare Holo VMAX': 9,
        'Rare Holo VSTAR': 9,
        'Rare VMAX': 9,
        'Rare ACE': 9,

        // Ultra Rares
        'Ultra Rare': 10,
        'Rare Ultra': 10,

        // Rainbow et Secret
        'Rare Rainbow': 11,
        'Rare Secret': 12,

        // Raretés modernes (Scarlet & Violet)
        'Double Rare': 13,
        'Illustration Rare': 14,
        'Special Illustration Rare': 15,
        'Hyper Rare': 16,

        // Autres raretés spéciales
        'LEGEND': 11,
        'Amazing Rare': 11,
        'Radiant Rare': 11,
        'Shiny Rare': 12,
        'Rare Shiny': 12,
        'Rare Shining': 12,
        'Shiny Ultra Rare': 13,
        'Trainer Gallery Rare Holo': 10,

        // Promos
        'Promo': 3
    };

    return rarityScores[rarity] || 0;
}

async function getFiltered(names, generation, data) {
    //console.log(names, generation, data)
    if (names.length >= 1) {
        // Filtrer par noms et retourner un objet avec les mêmes clés
        let filteredObj = {};
        Object.entries(data).forEach(([key, value]) => {
            if (names.includes(value.Nom)) {
                filteredObj[key] = value;
            }
        });
        return filteredObj;
    }
    else if (generation) {
        // Filtrer par génération et retourner un objet avec les mêmes clés
        let filteredObj = {};
        Object.entries(data).forEach(([key, value]) => {
            if (value.Generation == generation) {
                filteredObj[key] = value;
            }
        });
        return filteredObj;
    }
    else {
        return data
    }
}

async function getOrdered(typeofOrdered, data) {
    // Convertir en tableau d'entrées [clé, valeur] pour conserver les clés
    const dataEntries = Object.entries(data);

    // Filtrer les cartes sans image
    let filteredEntries = dataEntries.filter(([key, obj]) => obj.image !== "https://images.pokemontcg.io/");

    const compareNameAsc = (a, b) => {
        const nameA = a[1].name || a[1].Nom || '';
        const nameB = b[1].name || b[1].Nom || '';
        return nameA.localeCompare(nameB);
    };

    const compareNameDesc = (a, b) => {
        const nameA = a[1].name || a[1].Nom || '';
        const nameB = b[1].name || b[1].Nom || '';
        return nameB.localeCompare(nameA);
    };

    // Tri par rareté en utilisant le score de rareté
    const compareRarityAsc = (a, b) => {
        const scoreA = getRarityScore(a[1].rarity || '');
        const scoreB = getRarityScore(b[1].rarity || '');
        // Si les scores sont égaux, trier par nom
        if (scoreA === scoreB) {
            const nameA = a[1].name || a[1].Nom || '';
            const nameB = b[1].name || b[1].Nom || '';
            return nameA.localeCompare(nameB);
        }
        return scoreA - scoreB; // Ordre croissant (Common -> Hyper Rare)
    };

    const compareRarityDesc = (a, b) => {
        const scoreA = getRarityScore(a[1].rarity || '');
        const scoreB = getRarityScore(b[1].rarity || '');
        // Si les scores sont égaux, trier par nom
        if (scoreA === scoreB) {
            const nameA = a[1].name || a[1].Nom || '';
            const nameB = b[1].name || b[1].Nom || '';
            return nameA.localeCompare(nameB);
        }
        return scoreB - scoreA; // Ordre décroissant (Hyper Rare -> Common)
    };

    // Convertir en string pour la comparaison
    const orderType = String(typeofOrdered);

    switch (orderType) {
        case '1':
            filteredEntries.sort(compareNameAsc);
            break;
        case '2':
            filteredEntries.sort(compareNameDesc);
            break;
        case '3':
            filteredEntries.sort(compareRarityAsc);
            break;
        case '4':
            filteredEntries.sort(compareRarityDesc);
            break;
        default:
            break;
    }

    // Retourner un objet avec des clés numériques pour préserver l'ordre
    const orderedObject = {};
    filteredEntries.forEach(([key, value], index) => {
        orderedObject[index] = value;
    });

    return orderedObject;
}

module.exports = { getFiltered, getOrdered };