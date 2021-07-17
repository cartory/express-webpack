import { DataTypes, Model } from 'sequelize'
import sequelize from '../../config/sequelize'
import TransportType from './transport_type'

class Transport extends Model { }

Transport.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    transport_name: DataTypes.TEXT,
    transport_name_original: DataTypes.TEXT,
    
    //
    transport_code: DataTypes.STRING,
    
    transport_icon: DataTypes.STRING,
    transport_icon_url: DataTypes.TEXT,
    transport_description: DataTypes.TEXT,
    transport_url: DataTypes.TEXT,
}, {
    sequelize
})

export default Transport