import cloudinary from 'cloudinary'

cloudinary.config({
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME,
})

export const uploadBase64 = async (base64Str, public_id = null) => {
    return await cloudinary.v2.uploader.upload(base64Str, {
        public_id,
        overwrite: true,
        invalidate: true,
    })
}

export const destroyIMG = async (public_id) => {
    return await cloudinary.v2.uploader.destroy(public_id)
}