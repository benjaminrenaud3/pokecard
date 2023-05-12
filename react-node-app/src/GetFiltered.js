async function getFiltered(names, generation, data) {
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

module.exports = { getFiltered };