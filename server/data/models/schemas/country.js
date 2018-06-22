"use strict"

const { Schema, SchemaTypes: { ObjectId } } = require("mongoose")
const Photo = require("./photo")

module.exports = new Schema({
    user: { type: ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    info: { type: Object, required: false },
    description: { type: String, required: false },
    photos: [Photo]
})