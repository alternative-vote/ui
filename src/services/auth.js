const _ = require('lodash')

class AuthStore {
    key = "auth"

    set(auth) {
        localStorage.setItem(this.key, JSON.stringify(auth || {}))
    }

    clear() {
        this.set({})
    }

    get() {
        return JSON.parse(localStorage.getItem(this.key)) || {}
    }
}

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

            this.store.set({
                token : 'asdf',
                userId : 1
            })

            return resolve()
        });
    }

    logout() {
        this.store.clear()
    }

    create(username, password) {
        return new Promise((resolve, reject) => {
            this.allowed.push({username, password})
            resolve()
        })
    }

    isLoggedIn() {
        return this.store.get().token != null
    }

    getToken() {
        return this.store.get().token
    }

    getUserId() {
        return this.store.get().userId
    }
}

export default new AuthService()