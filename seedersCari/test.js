let destinos = require('./test.json')

destinos = destinos.pop().data.filter(({ repLatitudOrigen }) => {
    return Number.parseInt(repLatitudOrigen) !== 1
})

destinos = destinos.map(destino => {
    return {
        id: destino.repId,
        origen: JSON.stringify([
            Number.parseFloat(destino.repLatitudOrigen),
            Number.parseFloat(destino.repLongitudOrigen),
        ]),
        destino: JSON.stringify([
            Number.parseFloat(destino.repLatitudDestino),
            Number.parseFloat(destino.repLongitudDestino),
        ]),
        fechaConsulta: new Date(Date.now() - Number.parseInt(destino.repFechaConsulta)),
    }
})

console.log(destinos)