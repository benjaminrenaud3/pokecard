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

async function getNames() {
    var names = []
    var data = get3()
    for(var myKey in data) {
        names.push(data[myKey]['Nom'])
    }
    return (names)
}

module.exports = { getNames };