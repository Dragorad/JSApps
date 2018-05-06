function getAllChirps(){
    
}
function postChirp() {
    
}

function userProdLogOn(data) {
    showInfo('Logging in')
    setSessionStorageData(data)
    showLoggedInView()
    renderChirpList()
    showProdView("viewChirp")
}

function userChirpLogOut() {
    showInfo('Loging off')
    kinveyRequester
        .post("user", "_logout")
        .then(function () {
            sessionStorage.clear()
            showWelcomeScreen()
        })
        .catch(handleProdError)
}



function renderChirpList() {
    console.log('goljam kef')
    kinveyRequester.get("appdata", "chirps")
        .then((data)=>{
            console.log(data)
        })
        .catch(function (error) {
            console.log(error.message)
        })
}

function createChirp(chirpData) {

    console.log('create Chirp started')
        kinveyRequester.post("appdata", "chirp", chirpData)

}

async function deleteChirp(id) {
    await kinveyRequester.remove('appdata', 'chirps/' + id)
    showInfo('Chirp Deleted')
    // showActualAdsList()
}


//List all Chirps by followers (Feed – sorted by post time, descending)
//https://baas.kinvey.com/appdata/app_key/chirps?query={"author":{"$in": [${subs}]}}&sort={"_kmd.ect": 1}
//Where subs is an array of subscriptions (by username)
function getFollowersChirps(){
    let subs = sessionStorage.getItem(('subscriptions'))
    return $.ajax(kinveyRequester.get('appdata', `chirps?query={"author":{"$in": [${subs}]}}&sort={"_kmd.ect": 1}`))

}



function getUserChirps(){
    let username = sessionStorage.getItem('username')
    // GET https://baas.kinvey.com/appdata/app_key/chirps?query={"author":"username"}&sort={"_kmd.ect": 1}
    return $.ajax(kinveyRequester.get('appdata', `chirps?query={"author":"${username}"}&sort={"_kmd.ect": 1}`))
}

//This query will return all of the chirps by given user.
function getCountChirps() {
    let username = sessionStorage.getItem('username')
    return $.ajax(makeRequest('GET', 'appdata', `chirps?query={"author":"${username}"}`))
}

//This query will return the needed user.
// The count of the people that the user is following is the length of the subscriptions array.
function getFollowingUsers() {
//    GET https://baas.kinvey.com/user/app_key/?query={"username":"username"}
    let username = sessionStorage.getItem('username')
    return $.ajax(kinveyRequester( 'appdata', `?query={"${username}":"${username}"}`))
}

// The following query will return all users that are subscribed to given username.
function getUsersFollowUser() {
//GET https://baas.kinvey.com/user/app_key/?query={"subscriptions":"username"}
    let username = sessionStorage.getItem('username')
    return $.ajax(makeRequest('GET', 'appdata', `?query={"subscriptions":"${username}"}`))
}
// In the discover page you should display all users except the currently logged.

function getDiscoverPage() {
//    GET https://baas.kinvey.com/user/app_key/
    return $.ajax( makeRequest('GET', 'user'))
}

// function editAd(id) {
//     kinveyRequester.get('appdata', 'chirps/' + id)
//         .then(function (data) {
//             showInfo('Loading data')
//             console.log(data)
//             let renderedForm = $('#formEditAd')
//             renderedForm.css('background-color', 'rgb(15, 107, 107)')
//             renderedForm.find('input[name = "title"]').val(data.title)
//             renderedForm.find('textarea[name = description]').val(data.description)
//             renderedForm.find('input[name = "date-published"]').hide()
//             renderedForm.find('input[name = "price"]').val(Number(data.price))
//                 .prepend($('input[name = "date-published"]').val((data._kmd.lmt).toString('yyyy-MM-dd')))
//
//             $("#viewEditAd").show()
//             $('#buttonEditAd').click(function () {
//                 kinveyRequester.update('appdata', 'chirps/' + id, getAddData('formEditAd'))
//                     .then(showActualAdsList())
//                     .catch(handlechirpError)
//             })
//
//
//         })
//         .catch(handlechirpError)
// }


// function handleProdError(response) {
//     let errorMsg = JSON.stringify(response)
//     if (response.readyState === 0)
//         errorMsg = "Cannot connect due to network error."
//     if (response.responseJSON && response.responseJSON.description)
//         errorMsg = response.responseJSON.description
//     showError(errorMsg)
// }
