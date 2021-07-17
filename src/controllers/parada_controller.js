import { Controller } from "../config/controller";
import Parada from "../models/parada";
import sequelize from "../config/sequelize";
import { QueryTypes } from "sequelize";
class ParadaController extends Controller {
    constructor() {
        super(Parada);
    }

    getNearRoutes = async (req, res) => {
        console.log(req.body);
        try {
            var data = await sequelize.query(
                `
                select id,name, st_flipcoordinates(
                   
                    
                    ST_LineLocatePoint(
                    st_transform(geom,900913),
                    st_transform(st_flipcoordinates(
                    st_geomFromText('POINT(${req.body.lat} ${req.body.lng})', 4326)),900913))  
                    ) as geom from ruta
                        where st_distance(
                        st_transform(st_flipcoordinates(st_geomFromText('POINT(${req.body.lat} ${req.body.lng})', 4326)),900913),
                        st_transform(geom	,900913)
                        ) <= 300 ;

                `
                // , { type: QueryTypes.SELECT }
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ error });
        }
    };


    nearest_stops = async (req, res) => {
        var { lat, lng, distancia } = req.query;

        if (distancia && !(distancia >= 50 && distancia <= 600)) {
            distancia = 200;
        } else {
            distancia = 200;
        }

        try {
            var data = await sequelize.query(
                `
                select "Paradas".id , "Paradas".nombre as nombre,"Paradas".tipo, "Paradas".lat, "Paradas".lng  from "Paradas"  
                where ST_Distance(
	            ST_Transform(st_setsrid(ST_MakePoint("Paradas".lng,"Paradas".lat), 4326),3857),
	            ST_Transform(st_geomFromText('POINT(${lng} ${lat})', 4326),3857)
	            )<=${distancia}
                `, { type: QueryTypes.SELECT }
            );


            res.status(200).json(data);
        } catch (error) {
            console.error(error)
            res.status(500).json({ error })
        }

    }

    nearest_lines = async (req, res) => {

        try {
            var data = await sequelize.query(
                `
                with tab as(
                select lat,lng from "Paradas" where id=${req.query.id}
                ) select ruta.geom from ruta,tab where 
                st_distance(
                st_transform(st_setsrid(st_makepoint(tab.lng,tab.lat), 4326),900913),
                st_transform(geom,900913)
                ) <= ${req.query.distancia}
                `
                , { type: QueryTypes.SELECT }
            );



            res.status(200).json(data);
        } catch (error) {
            console.error(error)
            res.status(500).json({ error })
        }
    }



    nearest_stops_route = async (req, res) => {
        try {
            var data = await sequelize.query(
                `
                SELECT "Paradas".id , "Paradas".nombre as nombre,"Paradas".tipo, "Paradas".lat, "Paradas".lng
                FROM ruta, "Paradas"
                WHERE ruta.id = '${req.query.id}' AND ST_DWithin(ruta.geom, ST_SetSRID(ST_MakePoint(lng,lat),4326), 0.00033)
                ORDER BY ST_LineLocatePoint(ruta.geom, ST_SetSRID(ST_MakePoint(lng,lat),4326)),
                ST_Distance(ruta.geom, ST_SetSRID(ST_MakePoint(lng,lat),4326));
                `, { type: QueryTypes.SELECT }
            );



            res.status(200).json(data);
        } catch (error) {
            console.error(error)
            res.status(500).json({ error })
        }

    }




    nearest_stops_ficticio = async (req, res) => {
        console.log(req.query);
        try {
            var data = await sequelize.query(
                `
                SELECT paradas_ficticias.id  as id, paradas_ficticias.geom, paradas_ficticias.name
                FROM ruta, paradas_ficticias
                WHERE ruta.id = ${req.query.id} AND ST_DWithin(ruta.geom, ST_SetSRID(paradas_ficticias.geom,4326), 0.0005)
                ORDER BY ST_LineLocatePoint(ruta.geom, ST_SetSRID(paradas_ficticias.geom,4326)),
                ST_Distance(ruta.geom, ST_SetSRID(paradas_ficticias.geom,4326));
                `,
                { type: QueryTypes.SELECT }
            );
            console.log(data);
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error });
        }
    };

    all_ficticio = async (req, res) => {
        console.log(req.query);
        try {
            var data = await sequelize.query(
                `
                SELECT * from paradas_ficticias
                `,
                { type: QueryTypes.SELECT }
            );
            console.log(data);
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error });
        }
    };
}

export default new ParadaController();
