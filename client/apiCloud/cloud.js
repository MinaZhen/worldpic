"use strict"

const axios = require("axios")
const cloudinary = require("cloudinary")

const upload = "y2v4pqpc"

cloudinary.config({ 
    cloud_name: 'minacloudinary', 
    api_key: '898533261837324', 
    api_secret: 'bHqB_ua0HkfLFMfRYFcHuSilLM4' 
});

const cloudApi = {
    url: 'NOWHERE',

    uploadPhoto(file) {
        let formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", upload)
        return axios({
            url: "https://api.cloudinary.com/v1_1/minacloudinary/upload",
            method: "POST",
            headers: {
                "Content-Type" : "application/x-www-form-urlencoded"
            },
            data: formData
        })
        .then(res => res.data.secure_url)
        .catch(err => console.error(err))
    },

    retrievePhoto(filename, form) {
        const url = "https://res.cloudinary.com/minacloudinary/image/upload/"
        switch(form) {
            case 1:
                return `${url}w_600,h_400,c_fill_path,b_black/${filename}`
            case 2:
                return `${url}w_200,h_200,c_crop,g_face,r_max/w_200/${filename}`
            default:
                return `${url}w_100,h_100,c_fill/${filename}`
        }
    },

    removePhoto(public_id) {
        return cloudinary.v2.uploader.destroy(public_id)
        .then(res => res)
    }
}

module.exports = cloudApi
  