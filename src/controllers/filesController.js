import City from '../models/public_schema/city'

import Stop from '../models/generic_schema/stop'
import Line from '../models/generic_schema/line'
import Shape from '../models/generic_schema/shape'
import Transport from '../models/generic_schema/transport'
import TransportType from '../models/generic_schema/transport_type'

import sequelize from '../config/sequelize'

import fs from 'fs'
import anzip from 'anzip'
import csv from 'csvtojson'

const setAvailable = (types, num) => {
    var mapa = new Map();
    mapa.set(0, {
        transport_type_name: 'Tranvía',
        transport_type_name_original: null,
        transport_type_icon: 'tram',
        transport_type_icon_url: '',
        transport_avaiable: true,
        CityId: num
    });
    mapa.set(1, {
        transport_type_name: 'Subterraneo',
        transport_type_name_original: null,
        transport_type_icon: 'subway',
        transport_type_icon_url: '',
        transport_avaiable: true,
        CityId: num
    });
    mapa.set(2, {
        transport_type_name: 'Railway',
        transport_type_name_original: null,
        transport_type_icon: 'directions_railway',
        transport_type_icon_url: '',
        transport_avaiable: true,
        CityId: num
    });
    mapa.set(3, {
        transport_type_name: 'Bus',
        transport_type_name_original: null,
        transport_type_icon: 'directions_bus',
        transport_type_icon_url: '',
        transport_avaiable: true,
        CityId: num
    });
    mapa.set(4, {
        transport_type_name: 'Ferry',
        transport_type_name_original: null,
        transport_type_icon: 'directions_boat',
        transport_type_icon_url: '',
        transport_avaiable: true,
        CityId: num
    });
    mapa.set(5, {
        transport_type_name: 'Tranvía de cable ',
        transport_type_name_original: null,
        transport_type_icon: 'directions_railway',
        transport_type_icon_url: '',
        transport_avaiable: true,
        CityId: num
    });
    mapa.set(6, {
        transport_type_name: 'Elevador Aéreo',
        transport_type_name_original: null,
        transport_type_icon: 'airline_seat_recline_normal',
        transport_type_icon_url: '',
        transport_avaiable: true,
        CityId: num
    });
    mapa.set(7, {
        transport_type_name: 'Funicular',
        transport_type_name_original: null,
        transport_type_icon: 'network_cell',
        transport_type_icon_url: '',
        transport_avaiable: true,
        CityId: num
    });
    mapa.set(11, {
        transport_type_name: 'Trolebus',
        transport_type_name_original: null,
        transport_type_icon: 'directions_subway',
        transport_type_icon_url: '',
        transport_avaiable: true,
        CityId: num
    });
    mapa.set(12, {
        transport_type_name: 'Monoriel',
        transport_type_name_original: null,
        transport_type_icon: 'directions_subway',
        transport_type_icon_url: '',
        transport_avaiable: true,
        CityId: num
    });

    var result = [];
    for (var i = 0; i < types.length; ++i) {
        result.push(mapa.get(types[i]));
    }

    return result;
}

class FilesController {

    /*
        insert_countries = async (req, res) => {
    
            try {
                console.log(jsonData.features.length)
    
                for (var i = 0; i < jsonData.features.length; ++i) {
                    var geom = {
                        type: jsonData.features[i].geometry.type,
                        coordinates: jsonData.features[i].geometry.coordinates,
                        crs: { type: 'name', properties: { name: 'EPSG:4326' } }
                    };
                    await Country.create(
                        {
                            country_name: jsonData.features[i].properties.name,
                            country_original_name: null,
                            country_code: jsonData.features[i].id,
                            country_geom: geom
                        }
                    );
                }
    
                await Country.bulkCreate(results);
                res.status(200).json({ message: 'Done' });
            } catch (erro) {
                res.status(400).json({ message: erro });
            }
        }*/

    create_gtfs = async (req, res) => {
        var pathfile = process.cwd() + `\\opentripplanner\\${req.body.schema_name}`;
        const t = await sequelize.transaction();
        try {

            var end = req.file.mimetype;
            if (end == 'application/zip' || end == 'application/octet-stream') {


                // Create the city
                var city_created;

                if (req.body.city_id) {
                    city_created = { id: req.body.city_id }
                } else {
                    city_created = await City.create({
                        city_name: req.body.name,
                        city_original_name: req.body.original_name,
                        city_geom: null,
                        city_available: true,
                        CountryId: req.body.country_id
                    },
                        {
                            fields: ['city_name', 'city_original_name', 'city_geom', 'city_available', 'CountryId'],
                            transaction: t
                        });
                }

                // Extract shapes from folder
                var folder_path = process.cwd() + `\\opentripplanner\\${req.body.schema_name}\\`;
                var path_string = folder_path + `${req.file.originalname}`;


                fs.mkdirSync(folder_path + 'extracted');

                await anzip(path_string, { outputPath: folder_path + 'extracted' });
                const jsonStops = await csv().fromFile(folder_path + 'extracted\\stops.txt');
                const jsonRoutes = await csv().fromFile(folder_path + 'extracted\\routes.txt');
                const jsonTrips = await csv().fromFile(folder_path + 'extracted\\trips.txt');
                const jsonShapes = await csv().fromFile(folder_path + 'extracted\\shapes.txt');



                var types_transport = [];

                let routes = new Map();
                for (var i = 0; i < jsonRoutes.length; ++i) {
                    if (!routes.has(jsonRoutes[i].route_id)) {
                        routes.set(jsonRoutes[i].route_id, {
                            name: jsonRoutes[i].route_long_name,
                            type: parseInt(jsonRoutes[i].route_type),
                            route_desc: (jsonRoutes[i].route_desc) ? jsonRoutes[i].route_desc : null,
                            route_url: (jsonRoutes[i].route_url) ? jsonRoutes[i].route_url : null
                        });

                        var type_transport = parseInt(jsonRoutes[i].route_type);
                        if (types_transport.indexOf(type_transport) === -1) {
                            types_transport.push(type_transport);
                        }
                    }
                }

                let trips = new Map();
                for (var i = 0; i < jsonTrips.length; ++i) {

                    if (!trips.has(jsonTrips[i].route_id)) {
                        trips.set(jsonTrips[i].route_id, [{
                            shape: jsonTrips[i].shape_id,
                            headsign: (jsonTrips[i].trip_headsign) ? jsonTrips[i].trip_headsign : null,
                            wheelchair_accessible: (jsonTrips[i].wheelchair_accessible) ? true : false

                        }]);
                    } else {
                        if (trips.get(jsonTrips[i].route_id).filter(e => e.shape === jsonTrips[i].shape_id).length === 0) {
                            trips.set(jsonTrips[i].route_id, [...trips.get(jsonTrips[i].route_id),
                            {
                                shape: jsonTrips[i].shape_id,
                                headsign: (jsonTrips[i].trip_headsign) ? jsonTrips[i].trip_headsign : null,
                                wheelchair_accessible: (jsonTrips[i].wheelchair_accessible) ? true : false
                            }
                            ]);
                        }
                    }
                }



                let shapes = new Map();
                for (var i = 0; i < jsonShapes.length; ++i) {

                    if (!shapes.has(jsonShapes[i].shape_id)) {
                        shapes.set(jsonShapes[i].shape_id, [[parseFloat(jsonShapes[i].shape_pt_lon), parseFloat(jsonShapes[i].shape_pt_lat)]]);
                    } else {
                        shapes.set(jsonShapes[i].shape_id, [...shapes.get(jsonShapes[i].shape_id), [parseFloat(jsonShapes[i].shape_pt_lon), parseFloat(jsonShapes[i].shape_pt_lat)]]);
                    }
                }

                // Transport Types
                var types_id = new Map();
                var transType = setAvailable(types_transport, city_created.id);
                for (var j = 0; j < transType.length; ++j) {
                    var created_types;
                    if (req.body.transport_type_id) {
                        created_types = { id: req.body.transport_type_id };
                    } else {
                        created_types = await TransportType.create(transType[j], { transaction: t });
                    }

                    types_id.set(types_transport[j], created_types.id);
                }

                // Shapes
                var shapes_id = new Map();
                for (let [key, value] of shapes) {
                    var line = {
                        type: 'LineString',
                        coordinates: value,
                        crs: { type: 'name', properties: { name: 'EPSG:4326' } }
                    };
                    var created_shape = await Shape.create(
                        {
                            shape_geom: line
                        },
                        {
                            transaction: t
                        }
                    );
                    shapes_id.set(key, created_shape.id)
                }


                // Routes

                for (let [key, value] of routes) {
                    const map1 = new Map(
                        [...trips]
                            .filter(([k, v]) => k === key)
                    );

                    //console.log(value);


                    var created_transport = await Transport.create({
                        transport_name: value.name,
                        transport_name_original: value.name,
                        transport_code: null,
                        transport_icon: null,
                        transport_icon_url: null,
                        transport_description: value.route_desc,
                        transport_url: value.route_url,
                        UserId: req.body.user_id,
                        TransportTypeId: types_id.get(value.type)
                    },
                        {
                            fields: ['transport_name', 'transport_name_original',
                                'transport_code', 'transport_icon', 'transport_icon_url',
                                'transport_description', 'transport_url', 'UserId', 'TransportTypeId'],
                            transaction: t
                        });




                    for (let trip of map1.values()) {

                        for (var j = 0; j < trip.length; ++j) {
                            //console.log(shapes.get(trip[j].shape).length)
                            var tripFiltered = trip[j];
                            await Line.create({
                                line_short_name: tripFiltered.headsign,
                                line_headsign: tripFiltered.headsign,
                                line_icon: '',
                                line_is_available: true,
                                line_wheelchair: tripFiltered.wheelchair_accessible,
                                TransportId: created_transport.id,
                                ShapeId: shapes_id.get(trip[j].shape)
                            },
                                {
                                    fields: ['line_short_name', 'line_headsign', 'line_icon',
                                        'line_is_available', 'line_wheelchair', 'TransportId', 'ShapeId'],
                                    transaction: t
                                })
                        }
                    }
                }

                for (var i = 0; i < jsonStops.length; ++i) {
                    await Stop.create({
                        stop_name: (jsonStops[i].stop_name) ? jsonStops[i].stop_name : null,
                        stop_description: (jsonStops[i].stop_desc) ? jsonStops[i].stop_desc : '',
                        stop_original_name: null,
                        stop_url: (jsonStops[i].stop_url) ? jsonStops[i].stop_url : null,
                        stop_lat: (jsonStops[i].stop_lat) ? jsonStops[i].stop_lat : null,
                        stop_lon: (jsonStops[i].stop_lon) ? jsonStops[i].stop_lon : null,
                        stop_wheelchair: (jsonStops[i].wheelchair_boarding) ? true : false,
                        CityId: city_created.id
                    },
                        {
                            fields: ['stop_name', 'stop_description',
                                'stop_original_name', 'stop_url', 'stop_lat',
                                'stop_lon', 'stop_wheelchair', 'CityId'],
                            transaction: t
                        });
                }

                //console.log('Routes: ', routes.size);
                //console.log('Trips: ', trips.size);
                //console.log('Shapes: ', shapes.size);
                //console.log('Types of Transportations: ', types_transport.length)

                await t.commit();
                fs.rmdirSync(pathfile, { recursive: true });
                res.status(200).json({ status: 200, message: `File Uploaded Succesfully.`, filename: req.file.filename });
            } else {
                await t.rollback();
                fs.rmdirSync(pathfile, { recursive: true });

                res.status(400).json({ status: 400, message: 'Wrong file type.' });
            }


        } catch (error) {
            await t.rollback();
            fs.rmdirSync(pathfile, { recursive: true });
            res.status(400).json({ status: 400, message: 'Wrong file type or internal error.', erro: error });
        }
    }


}

export default new FilesController()

// int price = ((this.minutes * km*0.22)/2 + 8).ceil();