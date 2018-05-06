function attachEvents() {

    let startElement = $('<div class="waitMessage"> <i> Please, Wait Data to Load and add a new Student . . . .<i></div>')
        .css({
            'background-color': 'blue',
            'color': 'white',
            'text-align': 'center',
            'width': '70%', 'margin': 'auto'
        })

    const baseURL = 'https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students'
    const UserName = 'guest'
    const Password = 'guest'
    const Base_64 = btoa(`${UserName}:${Password}`)
    const AuthorizHeads = {
        'Authorization': "Basic " + Base_64
    }
    let resultsElement = $('#results')
    let addFormElement = $(`<div id="addStudent">
        <fieldset id="studentData">
        <legend>Add Student</legend>
        <label>First Name</label>
        <input type="text" class="firstName"/>
        <label>Last Name</label>
        <input type="text" class="lastName"/>
                <label>Faculty Number</label>
        <input type="number" class="fNumber"/>
        <label>Grade</label>
        <input type="number" class="grade"/>
        
    </fieldset>
</div>`)
    addFormElement.append($('<button class="add">Add</button>').click(addStudent))

    function startEvents() {
        console.log('start')
        resultsElement.prepend(startElement)
        addFormElement.css({'border':'0.5px solid blue',
            'display':'flex',
            'flex-direction':'column',
            'widt':'40%', 'background-color':'lightgray'})
        $('#studentData').css({'display':'flex',
            'flex-direction':'column',
            'widt':'90%', 'background-color':'#F0F8FF'})
        resultsElement.prepend(addFormElement)
        $.ajax({
            method: "GET",
            url: baseURL,
            headers: AuthorizHeads,

        }).then(renderResult)
        // .catch(handleError('Data retrieving error'))
    }

    $(document).on('load', startEvents())


    function addStudent() {
       let postData = {
            "FirstName": $(`#addStudent .firstName`).val(),
            "LastName": $(`#addStudent .lastName`).val(),
            "FacultyNumber": $(`#addStudent .fNumber`).val(),
            "Grade": Number($(`#addStudent .grade`).val())
        }
        let dataColect = $('#addStudent').find('input')
        console.log(Object.values(postData))
        if (Object.values(postData).includes('')) {
            handleError('Empty field')
        }
        if (!dataColect.FacultyNumber.match(/[0-9]+/) || typeof (dataColect.Grade) !== 'number') {
            handleError("Faculty Number and Grade must contain numbers only!")
        }
        // else {
        //     $.ajax({
        //         method: "POST",
        //         url: baseURL,
        //         headers: AuthorizHeads,
        //         data: postData
        //     }).then(listAllCatches)
        //         .catch(handleError('Post Data Error'))
        //
        // }
    }

    function listAllStudents(res) {
        resultsElement.empty()
        let waitElement = $('<div class="waitMessage"> <i> Data is Loading . . . .<i></div>')
            .css({'background-color': 'blue', 'text-align': 'center'})

    }

    function renderResult(res) {
        startElement.remove()
        resultsElement.css({'width':'55%', 'margin-left':'5%'})
        // let tBodyElement = $('<tbody>')
        let sorted = res.sort((a, b) => a._id - b._id)
        for (let student of sorted) {
            let element = $('<tr>')
            element.append($('<td>').text(student._id))
            element.append($('<td>').text(student.FirstName))
            element.append($('<td>').text(student.LastName))
            element.append($('<td>').text(student.FacultyNumber))
            element.append($('<td>').text(student.Grade))
            // tBodyElement.append(element)
            resultsElement.append(element)
        }


    }

    function handleError(message) {
        let errorElement = $('<div class="errorMessage"></div>').text(message)
            .css({'background-color': 'red', 'text-align': 'center'})
        $('#results').prepend(errorElement)

    }

}