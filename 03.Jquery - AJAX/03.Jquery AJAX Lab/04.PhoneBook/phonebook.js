function solve() {
const URL = 'https://phonebook-nakov.firebaseio.com/phonebook/'
function createContact() {

    let personName = $("#person")
    let personPhone = $("#phone")
    let record = JSON.stringify({
        person: personName.val(),
        phone: personPhone.val()
    })
    $.ajax({
        method: "POST",
        url: URL + '.json',
        data: record,
        success:displayList
    })
    console.log(personName, personPhone)
    personName.val('')
    personPhone.val('')
}

function displayList(res) {
    $.ajax({
        method: "GET",
        url: URL + '.json',
    }).then(handleSuccess)

        .catch(handleError)
    let displayPhones = $('#phonebook')
    displayPhones.empty()

    function handleSuccess(res) {
        console.log(res)
        for (let key in res) {
            let element = $('<li>')
                .css({'border-bottom': '0.6px solid blue'
                    ,'display': 'flex','justify-content': 'space-between', 'width': '40%'})
            element.text(`${res[key]['person']}: +${res[key]['phone'] }`)
            element.append('<button style="border-radius 12px">[Delete]</button>')
            .click(function () {
                console.log(`${URL}${key}/.json`)
                $.ajax({
                    method: "DELETE",
                    url: `${URL}${key}/.json`
                }).then(() => {

                    element.remove()
                })
            })
            displayPhones.append(element)
        }
    }
}

function handleError() {
    console.log("Error")
}

$("#btnCreate").click(createContact)
$("#btnLoad").on('click', displayList)
}
solve()