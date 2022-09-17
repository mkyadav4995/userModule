const Joi = require("joi");

//Include requied packages and make them globally accessible

global.Sequelize = require("sequelize");
global.Op = Sequelize.Op;
global.Fs = require("fs");
require("dotenv").config();
global.Joi = require("joi");
global._ = require("lodash");
global.Slug = require("slug");
global.Path = require("path");
global.uuid = require('uuid');
global.Axios = require('axios');
global.i18n=require("hapi-i18n");
global.Bcrypt = require("bcrypt");
global.Moment = require("moment");
global.crypto = require('crypto');
global.Cron = require('hapi-cron');
global.Models = require("./models");
global.Boom = require("@hapi/boom");
global.Hapi = require("@hapi/hapi");
global.Common = require("./common");
global.Jwt = require("jsonwebtoken");
global.Inert = require("@hapi/inert");
global.Vision = require("@hapi/vision");
global.Routes=require("hapi-auto-route");
global.auth_jwt=require("hapi-auth-jwt2");
global.Constants = require("./constants");
global.HapiSwagger = require("hapi-swagger");
const log4js = require("log4js");
console.log({log4js})
log4js.configure({
    appenders: { cheese: { type: "file", filename: "cheese.log" } },
    categories: { default: { appenders: ["cheese"], level: "error" } },
});
global.Logger = log4js.getLogger("cheese");
console.log({Logger})
Logger.trace("Entering cheese testing");
Logger.debug("Got cheese.");
Logger.info("Cheese is Comté.");
Logger.warn("Cheese is quite smelly.");
Logger.error("Cheese is too ripe!");
Logger.fatal("Cheese was breeding ground for listeria.");





