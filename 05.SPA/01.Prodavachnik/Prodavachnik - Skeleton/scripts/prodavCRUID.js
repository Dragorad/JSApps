function setSessionStorageData(data) {
    sessionStorage.clear()
    sessionStorage.setItem("authToken", `${data._kmd.authtoken}`)
    sessionStorage.setItem("username", `${data.username}`)
    sessionStorage.setItem("userID", `${data._acl.creator}`)
}

let kinveyRequester = (() => {
    const prodBaseUrl = "https://baas.kinvey.com/"
    const appId = "kid_ByjjBCoqM"
    const appSecret = "37cd0f4e401c40318fdd34c30095f75e"

    function makeAuth(type) {
        if (type === "basic") {
            return "Basic " + btoa(appId + ":" + appSecret)
        } else {
            return "Kinvey " + sessionStorage.getItem("authtoken")
        }
    }

    function makeRequest(method, module, url, auth) {
        return (req = {
            method,
            url: prodBaseUrl + module + "/" + appId + "/" + url,
            headers: {
                Authorization: makeAuth(auth)
            }
        })
    }

    function get(module, url, auth) {
        return $.ajax(makeRequest("GET", module, url, auth))
    }

    function post(module, url, data, auth) {
        let req = makeRequest("POST", module, url, auth)
        req.data = JSON.stringify(data)
        req.headers["Content-Type"] = "application/json"
        return $.ajax(req)
    }

    function update(module, url, data, auth) {
        let req = makeRequest('PUT', module, url, auth)
        req.data = JSON.stringify(data)
        req.headers['Content-Type'] = 'application/json'
        return $.ajax(req)
    }

    function remove(module, url, auth) {
        return $.ajax(makeRequest("DELETE", module, url, auth))
    }

    return {get, post, remove, update}
})()

function userProdLogOn(data) {
    showInfo('Logging in')
    setSessionStorageData(data)
    showLoggedInView()
    renderAdsList()
    showProdView("viewAds")
}

function userProdLogOut() {
    showInfo('Loging off')
    kinveyRequester
        .post("user", "_logout")
        .then(function () {
            sessionStorage.clear()
            showWelcomeScreen()
        })
        .catch(handleProdError)
}

function prodGetUserData(selector) {
    let parent = $(`#${selector}`)
    let prodData = {
        username: parent.find('input[name = "username"]').val(),
        password: parent.find('input[name = "passwd"]').val()
    }
    console.log(prodData)
    parent.find('input[name = "username"]').val("")
    parent.find('input[name = "passwd"]').val("")
    return prodData
}

function registerProdUser() {
    let data = prodGetUserData("viewRegister")
    kinveyRequester
        .post("user", "", data, "basic")
        .then(userProdLogOn)
        .catch(function () {
            console.log(error)
        })
}

function loginProdUser() {
    let data = prodGetUserData("viewLogin")
    kinveyRequester
        .post("user", "login", data, "basic")
        .then(userProdLogOn)
        .catch(function (error) {
            console.log(error.message)
        })
}


function renderAdsList() {
    console.log('goljam kef')
    kinveyRequester.get("appdata", "adverts")
        .then(generateAdsList)
        .catch(function (error) {
            console.log(error.message)
        })
}

function generateAdsList(data) {
    hideAllElements()
    let dataSorted = Array.from(data).sort((a, b) => Date.parse(b._kmd.lmt) - Date.parse(a._kmd.lmt))
    console.log(dataSorted)
    for (let ad of dataSorted) {
        let element = $(`<tr>
                    <td>${ad.title}</td>
                    <td>${ad.ownerName}</td>
                    <td>${ad.description}</td>
                    </tr>`)
        let adPrice = Number(ad['price']).toFixed(2)
        let priceDiv = $('<td>').text(adPrice)
        let dateDiv = $('<td></td>').text(`${ad["date-published"]
            .toString().substr(0, 10)}`)
        element.append(priceDiv)
            .append(dateDiv)
            .append($('<td></td>'))

        if (ad.ownerID === sessionStorage.getItem('userID')) {
            let deleteAdElement = $('<a href="#">[Delete]</a>')
                .attr('adID', ad._id).click(() => deleteAd(ad._id))
            let editAdElement = $('<a href="#">[Edit]</a>')
                .attr('adID', ad._id).click(() => editAd(ad._id))
            element.children(':last').append(deleteAdElement)
                .append(editAdElement)

        }
        $("#ads table").append(element)
        $("#viewAds").show()
    }
}

function getAddData(selector) {
    console.log("started Get AdData")
    let parentDiv = $(`#${selector}`)
    let adData = {
        title: parentDiv.find('input[name = "title"]').val(),
        description: parentDiv.find('textarea[name = "description"]').val(),
        "date-published": (new Date()),
        price: parentDiv.find('input[name = "price"]').val(),
        ownerID: sessionStorage.getItem("userID"),
        ownerName: sessionStorage.getItem("username")
    }

    parentDiv.find('input[name = "username"]').val("")
    parentDiv.find('input[name = "description"]').val("")
    parentDiv.find('input[name = "passwd"]').val("")
    console.log(adData)
    return adData
}

function storeAdd(selector) {
    console.log('storeAdd started')
    let adData = getAddData(selector)//"formCreateAd"
    showInfo('Loading data')

    kinveyRequester.post("appdata", "adverts", adData)
        .then(showActualAdsList)
        .catch(handleProdError)
}

async function deleteAd(id) {
    await kinveyRequester.remove('appdata', 'adverts/' + id)
    showInfo('Ad Deleted')
    showActualAdsList()
}

function createAdd() {
    hideAllElements()
    storeAdd("formCreateAd")
}

function editAd(id) {
    hideAllElements()

    kinveyRequester.get('appdata', 'adverts/' + id)
        .then(function (data) {
            showInfo('Loading data')
            console.log(data)
            let renderedForm = $('#formEditAd')
            renderedForm.css('background-color', 'rgb(15, 107, 107)')
            renderedForm.find('input[name = "title"]').val(data.title)
            renderedForm.find('textarea[name = description]').val(data.description)
            renderedForm.find('input[name = "date-published"]').hide()
            renderedForm.find('input[name = "price"]').val(Number(data.price))
                .prepend($('input[name = "date-published"]').val((data._kmd.lmt).toString('yyyy-MM-dd')))

            $("#viewEditAd").show()
            $('#buttonEditAd').click(function () {
                kinveyRequester.update('appdata', 'adverts/' + id, getAddData('formEditAd'))
                    .then(showActualAdsList())
                    .catch(handleProdError)
            })


        })
        .catch(handleProdError)
}

function handleProdError(response) {
    let errorMsg = JSON.stringify(response)
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error."
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description
    showError(errorMsg)
}
