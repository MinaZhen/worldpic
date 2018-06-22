"use strict";

var axios = require("axios");
var cloudinary = require("cloudinary");

var upload = "y2v4pqpc";

cloudinary.config({
    cloud_name: 'minacloudinary',
    api_key: '898533261837324',
    api_secret: 'bHqB_ua0HkfLFMfRYFcHuSilLM4'
});

var cloudApi = {
    url: 'NOWHERE',

    uploadPhoto: function uploadPhoto(file) {
        var formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", upload);
        return axios({
            url: "https://api.cloudinary.com/v1_1/minacloudinary/upload",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: formData
        }).then(function (res) {
            return res.data.secure_url;
        }).catch(function (err) {
            return console.error(err);
        });
    },
    retrievePhoto: function retrievePhoto(filename, form) {
        var url = "https://res.cloudinary.com/minacloudinary/image/upload/";
        switch (form) {
            case 1:
                return url + "w_600,h_400,c_fill,b_black/" + filename;
            case 2:
                return url + "w_200,h_200,c_crop,g_face,r_max/w_200/" + filename;
            default:
                return url + "w_100,h_100,c_fill/" + filename;
        }
    },
    removePhoto: function removePhoto(public_id) {
        return cloudinary.v2.uploader.destroy(public_id).then(function (res) {
            return res;
        });
    }
};

module.exports = cloudApi;
