'use strict';

const Joi = require('@hapi/joi');
const Helpers = require('../helpers');
const User = require('../../models/user');

module.exports = Helpers.withDefaults({
    method: 'put',
    path: '/user',
    options: {
        validate: {
            payload: {
                user: Joi.object().required().keys({
                    id: User.field('id'),
                    email: User.field('email'),
                    password: Joi.string(),
                    username: User.field('username'),
                    bio: User.field('bio'),
                    image: User.field('image'),
                    token: Joi.string().strip()
                }).unknown()
            }
        },
        auth: 'jwt',
        handler: async (request, h) => {

            const { artifacts: token } = request.auth;
            const { user: userInfo } = request.payload;
            const { userService, displayService } = request.services();
            const currentUserId = Helpers.currentUserId(request);
            console.log(currentUserId, token);

            const updateAndFetchUser = async (txn) => {

                const id = await userService.update(currentUserId, userInfo, txn);

                return await userService.findById(id, txn);
            };

            const user = await h.context.transaction(updateAndFetchUser);

            return {
                //user: displayService.user(user, token)
                //user: displayService.user(user, token)
            };
        }
    }
});
