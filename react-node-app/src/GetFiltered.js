async function getFiltered(names, generation, data) {
    //console.log(names, generation, data)
    if (names.length >= 1) {
        let objetsFiltres = Object.values(data).filter(objet => names.includes(objet.Nom));
        return objetsFiltres
    }
    else if (generation) {
        let objetsFiltres = Object.values(data).filter(objet => objet.Generation == generation);
        return objetsFiltres
    }
    else {
        return data
    }
}

async function getOrdered(typeofOrdered, data) {

    const dataArray = Object.values(data);

    const filteredData = dataArray.filter(obj => obj.image !== "https://images.pokemontcg.io/");

    const comparePriceAsc = (a, b) => a.price - b.price;
    const comparePriceDesc = (a, b) => b.price - a.price;
    const compareNameAsc = (a, b) => a.name.localeCompare(b.name);
    const compareNameDesc = (a, b) => b.name.localeCompare(a.name);

    switch (typeofOrdered) {
        case '3':
            filteredData.sort(comparePriceAsc);
            break;
        case '4':
            filteredData.sort(comparePriceDesc);
            break;
        case '1':
            filteredData.sort(compareNameAsc);
            break;
        case '2':
            filteredData.sort(compareNameDesc);
            break;
        default:
            console.log("Invalid typeofOrdered", typeofOrdered);
    }
    return filteredData;
}

module.exports = { getFiltered, getOrdered };