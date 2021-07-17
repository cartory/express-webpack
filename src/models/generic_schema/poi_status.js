import DataTypes, { Model } from 'sequelize'
import sequelize from '../../config/sequelize'

class PoiStatus extends Model { }

PoiStatus.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    status_name: DataTypes.TEXT,
    status_is_available: DataTypes.BOOLEAN,
}, {
    sequelize
})

export default PoiStatus