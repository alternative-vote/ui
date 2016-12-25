const _ = require('lodash')

class AuthService {

    allowed = [
        {username : 'admin', password : 'password'}
    ]

    login(username, password) {
        return new Promise((resolve, reject) => {
            const i = _.findIndex(this.allowed, {username, password})

            if (i == -1) {
                return reject('Incorect username or password.');
            }

            return resolve()
        });
    }

    create(username, password) {
        return new Promise((resolve, reject) => {
            this.allowed.push({username, password})
            resolve()
        })
    }

}

export default new AuthService()