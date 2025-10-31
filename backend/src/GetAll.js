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

function completeData(data, call, myKey) {
    const defaultImageUrl = "https://images.pokemontcg.io/";

    data[myKey] = {
        image: data[myKey].image,
        largeimage: call?.images?.large ?? defaultImageUrl,
        pricecardmarket: call?.cardmarket?.prices?.trendPrice ?? 0,
        pricetcgplayer: call?.tcgplayer?.prices?.normal?.market ?? 0,
        desc: call?.flavorText ?? "",
        rarity: call?.rarity ?? "",
        setname: call?.set?.name ?? "",
        setid: call?.set?.id ?? "",
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
        }
        else {
            id = data[myKey]['ID']
            call = {}
            try {
                call = findCardInJSON(id)
                if (call && call.images && call.images.small) {
                    data[myKey].image = call.images.small
                } else {
                    data[myKey].image = "https://images.pokemontcg.io/"
                }
            }
            catch (error) {
                //console.log(myKey, error)
                data[myKey].image = "https://images.pokemontcg.io/"
            }
            if (data[myKey].image != "https://images.pokemontcg.io/") {
                data = completeData(data, call, myKey)
            }
        }
    }
    return (data)
}

module.exports = { getImage };