import DataTypes,{  Model } from 'sequelize'
import sequelize from '../../config/sequelize'
import City from './city'

class TaxiFare extends Model { }

TaxiFare.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    taxi_formula: DataTypes.TEXT,
    taxi_original_name: DataTypes.TEXT
}, {
    sequelize
})

export default TaxiFare