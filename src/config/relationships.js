import Poi from '../models/generic_schema/poi'
import Zone from '../models/generic_schema/zone'
import Line from '../models/generic_schema/line'
import Stop from '../models/generic_schema/stop'
import Shape from '../models/generic_schema/shape'
import Picture from '../models/generic_schema/picture'
import PoiType from '../models/generic_schema/poi_type'
import Transport from '../models/generic_schema/transport'
import PoiStatus from '../models/generic_schema/poi_status'
import TransportType from '../models/generic_schema/transport_type'

import User from '../models/public_schema/user'
import City from '../models/public_schema/city'
import Country from '../models/public_schema/country'
import TaxiFare from '../models/public_schema/taxi_fare'

import Ruta from '../models/ruta'
import zonaUV from '../models/zonaUV'
import Usuario from '../models/usuario'
import Consulta from '../models/consulta'
import Categoria from '../models/categoria'
import Transporte from '../models/transporte'
import ConsultaDestino from '../models/consultaDestino'
import { Lugar, ImagenLugar, LugarCategoria } from '../models/lugar'

Transporte.hasMany(Ruta, {
    foreignKey: 'transporte_id'
});

Ruta.belongsTo(Transporte, {
    foreignKey: 'transporte_id'
});

Usuario.hasMany(Consulta)
Consulta.belongsTo(Usuario)

Usuario.hasMany(ConsultaDestino)
ConsultaDestino.belongsTo(Usuario)

Lugar.hasMany(ImagenLugar)
ImagenLugar.belongsTo(Lugar)

LugarCategoria.hasMany(Lugar)
Lugar.belongsTo(LugarCategoria)


Lugar.hasMany(ImagenLugar)
ImagenLugar.belongsTo(Lugar)

Lugar.belongsTo(LugarCategoria)
LugarCategoria.hasMany(Lugar)

// Country has many cities
Country.hasMany(City);
City.belongsTo(Country);

// A city has one taxi fare
City.hasOne(TaxiFare)
TaxiFare.belongsTo(City);

// A city has many Points of Interests
City.hasMany(Poi);
Poi.belongsTo(City);

// A user suggests many POIs
User.hasMany(Poi);
Poi.belongsTo(User);

// A user suggests many Transports
User.hasMany(Transport);
Transport.belongsTo(User);

// A User lives in a city
City.hasMany(User, { foreignKey: { allowNull: true } })
User.belongsTo(City);

// Transport has many types
TransportType.hasOne(Transport);
Transport.belongsTo(TransportType);

//  Transport has many Lines
Transport.hasMany(Line);
Line.belongsTo(Transport);

// A line has many shapes (geomertry)
Shape.hasMany(Line);
Line.belongsTo(Shape);

// A line can have many pictures
Transport.hasMany(Picture);
Picture.belongsTo(Transport);

// A Stop has many pictures
Stop.hasMany(Picture);
Picture.belongsTo(Stop);

// A city has many stops
City.hasMany(Stop);
Stop.belongsTo(City);

// One POI has many pictures
Poi.hasMany(Picture);
Picture.belongsTo(Poi);

// One POI has one status
PoiStatus.hasOne(Poi)
Poi.belongsTo(PoiStatus);

// One POI belongs to one type
PoiType.hasOne(Poi)
Poi.belongsTo(PoiType);

// One POI has many pictures
City.hasMany(TransportType);
TransportType.belongsTo(City);

// A city has a related geographical zone
City.hasOne(Zone)
Zone.belongsTo(City);

// ZonaUV -> ConsultaDestino (Origin, Destiny)
zonaUV.hasMany(ConsultaDestino, { foreignKey: 'origenId' })
ConsultaDestino.belongsTo(zonaUV, { foreignKey: 'origenId' })

zonaUV.hasMany(ConsultaDestino, { foreignKey: 'destinoId' })
ConsultaDestino.belongsTo(zonaUV, { foreignKey: 'destinoId' })

export {
    Poi,
    City,
    User,
    Line,
    Ruta,
    zonaUV,
    PoiType,
    Country,
    TaxiFare,
    PoiStatus,
    Transport,
    Transporte,
    TransportType,

    Lugar,
    ImagenLugar,
    LugarCategoria,

    Shape,
    Stop,
    Zone,
    Picture,

    Usuario,
    Categoria,

    Consulta,
    ConsultaDestino,
}
