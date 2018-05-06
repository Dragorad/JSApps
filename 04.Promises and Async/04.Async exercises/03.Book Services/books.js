class BookCreator {
    constructor(title, author, isbn) {
        [this.title, this.author, this.isbn] = [title, author, isbn]
        this.request = this.generateRequest
        const UserName = 'peter'
        const Password = 'p'
        const Base_64 = btoa(`${UserName}:${Password}`)
        const AuthorizHeads = {
            'Authorization': "Basic " + Base_64
        }
    }

    listAllBooks() {

    }

    generatePutRequest(author, title, isbn) {
        const baseURL = 'https://baas.kinvey.com/appdata/kid_Sys9m1DqG/books'
        const UserName = 'peter'
        const Password = 'p'
        const Base_64 = btoa(`${UserName}:${Password}`)
        const AuthorizHeads = {
            'Authorization': "Basic " + Base_64
        }
        let postData = {
            title: this.title,
            author: this.author,
            ISBN:this.isbn
        }
        return $.ajax({
            method: "PUT",
            url: baseURL + `/${id}`,
            data: postData,
            headers: AuthorizHeads
        })

    }

}
function attachEvents() {

    let startElement = $('<div class="waitMessage"> <i> Please, click Load Button or add a new Catch . . . .<i></div>')
        .css({
            'background-color': 'blue',
            'color': 'white',
            'text-align': 'center',
            'width': '70%', 'margin': 'auto'
        })
    $('#catches').empty().append(startElement)
    const baseURL = 'https://baas.kinvey.com/appdata/kid_SkuRoI8cf/biggestCatches'
    const UserName = 'peter'
    const Password = 'p'
    const Base_64 = btoa(`${UserName}:${Password}`)
    const AuthorizHeads = {
        'Authorization': "Basic " + Base_64
    }
    let postData = ''
    $('.add').click(addCatch)
    $('.load').click(listAllCatches)
    let updateBrn = $('#catches').find('.update')
    updateBrn.click(updateCatch)

    function updateCatch() {
        let parentElement = $(this).parent()
        let id = parentElement.attr('data-id')
        console.log(parentElement)
        getPostData()
        console.log(postData)
        $.ajax({
            method: "PUT",
            url: baseURL + `/${id}`,
            data: postData,
            headers: AuthorizHeads
        }).then(function () {
            console.log(id)
            console.log(postData)
        })

    }

    function deleteCatch() {
        let parentElement = $(this).parent()
        let id = parentElement.attr('data-id')
        $.ajax({
            method: "DELETE",
            url: baseURL + `/${id}`,
            headers: AuthorizHeads
        }).then(function () {

            parentElement.remove()
            listAllCatches()
        })


    }

    function getPostData() {
        let parentElement = $(this).parent()
        parentElement.attr('id', 'active')
        let selector = '#active'
        let id = parentElement.attr('data-id')

        postData = {
            "angler": $(`${selector} .angler`).val(),
            "weight": Number($(`${selector} .weight`).val()),
            "species": $(`${selector} .species`).val(),
            "location": $(`${selector} .location`).val(),
            "bait": $(`${selector} .bait`).val(),
            "captureTime": Number($(`${selector} .captureTime`).val())
        }

        parentElement.removeAttr('id')
    }

    function addCatch() {
        getPostData()
        $.ajax({
            method: "POST",
            url: baseURL,
            headers: AuthorizHeads,
            data: postData
        }).then(listAllCatches)
            .catch(handleError)

    }

    function listAllCatches(res) {
        $('#catches').empty()
        let waitElement = $('<div class="waitMessage"> <i> Data is Loading . . . .<i></div>')
            .css({'background-color': 'sky blue', 'text-align': 'center'})
        $('#catches').prepend(waitElement)
        $.ajax({
            method: "GET",
            url: baseURL,
            headers: AuthorizHeads,

        }).then(renderResult).catch(handleError)
    }

    function renderResult(res) {
        $('#catches').empty()
        for (let record of res) {
            let element = $(`<div class="catch" data-id="${record['_id']}">`)

            let anglerElement = $('<label>Angler</label>')
            anglerElement.append($('<input type="text" class="angler">').val(record.angler))

            let weightElement = $('<label>Weight</label>')
            weightElement.append($('<input type="number" class="weight">').val(record.weight))

            let speciesElement = $('<label>Species</label>')
            speciesElement.append($('<input type="text" class="species">').val(record.species))
            let locationElement = $('<label>Location</label>')
            locationElement.append($('<input type="text" class="location">').val(record.location))
            let baitElement = $('<label>Bait</label>')
            baitElement.append($('<input type="text" class="bait">').val(record.bait))

            let captTimeElement = $('<label>Capture Time</label>')
            captTimeElement.append($('<input type="number" class="captureTime">').val(record.captureTime))

            element.append(anglerElement)
                .append(weightElement)
                .append(speciesElement)
                .append(locationElement)
                .append(baitElement)
                .append(captTimeElement)

            element.append($(`<button class="update">Update</button>`).click(updateCatch))
            element.append($(`<button class="delete">Delete</button>`).click(deleteCatch))

            $('#catches').append(element)
        }
    }

    function handleError(error) {
        let errorElement = $('<div class="errorMessage">Error</div>')
            .css({'background-color': 'red', 'text-align': 'center'})
        $('#catches').prepend(errorElement)

    }

}