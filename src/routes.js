import { Router } from 'express'

import fs from 'fs';
import multer from 'multer';


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dirname = `./opentripplanner/${(req.body.schema_name) ? req.body.schema_name : 'temporal_folder'}`;
        fs.mkdirSync(dirname, { recursive: true })
        fs.mkdirSync(dirname + '\\json-data', { recursive: true })
        cb(null, dirname);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({
    storage: storage,

    fileFilter: (req, file, cb) => {

        if (file.mimetype == "application/zip" || file.mimetype == "application/octet-stream") {
            if (file.originalname.endsWith('.gtfs.zip') || file.originalname.endsWith('.osm.pbf')) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        } else {
            cb(null, false);
        }
    },

});

// CONTROLLERS
import ruta from './controllers/rutaController'
import zona from './controllers/zonaUV.controller'
import lugar from './controllers/lugar.controller'
import tarifa from './controllers/tarifaController'
import usuario from './controllers/usuarioController'
import consulta from './controllers/consultaController'
import categoria from './controllers/categoria.controller'
import transporte from './controllers/transporteController'

// MIDDLEWARES
import * as auth from './middlewares/auth.middleware'
import paradaController from './controllers/parada_controller'
import lugarController from './controllers/lugar.controller'
import lugarCategoriaController from './controllers/lugarCategoria.controller'
import files from './controllers/filesController'
import countryController from './controllers/countryController'


import poiController from './controllers/poiController'
import userController from './controllers/userController'
import stopController from './controllers/stopController'
import taxiController from './controllers/taxiController'
import transportController from './controllers/transportController'

const router = Router();

router


    // Paradas

    // categorias
    .get('/categorias', categoria.all)
    .post('/categorias', categoria.store)
    .get('/categorias/:id', categoria.find)
    .put('/categorias/:id', categoria.update)
    .delete('/categorias/:id', categoria.destroy)
    //CATEGORIA LUGAR
    .get('/lugar-categorias', lugarCategoriaController.all)
    .post('/lugar-categorias', lugarCategoriaController.store)
    .get('/lugar-categoria/:id', lugarCategoriaController.find)
    .put('/lugar-categoria/:id', lugarCategoriaController.update)
    .delete('/lugar-categoria/:id', lugarCategoriaController.destroy)
    .get('/paradas', paradaController.all)
    /* .get('/stops', paradaController.all)
    .get('/stop/:id', paradaController.find)
    .post('/stop', paradaController.store)
    .put('/stop/:id', paradaController.update)
    .delete('/stop/:id', paradaController.destroy)
    .get('/stops/ruta', paradaController.nearest_stops_route)
    .get('/stops/position', paradaController.nearest_stops)
    .get('/stops/near_lines', paradaController.nearest_lines)

    //TAXIS
    .get('/taxi-route', taxiController.getRoute)
    // TARIFAS
    .get('/fares', tarifa.all)
    .get('/fares', tarifa.find)
    .post('fares', tarifa.store)
    .put('/fares/:id', tarifa.update)
    .delete('/fares/:id', tarifa.destroy)
*/
    // AUTH
    .post('/signup', usuario.store)
    .post('/signin', auth.verifyLogin, usuario.show)
    .post('/signout', auth.verifyToken, usuario.signout)

    // ROUTE
    .get('/transporte_rutas', transporte.getwrutas)
    .get('/ruta_calculo', ruta.point_to_point)
    .get('/otp', ruta.otp_route)

    // CONSULTAS => REPORTES
    .get('/consultas', consulta.consulta.all)
    .post('/consultas', consulta.consulta.store)

    .get('/destinos', consulta.consultaDestino.all)
    .post('/destinos', consulta.consultaDestino.store)
    .get('/destinos/zonas', consulta.consultaDestino.byZone)
    // Developer Endpoints
    .get('/paradas_ruta_ficticio', paradaController.nearest_stops_ficticio)
    .get('/paradas_ficticio', paradaController.all_ficticio)
    //  ZONAS
    .get('/zonas', zona.all)
    .get('/zonas/count', zona.count)
    //.get('/otp', ruta.otp_route)

    // Developer Endpoints
    .get('/paradas_ruta_ficticio', paradaController.nearest_stops_ficticio)
    .get('/paradas_ficticio', paradaController.all_ficticio)

    // AUTH
    .post('/signup', usuario.store)
    .post('/signin', auth.verifyLogin, usuario.show)
    .post('/signout', auth.verifyToken, usuario.signout)
    // v2 API ENDPOINT
    //.post('/country', files.insert_countries)
    .post('/bulk2/create', upload.single('gtfs'), files.create_gtfs)

    .post('/poi_status/create', poiController.poi_status_create)
    .get('/poi_status/all', poiController.get_poi_status)
    .post('/poi_type/create', poiController.poi_type_create)
    .delete('/poi_type/delete/:id', poiController.poi_type_delete)
    .get('/poi_type/all', poiController.get_poi_types)
    .get('/poi/all', poiController.poi_allBasic)
    .post('/poi/create', poiController.poi_create)
    .post('/poi/update', poiController.poi_update)
    .delete('/poi/delete/:id', poiController.poi_delete)
    .post('/poi/picture', poiController.upload_pics_to_poi)

    .get('/country/cities', countryController.country_get_cities)

    .get('/city/transport/types', transportController.get_city_transport)
    .get('/city/stops', stopController.stop_city)
    .get('/city/stops/near', stopController.stop_near)
    .get('/city/stops/transport/near', stopController.transport_near_stop)
    .get('/city/types/transport', transportController.get_types_transport)
    .get('/city/poi', poiController.get_poi)

    .get('/otp/v2', transportController.otp_route)

    //.post('/city/types/transport/lines',transportController.get_transport_lines)

    .post('/user', userController.user_create)
    .post('/user/contribute/transport', transportController.create_route_from_user)
    .get('/user/contributes/transport/all', transportController.get_routes_from_users)

export default router;