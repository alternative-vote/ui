class AuthService {

    login(username, password) {
        return new Promise((resolve, reject) => {
            if(username =='admin' && password =='password') {
                return resolve()
            }
            return reject('Incorect username or password.');
        });
    }

}

export default new AuthService()