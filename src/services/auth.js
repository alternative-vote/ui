const _ = require('lodash')

class AuthStore {
    key = "auth_token"

    set(authToken) {
        localStorage.setItem(this.key, authToken)
    }

    clear() {
        localStorage.clear(this.key)
    }

    get() {
        return localStorage.getItem(this.key)
    }
}

//TODO: separate auth schemes for admin vs voting
class AuthService {
    allowed = [
        {username : 'admin', password : 'password'}
    ]

    store = new AuthStore()

    login(username, password) {
        return new Promise((resolve, reject) => {
            const i = _.findIndex(this.allowed, {username, password})

            if (i == -1) {
                return reject('Incorect username or password.');
            }

            this.setToken('asdf')

            return resolve()
        });
    }

    logout() {
        this.store.clear()
    }

    setToken(token) {
        this.store.set(token)
    }

    create(username, password) {
        return new Promise((resolve, reject) => {
            this.allowed.push({username, password})
            resolve()
        })
    }

    isLoggedIn() {
        return this.store.get() != null
    }

    getToken() {
        return this.store.get()
    }
}

export default new AuthService()