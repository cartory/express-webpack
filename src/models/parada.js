import DataTypes, { Model } from "sequelize";
import sequelize from "../config/sequelize";


class Parada extends Model { }

Parada.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    tipo: DataTypes.STRING,
    nombre: DataTypes.STRING,
}, {
    sequelize,
})

export default Parada
