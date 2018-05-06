let kinveyRequester = (() => {
    const chirpBaseUrl = "https://baas.kinvey.com/"
    const appId = "kid_r1J1RcujG"
    const appSecret = "3740af394408490db79be1ef4c087320"

    function makeAuth(type) {
        if (type === "basic") {
            return "Basic " + btoa(appId + ":" + appSecret)
        } else {
            return "Kinvey " + sessionStorage.getItem("authtoken")
        }
    }

    function makeRequest(method, module, endpoint, auth) {
        return (req = {
            method,
            url: chirpBaseUrl + module + "/" + appId + "/" + endpoint,
            headers: {
                Authorization: makeAuth(auth)
            }
        })
    }

    function get(module, endpoint, auth) {
        return $.ajax(makeRequest("GET", module, endpoint, auth))
    }

    function post(module, endpoint, data, auth) {
        let req = makeRequest("POST", module, endpoint, auth)
        req.data = JSON.stringify(data)
        req.headers["Content-Type"] = "application/json"
        return $.ajax(req)
    }

    function getAllChirpsByFollowers() {

        return $.ajax(makeRequest("GET", 'appdata', 'chirps',
            '?query={"author":{"$in": [${subs}]}}&sort={"_kmd.ect": 1}'))
    }
        
function createChirp() {
    
}
    function update(module, endpoint, data, auth) {
        let req = makeRequest('PUT', module, endpoint, auth)
        req.data = JSON.stringify(data)
        req.headers['Content-Type'] = 'application/json'
        return $.ajax(req)
    }

    function remove(module, endpoint, auth) {
        return $.ajax(makeRequest("DELETE", module, endpoint, auth))
    }

    return {get, post, remove, update}
})()



function handleChirpError(response) {
    let errorMsg = JSON.stringify(response)
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error."
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description
    showError(errorMsg)
}
