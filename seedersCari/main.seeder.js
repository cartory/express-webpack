import wkx from 'wkx'

import zonas from "./zonas.json"
import places from "./places.json"
import visitas from './visitas.json'
import destinos from './destinos2.json'
import categories from "./categories.json"

import sequelize from "../src/config/sequelize"

import {
    Lugar, ImagenLugar,
    zonaUV, LugarCategoria,
    Consulta, ConsultaDestino,
} from '../src/config/relationships'

const seedPlaces = async () => {
    for (const category of categories) {
        await LugarCategoria.create({
            id: category.id,
            nombre: category.nombre
        });
    }

    places.map(async (place) => {
        let lugar = await Lugar.create({
            LugarCategoriumId: place.type,
            telefono: place.phone_number,
            ciudad: place.city,
            nombre: place.name,
            estado: place.state,
            lat: place.latitude,
            lng: place.longitude,
            // latLng: JSON.stringify([place.latitude, place.longitude]),
            direccion: place.direction,
            website: place.website,
            descripcion: place.description,
        });

        place.pictures.map(async (picture) => {
            await ImagenLugar.create({
                foto: picture.url,
                public_id: picture.formats.thumbnail.provider_metadata?.public_id,
                LugarId: lugar.getDataValue("id"),
            });
        });
    });
};

const seedZonasUV = async () => {
    await zonaUV.bulkCreate(zonas.map(zona => {
        return {
            id: zona.id,
            poligono: wkx.Geometry.parse(zona.poligono).toGeoJSON(),
        }
    }))
}

const seedConsultas = async () => {
    let consultas = visitas.filter(({ vstLatitud }) => {
        return Number.parseInt(vstLatitud) !== 0
    })

    consultas = consultas.map(v => {
        return {
            isWeb: v.vstImei !== "0",
            id: Number.parseInt(v.vstId),
            latLng: JSON.stringify([
                Number.parseFloat(v.vstLatitud),
                Number.parseFloat(v.vstLongitud),
            ]),
            fechaConsulta: new Date(Date.now() - Number.parseInt(v.vstFechaConsulta)),
        }
    })

    await Consulta.bulkCreate(consultas)
}

const seedDestinos = async () => {
    let consultas = destinos.pop().data.filter(({ repLatitudOrigen }) => {
        return Number.parseInt(repLatitudOrigen) !== 1
    })

    consultas = consultas.map(destino => {
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

    await ConsultaDestino.bulkCreate(consultas)
}

sequelize.authenticate()
    .then(async _ => {
        await sequelize.sync({ force: true })
        await seedPlaces()
        await seedZonasUV()
        await seedConsultas()
        await seedDestinos()
    })

    .catch(err => console.log(err))
