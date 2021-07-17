import wkx from 'wkx'

import zonas from "./zonas.json"
import places from "./places.json"

import visitas from './visitas.json'
import destinos from './destinos.json'

import poiTypes from "./PoiTypes.json"
import poiStatuses from './PoiStatuses.json'

import sequelize from "../src/config/sequelize"

import {
    Lugar, ImagenLugar,
    zonaUV, LugarCategoria,
    Consulta, ConsultaDestino, PoiType, Poi, PoiStatus,
} from '../src/config/relationships'



const seedPoi = async () => {
    const t = await sequelize.transaction();
    try {
        for (const poiStatus of poiStatuses) {
            await PoiStatus.create({

                status_name: poiStatus.status_name,
                status_is_available: true
            }, { transaction: t });
        }
        for (const aPoiType of poiTypes) {
            await PoiType.create({
                id: aPoiType.id,
                type_name: aPoiType.nombre,
            }, { transaction: t });
        }
        for (const place of places) {
            let lugar = await Poi.create({

                PoiTypeId: place.type,
                poi_phone_number: place.phone_number,
                ciudad: place.city,
                poi_original_name: place.name,
                poi_name: place.name,
                PoiStatusId: place.state,
                poi_lat: place.latitude,
                poi_lon: place.longitude,
                // latLng: JSON.stringify([place.latitude, place.longitude]),
                poi_direction: place.direction,
                poi_website: place.website,
                poi_description: place.description,
            }, { transaction: t });

            // place.pictures.map(async (picture) => {
            // 	await ImagenLugar.create({
            // 		foto: picture.url,
            // 		public_id:
            // 			picture.formats.thumbnail.provider_metadata?.public_id,
            // 		LugarId: lugar.getDataValue("id"),
            // 	});
            // },{transaction:t});

        }

        await t.commit();
    } catch (error) {

        console.log(error);
        await t.rollback();
    }
};

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
    let consultas = destinos.filter(({ repLatitudOrigen }) => {
        return Number.parseInt(repLatitudOrigen) !== 1
    })

    consultas.forEach(async destino => {
        let route = [
            // ORIGEN
            [Number.parseFloat(destino.repLatitudOrigen), Number.parseFloat(destino.repLongitudOrigen)],
            // DESTINO
            [Number.parseFloat(destino.repLatitudDestino), Number.parseFloat(destino.repLongitudDestino)],
        ]

        let [source, __] = await sequelize.query(zonaUV.ST_Contains(route[0]))
        let [destiny, _] = await sequelize.query(zonaUV.ST_Contains(route[1]))

        await ConsultaDestino.create({
            id: destino.repId,
            origen: JSON.stringify(route[0]),
            destino: JSON.stringify(route[1]),
            origenId: source.length > 0 ? Number.parseInt(source[0]['id']) : null,
            destinoId: destiny.length > 0 ? Number.parseInt(destiny[0]['id']) : null,
            fechaConsulta: new Date(Date.now() - Number.parseInt(destino.repFechaConsulta)),
        })
    })
}

const seedZonesUV = async () => {
    await zonaUV.bulkCreate(
        zonas.map((zona) => {
            return {
                id: zona.id,
                poligono: wkx.Geometry.parse(zona.poligono).toGeoJSON(),
            };
        })
    );
}

sequelize.authenticate()
    .then(async _ => {
        await sequelize.sync({ force: true })
        await seedZonesUV()
        await seedPoi()
        await seedConsultas()
        await seedDestinos()
    })

    .catch((err) => console.log(err));

