import { DataTypes, Model } from 'sequelize'
import sequelize from '../../config/sequelize'

class TransportType extends Model { }

TransportType.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    transport_type_name: DataTypes.TEXT,
    transport_type_name_original: DataTypes.TEXT,
    transport_type_icon: DataTypes.STRING,
    transport_type_icon_url: DataTypes.TEXT,
    transport_avaiable: DataTypes.BOOLEAN
}, {
    sequelize
})

export default TransportType