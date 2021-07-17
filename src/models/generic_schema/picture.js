import DataTypes, { Model } from 'sequelize'
import sequelize from '../../config/sequelize'

class Picture extends Model { }

Picture.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    pic_caption: DataTypes.STRING,
    pic_height: DataTypes.INTEGER,
    pic_width: DataTypes.INTEGER,
    pic_url: DataTypes.TEXT,
    pic_thumbnail_url: DataTypes.TEXT,
    pic_is_available: DataTypes.BOOLEAN
}, {
    sequelize
})

export default Picture