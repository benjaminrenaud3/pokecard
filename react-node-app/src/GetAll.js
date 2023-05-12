function getInfoFromExcel() {
    const XLSX = require('xlsx')
    const workbook = XLSX.readFile('./src/Pokedex.xlsx');
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    return(xlData);
}

function get3() {
    const data = getInfoFromExcel()
    const sliced = Object.fromEntries(Object.entries(data).slice(0,900))
    return sliced
}

async function getImage() {
    const pokemon = require('pokemontcgsdk')
    pokemon.configure({apiKey: '3c483995-e5ad-401b-9f45-d66606902832'})
    var data = get3()
    for(var myKey in data) {
        if (data[myKey]['ID no image'] == "no image" || data[myKey]['Present'] != "oui") {
            data[myKey].image = "https://images.pokemontcg.io/"
        }
        else {
            id = data[myKey]['ID']
            try {
                call = await pokemon.card.find(id)
                data[myKey].image = call.images.small
            }
            catch (error) {
                console.log(myKey, error)
                data[myKey].image = "https://images.pokemontcg.io/"
            }
        }
    }
    return (data)
}

module.exports = { getImage };