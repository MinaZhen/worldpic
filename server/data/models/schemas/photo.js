"use strict"

const { Schema } = require('mongoose')

module.exports = new Schema({
    url: { type: String, required: true },
    title: { type: String, required: false },
    description: { type: String, required: false }
})