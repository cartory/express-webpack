import { Controller } from '../config/controller'

import sequelize from '../config/sequelize'
import { QueryTypes } from "sequelize"
import { Poi, PoiStatus, PoiType, Picture, City } from '../config/relationships'
import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

class PoiController extends Controller {
    constructor() {
        super(Poi)
    }

    get_poi = async (req, res) => {
        var { city_id } = req.query;
        try {
            var pois = await Poi.findAll({
                where: {
                    CityId: city_id
                },
                attributes:{
                    exclude:['CityId','UserId','PoiStatusId','PoiTypeId']
                }
            });

            res.status(200).json({ status: 200, message: `POIs Found`, data: pois });
        } catch (error) {
            res.status(400).json({ status: 400, message: `POIs not Found or error.` });
        }
    }

    poi_status_create = async (req, res) => {
        try {
            var { name } = req.body;
            await PoiStatus.create({
                status_name: name,
                status_is_available: true
            });
            res.status(200).json({ status: 200, message: `POI Status Added`, data: name });
        } catch (error) {
            res.status(400).json({ status: 400, message: `POI status not added.`, data: name });
        }
    }

    get_poi_status = async (req, res) => {
        try {
            var stats = await PoiStatus.findAll();
            res.status(200).json({ status: 200, message: `POI Status List`, data: stats });
        } catch (error) {
            res.status(400).json({ status: 400, message: `POI status error.`});
        }
    }

    get_poi_types = async (req, res) => {
        try {
            var types = await PoiType.findAll();
            res.status(200).json({ status: 200, message: `POI Types List`, data: types });
        } catch (error) {
            res.status(400).json({ status: 400, message: `POI status error.`});
        }
    }

    poi_type_create = async (req, res) => {
        try {
            var name = req.body.name;
            await PoiType.create({
                type_name: name
            });
            res.status(200).json({ status: 200, message: `POI Type Added`, data: name });
        } catch (error) {
            res.status(400).json({ status: 400, message: `POI type not added.`, data: name });
        }
    }
    poi_type_delete=async(req,res)=>{
        try {
          
            const destroyedPoi=await PoiType.destroy({where:{id:req.params.id}})
            res.status(200).json({ status: 200, message: `POI Type Deleted`, data: destroyedPoi })
        } catch (error) {
             console.log(200);
        }
     }
    poi_create = async (req, res) => {

        let { name, original_name, lon, lat,
            phone_number, website, description,
            direction, city_id, user_id, poi_status_id,
            poi_type_id, pictures } = req.body;

        try {
            var poi = await Poi.create({
                poi_name: name,
                poi_original_name: original_name,
                poi_lon: lon,
                poi_lat: lat,
                poi_phone_number: phone_number,
                poi_website: website,
                poi_description: description,
                poi_direction: direction,
                CityId: city_id,
                UserId: user_id,
                PoiStatusId: poi_status_id,
                PoiTypeId: poi_type_id
            },
                {
                    fields: ['poi_name', 'poi_original_name', 'poi_lon', 'poi_lat',
                        'poi_phone_number', 'poi_website', 'poi_description', 'poi_direction',
                        'CityId', 'UserId', 'PoiStatusId', 'PoiTypeId']
                });

            for (var i = 0; i < pictures.length; ++i) {

                var uploaded_image = await cloudinary.v2.uploader.upload(pictures[i]);
                var thumb = cloudinary.v2.url(uploaded_image.public_id,
                    {
                        width: 256
                    });


                var create_pic = await Picture.create(
                    {
                        pic_caption: name,
                        pic_height: uploaded_image.height,
                        pic_width: uploaded_image.width,
                        pic_url: uploaded_image.url,
                        pic_thumbnail_url: thumb,
                        pic_is_available: true,
                        PoiId: poi.id
                    },
                    {
                        fields: ['pic_caption', 'pic_height', 'pic_width'
                            , 'pic_url', 'pic_thumbnail_url', 'pic_is_available', 'PoiId']
                    }
                );
            }


            res.status(200).json({ status: 200, message: `POI Created Added`, data: name });
        } catch (error) {
            res.status(400).json({ status: 400, message: `Error Creating POI.`, data: name, erro: error });
        }
    }

    upload_pics_to_poi = async (req, res) => {
        let { pictures, poi_id } = req.body;
        try {
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
                        PoiId: poi_id
                    },
                    {
                        fields: ['pic_height', 'pic_width'
                            , 'pic_url', 'pic_thumbnail_url', 'pic_is_available', 'PoiId']
                    }
                );
            }
            res.status(200).json({ status: 200, message: `POI Status Added` });
        } catch (error) {
            res.status(400).json({ status: 400, message: `POI status not added.` });
        }
    }
    poi_allBasic = async ({query}, res) => {
        let attributes=["id", "poi_name", "poi_direction" ]
		if(query.poiLonLat){
            attributes.push('poi_lon','poi_lat')
        }
        try {
            const places=await Poi.findAll({
                attributes,
                where:{deletedAt:null}
            });
			return res
				.status(200)
				.json(
					places
				);
		} catch (error) {
            res.status(200).json(error);
        }
	};
    poi_delete=async(req,res)=>{
       try {
           const destroyedPoi=await Poi.destroy({where:{id:req.params.id}})
           res.status(200).json({ status: 200, message: `POI Deleted`, data: destroyedPoi })
       } catch (error) {
            console.log(200);
       }
    }
    poi_update = async (req, res) => {
        let { name, original_name, lon, lat,
            phone_number, website, description,
            direction, status, type, poi_id } = req.body;
        try {
            var poi = await Poi.update({
                poi_name: name,
                poi_original_name: original_name,
                poi_lon: lon,
                poi_lat: lat,
                poi_phone_number: phone_number,
                poi_website: website,
                poi_description: description,
                poi_direction: direction,
                PoiStatusId: status,
                PoiTypeId: type
            }, {
                where: {
                    id: poi_id
                },
                returning: true
            });
            
            res.status(200).json({ status: 200, message: `POI Status Added`, data: name });
        } catch (error) {
            res.status(400).json({ status: 400, message: `POI status not added.`, data: name });
        }
    }

}

export default new PoiController();