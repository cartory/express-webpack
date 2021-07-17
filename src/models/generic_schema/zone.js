import DataTypes,{  Model } from 'sequelize'
import sequelize from '../../config/sequelize'

class Zone extends Model { }

Zone.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    zone_name: DataTypes.TEXT,
    zone_geom: DataTypes.GEOMETRY
}, {
    sequelize
})

export default Zone