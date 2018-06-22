"use strict"

const mongoose = require("mongoose")
const { Photo } = require("./schemas")

module.exports = mongoose.model("Photo", Photo)