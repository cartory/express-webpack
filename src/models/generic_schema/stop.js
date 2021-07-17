import DataTypes, { Model } from 'sequelize'
import sequelize from '../../config/sequelize'
import Poi from './poi'

class Stop extends Model { }

Stop.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    stop_name: DataTypes.TEXT,
    stop_description: DataTypes.TEXT,
    stop_original_name: DataTypes.TEXT,
    stop_url: DataTypes.TEXT,
    stop_lat: DataTypes.FLOAT,
    stop_lon: DataTypes.FLOAT,
    stop_wheelchair: DataTypes.BOOLEAN
}, {
    sequelize
})

export default Stop