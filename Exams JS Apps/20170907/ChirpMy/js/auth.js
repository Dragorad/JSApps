let auth = (() => {
    function isAuth() {
        return sessionStorage.getItem('authtoken') !== null
    }

    function saveSession(userData) {
        console.log('saveSession in')
        sessionStorage.setItem('authtoken', userData._kmd.authtoken)
        sessionStorage.setItem('username', userData.username)
        sessionStorage.setItem('userId', userData._id)
        sessionStorage.setItem('subscriptions', userData.subscriptions)
    }


    function register(username, password) {
        let userData = {
            username: username,
            password: password,
            subscriptions:[]
        }
        kinveyRequester.post('user', '', userData, 'basic')
            .then((data)=>{
                saveSession(data)
            showInfo('User registration successful.')})
            .catch(console.error)
    }

    function login(username, password) {

        return kinveyRequester.post('user', 'login', {username, password}, 'basic')
    }

    function logout() {
        kinveyRequester.post('user', '_logout')
            .then(() => {
                sessionStorage.clear()
            })
            .catch(notify.handleError)
    }

    return {
        isAuth, login, logout, register, saveSession
    }
})()