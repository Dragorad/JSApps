let baseUrl = 'https://baas.kinvey.com'
const appKey = 'kid_H1QBO8s5M'
const appSecret = '12af8a0a1fc74ac7a000820960409984'
let authToken = {'Authorization': "Basic " + btoa(appKey + ":" + appSecret)}
let postData = {}

function getUserData(event) {
    console.log('getUserDataStart')
    let parentElement = $(event.target).parent()

    postData = {
        "username": parentElement.find('input[name = "username"]').val(),
        "password": parentElement.find('input[name = "password"]').val(),
    }

    // $.ajax({
    //     method: "POSt",
    //     url:,
    //     headers:,
    //     data: postData
    // })
}

function loginMyUser() {
    console.log('loginMyUser')
    getUserData(event)
    let urlString = baseUrl + '/user/' + appKey + '/login'
    $.ajax({
        method: "POSt",
        url: baseUrl + '/user/' + appKey + '/login',
        headers: authToken,
        data: postData
    }).then(() => {
        setStorageSessUserData
        showCurrentView('viewCatalog')
    })
        .catch((handleError(error)))

}

function setStorageSessUserData(data) {
    let token = data._kmd.authtoken
    console.log(token)
    sessionStorage.setItem('authToken', token)
    sessionStorage.setItem('currentUser', data.username)
    let userId = data._id
    sessionStorage.setItem('userId', userId)

}

function registerMyUser() {
    console.log('registerMyUser')

    function comparePassAndRepass(event) {
        let parentElement = $(event.target)
        let password = $('#registerForm input[name = "password"]').val()
        let rePassword = $('#registerForm').innerHtml()
        console.log(rePassword)
        if (password !== rePassword) {
            let errorDiv = $('<div id="errorDiv">').text('Password and repeat are different')
            $('#content').append(errorDiv)
        }else {
            getUserData(event)
            $.ajax({
                method: "POSt",
                url: baseUrl + '/user/' + appKey,
                headers: authToken,
                data: postData
            }).then(showCurrentView('viewCatalog'))
                .catch((handleError(error)))
        }
    }

    comparePassAndRepass(event)

}

function logoutCurrentUser() {
    authToken = {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`}
    console.log(authToken)
    $.ajax({
        method: "POST",
        url: baseUrl + '/user/' + appKey + '/_logout',
        headers: authToken,

    }).then(sessionStorage.empty())
        .catch(handleError(error))
}

function handleError(error) {
    console.log(error)
}
