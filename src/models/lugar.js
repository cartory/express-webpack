import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/sequelize'
import Categoria from './categoria'

class Lugar extends Model { }
class ImagenLugar extends Model { }
class LugarCategoria extends Categoria {}
Lugar.init({
    id: {
        type: DataTypes.BIGINT,

        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    telefono: DataTypes.STRING,
   
    nombre: DataTypes.STRING,
    ciudad: DataTypes.STRING,
    website:DataTypes.STRING,
    lat:DataTypes.FLOAT,
    lng:DataTypes.FLOAT,
    //latLng: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    direccion: DataTypes.STRING,
}, { sequelize })



ImagenLugar.init({
    id: {
        type: DataTypes.BIGINT,

        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },

    foto: DataTypes.TEXT,
    public_id: DataTypes.STRING,
}, { sequelize })

LugarCategoria.init({
    id: {
        type: DataTypes.BIGINT,

        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },

    nombre: DataTypes.TEXT,
}, { sequelize })

export {
    Lugar,
    ImagenLugar,
    LugarCategoria
}