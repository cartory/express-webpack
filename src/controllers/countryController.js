import { Controller } from '../config/controller'
import { Country, City } from '../config/relationships'
class CountryController extends Controller {
    constructor() {
        super(Country)
    }

    country_get_cities = async (req, res) => {
        try {
            
            var cid = req.query.country_id;
            var cities = await Country.findByPk(cid,{
                include: [{
                    model: City,
                    attributes:{
                        exclude:['CountryId','createdAt','updatedAt','deletedAt']
                    }
                }],
                attributes: {
                    exclude: ['country_geom']
                }
            });
            res.status(200).json({ status: 200, message: `List of Cities.`, data: cities });
        } catch (error) {
            res.status(400).json({ status: 400, message: `Error.`, info: error });
        }
    }

   

}

export default new CountryController();