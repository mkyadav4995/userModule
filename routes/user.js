"use strict";
const { constant } = require("lodash");
const userController = require("../controllers/user");
module.exports = [
    {
        method: 'POST',
        path: '/login',
        handler: userController.login,
        options: {
            tags: ['api', 'user'],
            notes: 'by using email and password user can login',
            description: 'login',
            auth: false,
            validate: {
                headers: Joi.object(Common.headers()).options({
					allowUnknown: true
				}),
                options: {
                    abortEarly: false
                },
                payload: {
                    email: Joi.string().email().required().error(errors=>{return Common.routeError(errors,'EMAIL_IS_REQUIRED')}),
                    password: Joi.string().required().error(errors=>{return Common.routeError(errors,'PASSWORD_IS_REQUIRED')}),                },
                failAction: async (req, h, err) => {
					return Common.FailureError(err, req);
                },
                validator: Joi
            },
			pre : [{method: Common.prefunction}]
        }
    },
    {
        method: 'POST',
        path: '/user',
        handler: userController.addUser,
        options: {
            tags: ['api', 'user'],
            notes: 'admin can create new user',
            description: 'create user',
            auth: { strategy: 'jwt', scope: ['superAdmin'] },
            validate: {
                headers: Joi.object(Common.headers(1)).options({
					allowUnknown: true
				}),
                options: {
                    abortEarly: false
                },
                payload: {
                    name: Joi.string().required().error(errors=>{return Common.routeError(errors,'NAME_ID_IS_REQUIRED')}),
                    email: Joi.string().email().required().error(errors=>{return Common.routeError(errors,'EMAIL_IS_REQUIRED')}),
                    password: Joi.string().required().error(errors=>{return Common.routeError(errors,'PASSWORD_IS_REQUIRED')}),
                    phoneNumber: Joi.string().required().error(errors=>{return Common.routeError(errors,'PHONE_IS_REQUIRED')}),
                },
                failAction: async (req, h, err) => {
					return Common.FailureError(err, req);
                },
                validator: Joi
            },
			pre : [{method: Common.prefunction}]
        }
    },
    {
        method: 'GET',
        path: '/users',
        handler: userController.getUsers,
        options: {
            tags: ['api', 'user'],
            notes: 'admin can view all users',
            description: 'get users',
            auth: { strategy: 'jwt', scope: ['superAdmin'] },
            validate: {
                headers: Joi.object(Common.headers(1)).options({
					allowUnknown: true
				}),
                options: {
                    abortEarly: false
                },
                query: {
                    name: Joi.string().optional().allow(null,''),
                    phoneNumber: Joi.string().optional().allow(null,'')
                },
                failAction: async (req, h, err) => {
					return Common.FailureError(err, req);
                },
                validator: Joi
            },
			pre : [{method: Common.prefunction}]
        }
    },
    {
        method: 'PATCH',
        path: '/user',
        handler: userController.updateUser,
        options: {
            tags: ['api', 'user'],
            notes: 'admin can update user data',
            description: 'update user',
            auth: { strategy: 'jwt', scope: ['superAdmin'] },
            validate: {
                headers: Joi.object(Common.headers(1)).options({
					allowUnknown: true
				}),
                options: {
                    abortEarly: false
                },
                payload: {
                    id: Joi.number().required().error(errors=>{return Common.routeError(errors,'ID_IS_REQUIRED')}),
                    name: Joi.string().optional().allow(null,''),
                    email: Joi.string().optional().allow(null,''),
                    phoneNumber: Joi.string().optional().allow(null,''),
                    status: Joi.number().optional().allow(null,'').description("1 active, 0 inactive"),
                },
                failAction: async (req, h, err) => {
					return Common.FailureError(err, req);
                },
                validator: Joi
            },
			pre : [{method: Common.prefunction}]
        }
    },
]