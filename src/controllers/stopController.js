import { Controller } from '../config/controller'

import sequelize from '../config/sequelize'
import { QueryTypes } from "sequelize"
import { Stop, City } from '../config/relationships'
class StopController extends Controller {
    constructor() {
        super(Stop)
    }

    stop_city = async (req, res) => {
        try {
            console.log(req.query.city_id);
            var stops = await City.findByPk(req.query.city_id, {
                include: [{
                    model: Stop,
                    attributes: {
                        exclude: ['CityId', 'createdAt', 'updatedAt', 'deletedAt']
                    }
                }],
                attributes: {
                    exclude: ['CountryId']
                }
            });
            res.status(200).json({ status: 200, message: `POI Status Added`, data: stops });
        } catch (error) {
            res.status(400).json({ status: 400, message: `POI status not added.`, data: stops });
        }
    }

    transport_near_stop = async (req, res) => {
        var { stop_id, city_id, distance } = req.query;
        try {

            var lines_near = await sequelize.query(`
                with tab as(
                select stop_lat,stop_lon from "Stops" where id=${stop_id}
                ),
                cte AS(
               select "Lines".id,"Lines".line_short_name,"Lines".line_icon,"Lines".line_wheelchair,"Shapes".shape_geom  from "Lines" 
               inner join "Shapes" on "Shapes".id = "Lines"."ShapeId"
               where 
               "TransportId" in
               (select id from "Transports" where "TransportTypeId" in 
               (select id from "TransportTypes" where "CityId"=${city_id})))
               select cte.shape_geom from cte,tab where 
                 st_distance(
                 st_transform(st_setsrid(st_makepoint(tab.stop_lon,tab.stop_lat), 4326),900913),
                 st_transform(shape_geom,900913)
                 ) <= ${distance}
            `, { type: QueryTypes.SELECT });


            res.status(200).json({ status: 200, message: `Near lines.`, data: lines_near });
        } catch (error) {
            res.status(400).json({ status: 400, message: `Near lines error.`, data: stops });
        }
    }


    stop_near = async (req, res) => {
        var { lat, lon, distance, city_id } = req.query;
        console.log(lat);
        if (distance && !(distance >= 50 && distance <= 600)) {
            distance = 200;
        } else {
            distance = 200;
        }

        try {
            var data = await sequelize.query(
                `
                select "Stops".id , "Stops".stop_name, "Stops".stop_description, "Stops".stop_lat, "Stops".stop_lon, "Stops".stop_wheelchair  from "Stops"  
                where ST_Distance(
	            ST_Transform(st_setsrid(ST_MakePoint("Stops".stop_lon,"Stops".stop_lat), 4326),3857),
	            ST_Transform(st_geomFromText('POINT(${lon} ${lat})', 4326),3857)
	            )<=${distance} AND "Stops"."CityId"=${city_id}
                `, { type: QueryTypes.SELECT }
            );


            res.status(200).json(
                {
                    "status": 200,
                    "message": "Near stops found.",
                    data: data
                }
            );
        } catch (error) {
            res.status(500).json({
                "status": 500,
                "message": "No near stops.",
            })
        }
    }

}

export default new StopController();