function findCardInJSON(cardId) {
    const fs = require('fs');
    const path = require('path');

    try {
        const setCode = cardId.split('-')[0];
        const jsonPath = path.join(__dirname, '..', 'cards', `${setCode}.json`);

        if (!fs.existsSync(jsonPath)) {
            return null;
        }
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const card = jsonData.find(c => c.id === cardId);

        return card || null;
    } catch (error) {
        return null;
    }
}

function getInfoFromExcel() {
    const XLSX = require('xlsx')
    const workbook = XLSX.readFile('./src/Pokedex.xlsx');
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    return(xlData);
}

function get3() {
    const data = getInfoFromExcel()
    const sliced = Object.fromEntries(Object.entries(data).slice(0,1035))
    return sliced
}

function getSetName(setCode) {
    const setNames = {
        'base1': 'Base Set', 'base2': 'Jungle', 'base3': 'Fossil', 'base4': 'Base Set 2',
        'base5': 'Team Rocket', 'base6': 'Legendary Collection', 'basep': 'Wizards Black Star Promos',
        'bp': 'Black Star Promos', 'bwp': 'BW Promo', 'bw1': 'Black & White',
        'bw2': 'Emerging Powers', 'bw3': 'Noble Victories', 'bw4': 'Next Destinies',
        'bw5': 'Dark Explorers', 'bw6': 'Dragons Exalted', 'bw7': 'Boundaries Crossed',
        'bw8': 'Plasma Storm', 'bw9': 'Plasma Freeze', 'bw10': 'Plasma Blast', 'bw11': 'Legendary Treasures',
        'cel25': 'Celebrations', 'cel25c': 'Celebrations Classic Collection',
        'col1': 'Call of Legends', 'dc1': 'Dragon Majesty', 'det1': 'Detective Pikachu',
        'dp1': 'Diamond & Pearl', 'dp2': 'Mysterious Treasures', 'dp3': 'Secret Wonders',
        'dp4': 'Great Encounters', 'dp5': 'Majestic Dawn', 'dp6': 'Legends Awakened', 'dp7': 'Stormfront',
        'dpp': 'DP Promos', 'dv1': 'Dragon Vault',
        'ecard1': 'Expedition Base Set', 'ecard2': 'Aquapolis', 'ecard3': 'Skyridge',
        'ex1': 'Ruby & Sapphire', 'ex2': 'Sandstorm', 'ex3': 'Dragon', 'ex4': 'Team Magma vs Team Aqua',
        'ex5': 'Hidden Legends', 'ex6': 'FireRed & LeafGreen', 'ex7': 'Team Rocket Returns',
        'ex8': 'Deoxys', 'ex9': 'Emerald', 'ex10': 'Unseen Forces', 'ex11': 'Delta Species',
        'ex12': 'Legend Maker', 'ex13': 'Holon Phantoms', 'ex14': 'Crystal Guardians',
        'ex15': 'Dragon Frontiers', 'ex16': 'Power Keepers',
        'fut20': 'Futsal Collection', 'g1': 'Generations',
        'gym1': 'Gym Heroes', 'gym2': 'Gym Challenge',
        'hgss1': 'HeartGold & SoulSilver', 'hgss2': 'Unleashed', 'hgss3': 'Undaunted', 'hgss4': 'Triumphant',
        'hsp': 'HGSS Promos',
        'mcd11': "McDonald's Collection 2011", 'mcd12': "McDonald's Collection 2012",
        'mcd14': "McDonald's Collection 2014", 'mcd15': "McDonald's Collection 2015",
        'mcd16': "McDonald's Collection 2016", 'mcd17': "McDonald's Collection 2017",
        'mcd18': "McDonald's Collection 2018", 'mcd19': "McDonald's Collection 2019",
        'mcd21': "McDonald's Collection 2021", 'mcd22': "McDonald's Collection 2022",
        'me1': 'Miscellaneous Cards & Products', 'neo1': 'Neo Genesis', 'neo2': 'Neo Discovery',
        'neo3': 'Neo Revelation', 'neo4': 'Neo Destiny', 'np': 'Nintendo Promos',
        'pgo': 'Pokémon GO', 'pl1': 'Platinum', 'pl2': 'Rising Rivals', 'pl3': 'Supreme Victors', 'pl4': 'Arceus',
        'pop1': 'POP Series 1', 'pop2': 'POP Series 2', 'pop3': 'POP Series 3', 'pop4': 'POP Series 4',
        'pop5': 'POP Series 5', 'pop6': 'POP Series 6', 'pop7': 'POP Series 7', 'pop8': 'POP Series 8', 'pop9': 'POP Series 9',
        'rsv10pt5': 'Reserve 10.5', 'ru1': 'Rumble',
        'si1': 'Southern Islands', 'sm1': 'Sun & Moon', 'sm2': 'Guardians Rising', 'sm3': 'Burning Shadows',
        'sm35': 'Shining Legends', 'sm4': 'Crimson Invasion', 'sm5': 'Ultra Prism', 'sm6': 'Forbidden Light',
        'sm7': 'Celestial Storm', 'sm75': 'Dragon Majesty', 'sm8': 'Lost Thunder', 'sm9': 'Team Up',
        'sm10': 'Unbroken Bonds', 'sm11': 'Unified Minds', 'sm115': 'Hidden Fates', 'sm12': 'Cosmic Eclipse',
        'sma': 'SM Promos', 'smp': 'SM Black Star Promos',
        'sv1': 'Scarlet & Violet', 'sv2': 'Paldea Evolved', 'sv3': 'Obsidian Flames', 'sv3pt5': 'Pokémon 151',
        'sv4': 'Paradox Rift', 'sv4pt5': 'Paldean Fates', 'sv5': 'Temporal Forces', 'sv6': 'Twilight Masquerade',
        'sv6pt5': 'Shrouded Fable', 'sv7': 'Stellar Crown', 'sv8': 'Surging Sparks', 'sv8pt5': 'Prismatic Evolutions',
        'sv9': 'Blooming Waters', 'sv10': 'Journey Together',
        'sve': 'Scarlet & Violet Energies', 'svp': 'SV Promo',
        'swsh1': 'Sword & Shield', 'swsh2': 'Rebel Clash', 'swsh3': 'Darkness Ablaze', 'swsh35': 'Champion\'s Path',
        'swsh4': 'Vivid Voltage', 'swsh45': 'Shining Fates', 'swsh45sv': 'Shiny Vault', 'swsh5': 'Battle Styles',
        'swsh6': 'Chilling Reign', 'swsh7': 'Evolving Skies', 'swsh8': 'Fusion Strike', 'swsh9': 'Brilliant Stars',
        'swsh9tg': 'Brilliant Stars Trainer Gallery', 'swsh10': 'Astral Radiance', 'swsh10tg': 'Astral Radiance Trainer Gallery',
        'swsh11': 'Lost Origin', 'swsh11tg': 'Lost Origin Trainer Gallery', 'swsh12': 'Silver Tempest',
        'swsh12pt5': 'Crown Zenith', 'swsh12pt5gg': 'Crown Zenith Galarian Gallery', 'swsh12tg': 'Silver Tempest Trainer Gallery',
        'swshp': 'SWSH Promo',
        'tk1a': 'Trainer Kit - Alolan Sandslash', 'tk1b': 'Trainer Kit - Alolan Ninetales',
        'tk2a': 'Trainer Kit - Lycanroc', 'tk2b': 'Trainer Kit - Alolan Raichu',
        'xy0': 'Kalos Starter Set', 'xy1': 'XY', 'xy2': 'Flashfire', 'xy3': 'Furious Fists',
        'xy4': 'Phantom Forces', 'xy5': 'Primal Clash', 'xy6': 'Roaring Skies', 'xy7': 'Ancient Origins',
        'xy8': 'BREAKthrough', 'xy9': 'BREAKpoint', 'xy10': 'Fates Collide', 'xy11': 'Steam Siege', 'xy12': 'Evolutions',
        'xyp': 'XY Promos', 'zsv10pt5': 'Zenith Expansion'
    };
    return setNames[setCode] || setCode.toUpperCase();
}

function completeData(data, call, myKey) {
    const defaultImageUrl = "https://images.pokemontcg.io/";

    // Extraire le code du set et le numéro depuis l'ID de la carte
    const cardId = call?.id || "";
    const setCode = cardId.split('-')[0] || "";
    const cardNumber = call?.number || "";

    // Préserver toutes les données Excel existantes et ajouter les nouvelles propriétés
    data[myKey] = {
        ...data[myKey], // Garder toutes les propriétés Excel (Generation, Nom, Num, etc.)
        image: data[myKey].image,
        largeimage: call?.images?.large ?? defaultImageUrl,
        desc: call?.flavorText ?? "",
        rarity: call?.rarity ?? "",
        setname: getSetName(setCode),
        setid: cardId,
        name: call?.name ?? "",
        subtype: call?.data?.subtype ?? "",
    };

    return data;
}

async function getImage() {
    var data = get3()
    for(var myKey in data) {
        if (data[myKey]['ID no image'] == "no image" || data[myKey]['Present'] != "oui") {
            data[myKey].image = "https://images.pokemontcg.io/"
            // Ajouter les données de base même sans image valide
            data[myKey].name = data[myKey].Nom || '';
            data[myKey].rarity = '';
            data[myKey].desc = '';
            data[myKey].setname = '';
            data[myKey].setid = '';
            data[myKey].largeimage = "https://images.pokemontcg.io/";
        }
        else {
            id = data[myKey]['ID']
            call = {}
            try {
                call = findCardInJSON(id)
                if (call && call.images && call.images.small) {
                    data[myKey].image = call.images.small
                    // Toujours compléter les données si on trouve la carte dans le JSON
                    data = completeData(data, call, myKey)
                } else {
                    data[myKey].image = "https://images.pokemontcg.io/"
                    // Ajouter les données de base même sans image valide
                    data[myKey].name = data[myKey].Nom || '';
                    data[myKey].rarity = '';
                    data[myKey].desc = '';
                    data[myKey].setname = '';
                    data[myKey].setid = '';
                    data[myKey].largeimage = "https://images.pokemontcg.io/";
                }
            }
            catch (error) {
                //console.log(myKey, error)
                data[myKey].image = "https://images.pokemontcg.io/"
                // Ajouter les données de base même en cas d'erreur
                data[myKey].name = data[myKey].Nom || '';
                data[myKey].rarity = '';
                data[myKey].desc = '';
                data[myKey].setname = '';
                data[myKey].setid = '';
                data[myKey].largeimage = "https://images.pokemontcg.io/";
            }
        }
    }
    return (data)
}

module.exports = { getImage };