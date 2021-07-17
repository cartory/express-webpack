import { Controller } from '../config/controller'
import sequelize from '../config/sequelize'
import { TransportType, Transport, City, Line, Shape, Picture } from '../config/relationships'
import { QueryTypes } from "sequelize"
import axios from 'axios';
import { decode, encode } from '@mapbox/polyline'
import * as turf from '@turf/turf';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

class TransportController extends Controller {
    constructor() {
        super(Transport)
    }

    get_city_transport = async (req, res) => {
        var { city_id } = req.query;
        try {
            var transports = await TransportType.findAll({
                where: {
                    CityId: city_id,
                    transport_avaiable: true
                },
                attributes: {
                    exclude: ['CityId', 'transport_avaiable']
                }
            });
            res.status(200).json({ status: 200, message: `List of Transport Types`, data: transports });
        } catch (error) {
            res.status(400).json({ status: 400, message: `Error.`, info: error });
        }
    }

    get_types_transport = async ({ query }, res) => {
        let { type_id = 1, page = 0, limit = 10 } = query;

        try {
            let transports = await Transport.findAll({
                offset: limit * page,
                limit: limit,
                where: {
                    TransportTypeId: type_id
                },
                attributes: {
                    exclude: ['UserId', 'TransportTypeId']
                },
                include: [{
                    model: Line,
                    attributes: {
                        exclude: ['ShapeId', 'createdAt', 'updatedAt', 'deletedAt', 'TransportId']
                    },
                    include: [{
                        model: Shape
                    }]
                }, {
                    model: Picture
                }]
            });

            let rows = await Transport.count()

            return res.status(200).json({
                status: 200,
                message: `List of Transport Types`,
                rows,
                limit,
                pages: Math.round(rows / limit + .4),
                data: transports,
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ status: 400, message: `Error.`, info: error });
        }
    }

    get_transport_lines = async (req, res) => {
        var { transport_id } = req.body;
        try {
            var transports = await Transport.findAll({
                where: {
                    id: transport_id
                },
                include: [{
                    model: Line,
                    all: true,
                    include: [{
                        model: Shape
                    }]
                },
                {
                    model: Picture
                }
                ]
            });
            res.status(200).json({ status: 200, message: `List of Transport Types`, transport_data: transports });
        } catch (error) {
            res.status(400).json({ status: 400, message: `Error.`, info: error });
        }
    }

    create_transport_type = async (req, res) => {
        var { name, original_name, material_icon } = req.body;

        try {
            var cities = await TransportType.create({
                transport_type_name: name,
                transport_type_name_original: original_name,
                transport_type_icon: material_icon,
                transport_type_icon_url: '',
                transport_avaiable: true
            }, {
                fields: ['transport_type_name', 'transport_type_name_original', 'transport_type_icon', 'transport_type_icon_url', 'transport_avaiable']
            });
            res.status(200).json({ status: 200, message: `List of Cities.`, country_data: cities });
        } catch (error) {
            res.status(400).json({ status: 400, message: `Error.`, info: error });
        }
    }

    create_route_from_user = async (req, res) => {
        var { transport_type, name, headsign, coords, user_id, description, pictures } = req.body;
        const t = await sequelize.transaction();
        try {

            var transport_created = await Transport.create(
                {
                    transport_name: name,
                    transport_name_original: name,
                    transport_description: (description) ? description : null,
                    UserId: user_id,
                    TransportTypeId: transport_type
                }, {
                fields: ['transport_name', 'transport_name_original', 'transport_description', 'UserId', 'TransportTypeId'],
                transaction: t
            }
            );

            var line = {
                type: 'LineString',
                coordinates: coords,
                crs: { type: 'name', properties: { name: 'EPSG:4326' } }
            };

            var shape_created = await Shape.create({
                shape_geom: line
            }, {
                fields: ['shape_geom'],
                transaction: t
            });

            await Line.create({
                line_short_name: name,
                line_headsign: headsign,
                line_icon: '',
                line_is_available: false,
                line_wheelchair: false,
                TransportId: transport_created.id,
                ShapeId: shape_created.id
            }, {
                fields: ['line_short_name', 'line_headsign', 'line_icon',
                    'line_is_available', 'line_wheelchair', 'TransportId', 'ShapeId'
                ],
                transaction: t
            });


            for (var i = 0; i < pictures.length; ++i) {

                var uploaded_image = await cloudinary.v2.uploader.upload(pictures[i]);
                var thumb = cloudinary.v2.url(uploaded_image.public_id,
                    {
                        width: 256
                    });

                var create_pic = await Picture.create(
                    {
                        pic_height: uploaded_image.height,
                        pic_width: uploaded_image.width,
                        pic_url: uploaded_image.url,
                        pic_thumbnail_url: thumb,
                        pic_is_available: true,
                        TransportId: transport_created.id
                    },
                    {
                        fields: ['pic_height', 'pic_width'
                            , 'pic_url', 'pic_thumbnail_url', 'pic_is_available', 'TransportId'],
                        transaction: t
                    }
                );
            }

            await t.commit();
            res.status(200).json({ status: 200, message: `Route of Uploaded` });
        } catch (error) {
            //await t.rollback();
            res.status(400).json({ status: 400, message: `Error.`, info: error });
        }
    }


    get_routes_from_users = async (req, res) => {
         const t = await sequelize.transaction();
        try {
            var transports = await Transport.findAll({
                where: {
                    transport_code:null
                },
                include: [{
                    model: Line,
                    all: true,
                    include: [{
                        model: Shape
                    }]
                },
                {
                    model: Picture
                }
                ]
            });
            res.status(200).json({ status: 200, message: `List of Transport Contribution`, transport_data: transports });
        
        } catch (error) {
            //await t.rollback();
            res.status(400).json({ status: 400, message: `Error.`, info: error });
        }
    }

    upload_image_to_transport = async (req, res) => {
        var lista = []


        for (var i = 0; i < lista.length; ++i) {
            await Picture.create(
                {
                    'pic_url': lista[i],
                    'TransportId': 52 + i
                }, {
                fields: ['pic_url', 'TransportId']
            }
            );
        }

        res.status(200).json('hola');
    }

    otp_route = async (req, res) => {

        var { from_lat, from_lng, to_lat, to_lng, city, polyline } = req.query;



        try {

            var otp_query = await axios.get(
                // Cambiar para produccion
                `http://localhost:8080/otp/routers/default/plan?fromPlace=${from_lat},${from_lng}&toPlace=${to_lat},${to_lng}&arriveBy=false&numItineraries=10&walkBoardCost=1&walkReluctance=1&maxTransfers=3&minTransferTime=1000&maxWalkDistance=1000`);


            var calculated_routes = [];

            var return_poly = false;
            if (polyline == 'true') return_poly = true;
            //console.log(return_poly);

            var arr = otp_query.data.plan.itineraries || [];
            for (var i = 0; i < arr.length; ++i) {
                var otpleg = arr[i].legs;
                var route_data = [];
                for (var j = 0; j < otpleg.length; ++j) {
                    var dato = otpleg[j];
                    route_data.push(
                        {
                            route_agency_id: dato.agencyId || -1,
                            route_agency: dato.agencyName || '',
                            geom: (return_poly === true) ? dato.legGeometry.points : decode(dato.legGeometry.points),
                            from: dato.from.name,
                            to: dato.to.name,
                            type: dato.mode,
                            duration: dato.duration,
                            steps: (dato.steps) ? Array.from(dato.steps, (element) => {
                                return {
                                    distance: element.distance,
                                    street: element.streetName,
                                    lat: element.lat,
                                    lon: element.lon,
                                    relative_direction: element.relativeDirection,
                                    absolute_direction: element.absoluteDirection
                                };
                            }) : []

                        }
                    );
                }
                calculated_routes.push(route_data);
            }


            var data = await sequelize.query(
                `
                WITH cte AS(
                select "Lines".id,"Lines".line_short_name,"Lines".line_icon,"Lines".line_wheelchair,"Shapes".shape_geom  from "Lines" 
                    inner join "Shapes" on "Shapes".id = "Lines"."ShapeId"
                where 
                "TransportId" in
                (select id from "Transports" where "TransportTypeId" in 
                (select id from "TransportTypes" where "CityId"=${city})))
                 SELECT 
                id,line_short_name,line_wheelchair,
                ST_LineSubstring(shape_geom,
                LEAST(ST_LineLocatePoint(shape_geom,st_geomFromText('POINT(${from_lng} ${from_lat})', 4326)),
                ST_LineLocatePoint(shape_geom,st_geomFromText('POINT(${to_lng} ${to_lat})', 4326))),
                GREATEST(ST_LineLocatePoint(shape_geom,st_geomFromText('POINT(${from_lng} ${from_lat})', 4326)),
                ST_LineLocatePoint(shape_geom,st_geomFromText('POINT(${to_lng} ${to_lat})', 4326)))
                )  as geom FROM cte where
                st_distance(
                st_transform(st_geomFromText('POINT(${from_lng} ${from_lat})', 4326),900913),
                st_transform(shape_geom	,900913)
                ) <= 500 and
                st_distance(
                st_transform(st_geomFromText('POINT(${to_lng} ${to_lat})', 4326),900913),
                st_transform(shape_geom	,900913)
                ) <= 500;
                `, { type: QueryTypes.SELECT }
            );

            //console.log(data);
            for (var i = 0; i < data.length; ++i) {
                calculated_routes.push(
                    [
                        {
                            route_agency_id: data[i].id || -1,
                            route_agency: data[i].line_short_name || '',
                            geom: (return_poly === true) ? encode(data[i].geom.coordinates) : data[i].geom.coordinates,
                            from: '',
                            to: '',
                            type: 'BUS',
                            duration: 0,
                            steps: []
                        }
                    ]
                );
            }


            for (var i = 0; i < calculated_routes.length; ++i) {
                var geoms = calculated_routes[i];
                //console.log('GEOMS: ', geoms.length)
                for (var j = 0; j < geoms.length; ++j) {

                    var geom = geoms[j].geom;
                    var linestring = `'LINESTRING(`;

                    for (var k = 0; k < geom.length; ++k) {
                        linestring += `${geom[k][1]} ${geom[k][0]}`;
                        linestring += (k < geom.length - 1) ? ',' : '';
                    }
                    linestring += `)'`;

                    var data_poi = await sequelize.query(`
                    SELECT "Pois".id,  "Pois".poi_name,  "Pois".poi_original_name,  poi_lon, poi_lat,  "Pois".poi_phone_number,  "Pois".poi_website,  "Pois".poi_description,  "Pois".poi_direction
                    FROM "Pois"
                    WHERE ST_DWithin(ST_GeomFromText(${linestring},4326), ST_SetSRID(ST_MakePoint(poi_lon,poi_lat),4326), 0.0008)
                    ORDER BY ST_LineLocatePoint(ST_GeomFromText(${linestring},4326), ST_SetSRID(ST_MakePoint(poi_lon,poi_lat),4326)),
                    ST_Distance(ST_GeomFromText(${linestring},4326),ST_SetSRID(ST_MakePoint(poi_lon,poi_lat),4326))

                    `, { type: QueryTypes.SELECT });
                    calculated_routes[i][j].poi = data_poi;
                }

            }

            calculated_routes.sort((a, b) => {

                var alength = 0.0, blength = 0.0;
                for (var i = 0; i < a.length; ++i) {
                    var line = turf.lineString(a[i].geom);
                    var length = turf.length(line, { units: 'meters' });
                    alength += length;
                }

                //console.log('Distancia: ',alength);

                for (var i = 0; i < b.length; ++i) {
                    var line = turf.lineString(b[i].geom);
                    var length = turf.length(line, { units: 'meters' });
                    blength += length;

                }

                //console.log('Distancia: ',blength);

                return alength - blength;
            });


            res.status(200).json(calculated_routes);
            //res.status(200).json(otp_query.data);
        } catch (error) {
            console.error(error)
            res.status(500).json([]);
        }
    }


}

export default new TransportController();