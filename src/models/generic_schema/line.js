import { DataTypes, Model } from 'sequelize'
import sequelize from '../../config/sequelize'

class Line extends Model { }

Line.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    line_short_name: DataTypes.TEXT,
    line_headsign: DataTypes.STRING,
    line_icon: DataTypes.STRING,
    line_is_available: DataTypes.BOOLEAN,
    line_wheelchair: DataTypes.BOOLEAN
}, {
    sequelize
})

export default Line