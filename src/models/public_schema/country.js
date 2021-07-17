import DataTypes,{  Model } from 'sequelize'
import sequelize from '../../config/sequelize'

class Country extends Model { }

Country.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    country_name: DataTypes.TEXT,
    country_original_name: DataTypes.TEXT,
    country_code: DataTypes.STRING,
    country_geom: DataTypes.GEOMETRY
}, {
    sequelize
})

export default Country