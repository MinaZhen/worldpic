"use strict"

const mongoose = require("mongoose")
const { Country } = require("./schemas")

module.exports = mongoose.model("Country", Country)