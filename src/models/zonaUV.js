import sequelize from '../config/sequelize'
import { Model, DataTypes } from 'sequelize'

class ZonaUV extends Model { }

ZonaUV.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },

    poligono: {
        allowNull: false,
        type: DataTypes.GEOMETRY('POLYGON'),
    },
}, {
    sequelize
})

/**
 * Devuelve que zonaUV contiene el punto
 */
ZonaUV.ST_contains = (([lat, lng]) => {
    return (`
        SELECT z.*
        FROM public."zonaUVs" as z
        WHERE ST_contains(
            ST_FlipCoordinates(z.poligono),
            ST_GeomFromText('POINT (${lng} ${lat})', 4326)
        );
    `)
})

export default ZonaUV