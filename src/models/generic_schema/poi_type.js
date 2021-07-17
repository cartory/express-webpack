import DataTypes,{  Model } from 'sequelize'
import sequelize from '../../config/sequelize'

class PoiType extends Model { }

PoiType.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    type_name: DataTypes.TEXT
}, {
    sequelize
})

export default PoiType