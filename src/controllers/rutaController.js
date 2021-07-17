import Ruta from '../models/ruta';
import { Controller } from '../config/controller'
import sequelize from '../config/sequelize'
import { QueryTypes } from "sequelize"
import axios from 'axios';
import { decode, encode } from '@mapbox/polyline';
import * as turf from '@turf/turf';

class RutaController extends Controller {
    constructor() {
        super(Ruta);
    }

    otp_route = async (req, res) => {

        var { from_lat, from_lng, to_lat, to_lng, polyline } = req.query;
        console.log('LOOOOL');

        try {

            var otp_query = await axios.get(
                // Cambiar para produccion
                `http://localhost:8080/otp/routers/default/plan?fromPlace=${from_lat}, ${from_lng}&toPlace=${to_lat}, ${to_lng}&maxWalkDistance=320&arriveBy=false&wheelchair=false&locale=en&numItineraries=8&maxTransfers=3`);
    
    
            var calculated_routes = [];

            var return_poly = false;
            if (polyline == 'true') return_poly = true;
            console.log(return_poly);

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
                select id,name, st_flipcoordinates(ST_LineSubstring(geom,
                    LEAST(ST_LineLocatePoint(
                    st_transform(geom,900913),
                    st_transform(st_flipcoordinates(
                    st_geomFromText('POINT(${to_lat} ${to_lng})', 4326)),900913)),
                    ST_LineLocatePoint(
                    st_transform(geom,900913),
                    st_transform(st_flipcoordinates(
                    st_geomFromText('POINT(${from_lat} ${from_lng})', 4326)),900913))),
                    GREATEST(ST_LineLocatePoint(
                    st_transform(geom,900913),
                    st_transform(st_flipcoordinates(
                    st_geomFromText('POINT(${to_lat} ${to_lng})', 4326)),900913)),
                    ST_LineLocatePoint(
                    st_transform(geom,900913),
                    st_transform(st_flipcoordinates(
                    st_geomFromText('POINT(${from_lat} ${from_lng})', 4326)),900913)))
                )) as geom from ruta
                where st_distance(
                st_transform(st_flipcoordinates(st_geomFromText('POINT(${from_lat} ${from_lng})', 4326)),900913),
                st_transform(geom	,900913)
                ) <= 300 and
                st_distance(
                st_transform(st_flipcoordinates(st_geomFromText('POINT(${to_lat} ${to_lng})', 4326)),900913),
                st_transform(geom	,900913)
                ) <= 300;

                `, { type: QueryTypes.SELECT }
            );

            //console.log(data);
            for (var i = 0; i < data.length; ++i) {
                calculated_routes.push(
                    [
                        {
                            route_agency_id: data[i].id || -1,
                            route_agency: data[i].name || '',
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

            /*
            var data_poi = await sequelize.query(`
            SELECT poi.geom
            FROM ruta, poi
            WHERE ruta.id = 12 AND ST_DWithin(ruta.geom, poi.geom, 0.002)
            ORDER BY ST_LineLocatePoint(ruta.geom, poi.geom),
            ST_Distance(ruta.geom,poi.geom)
                            
            `, { type: QueryTypes.SELECT });
            */

            for (var i = 0; i < calculated_routes.length; ++i) {
                var geoms = calculated_routes[i];
                console.log('GEOMS: ', geoms.length)
                for (var j = 0; j < geoms.length; ++j) {

                    var geom = geoms[j].geom;
                    var linestring = `'LINESTRING(`;

                    for (var k = 0; k < geom.length; ++k) {
                        linestring += `${geom[k][1]} ${geom[k][0]}`;
                        linestring += (k < geom.length - 1) ? ',' : '';
                    }
                    linestring += `)'`;
                    var data_poi = await sequelize.query(`
                    SELECT poi.id,  poi.state,  poi.city,  ST_X(poi.geom) as lon, ST_Y(poi.geom) as lat,  poi.type,  poi.phone_number,  poi.website,  poi.description,  poi.direction,   poi.name
                    FROM poi
                    WHERE ST_DWithin(ST_GeomFromText(${linestring},4326), poi.geom, 0.0008)
                    ORDER BY ST_LineLocatePoint(ST_GeomFromText(${linestring},4326), poi.geom),
                    ST_Distance(ST_GeomFromText(${linestring},4326),poi.geom)

                    `, { type: QueryTypes.SELECT });
                    calculated_routes[i][j].poi = data_poi;
                }

            }

            
            calculated_routes.sort((a, b)=>{

                var alength=0.0, blength=0.0;
                for(var i=0;i<a.length;++i){
                    var line = turf.lineString(a[i].geom);
                    var length = turf.length(line, {units: 'meters'});
                    alength+=length;
                }

                console.log('Distancia: ',alength);

                for(var i=0;i<b.length;++i){
                    var line = turf.lineString(b[i].geom);
                    var length = turf.length(line, {units: 'meters'});
                    blength+=length;
                    
                }

                console.log('Distancia: ',blength);

                return alength - blength;
            });


            res.status(200).json(calculated_routes);
            //res.status(200).json(otp_query.data);
        } catch (error) {
            console.error(error)
            res.status(500).json([]);
        }
    }

    

    // http://127.0.0.1:3030/api/ruta_calculo?from_lat=-17.788914804246183&from_lng=-63.165378010074164&to_lat=-17.798803496845185&to_lng=-63.16928330647084
    point_to_point = async (req, res) => {
        var { from_lat, from_lng, to_lat, to_lng, polyline } = req.query;
        try {
            var data = await sequelize.query(
                `
                select id,name, st_flipcoordinates(ST_LineSubstring(geom,
                    LEAST(ST_LineLocatePoint(
                    st_transform(geom,900913),
                    st_transform(st_flipcoordinates(
                    st_geomFromText('POINT(${to_lat} ${to_lng})', 4326)),900913)),
                    ST_LineLocatePoint(
                    st_transform(geom,900913),
                    st_transform(st_flipcoordinates(
                    st_geomFromText('POINT(${from_lat} ${from_lng})', 4326)),900913))),
                    GREATEST(ST_LineLocatePoint(
                    st_transform(geom,900913),
                    st_transform(st_flipcoordinates(
                    st_geomFromText('POINT(${to_lat} ${to_lng})', 4326)),900913)),
                    ST_LineLocatePoint(
                    st_transform(geom,900913),
                    st_transform(st_flipcoordinates(
                    st_geomFromText('POINT(${from_lat} ${from_lng})', 4326)),900913)))
                )) as geom from ruta
                where st_distance(
                st_transform(st_flipcoordinates(st_geomFromText('POINT(${from_lat} ${from_lng})', 4326)),900913),
                st_transform(geom	,900913)
                ) <= 300 and
                st_distance(
                st_transform(st_flipcoordinates(st_geomFromText('POINT(${to_lat} ${to_lng})', 4326)),900913),
                st_transform(geom	,900913)
                ) <= 300;

                `, { type: QueryTypes.SELECT }
            );

            res.status(200).json(data);
        } catch (error) {
            console.error(error)
            res.status(500).json({ error })
        }

    }

}

export default new RutaController()