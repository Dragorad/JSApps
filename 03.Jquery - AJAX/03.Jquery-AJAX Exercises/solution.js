function attachEvents() {
    let urlString = 'https://messengerapp-641b3.firebaseio.com/messenger'
    let messagesArea = $('#messages')
    let submitBtn = $('#submit')
    let refreshBtn = $('#refresh')
    refreshBtn.on('click', refreshAction)
    submitBtn.on('click', submitPost)

    function submitPost() {
        let authorArea = $('#author')
        let messageArea = $('#content')
        let timestamp = Date.now()

        if (authorArea.val() != '' && messageArea.val() != '') {
            let entry = {
                author: authorArea.val(),
                content: messageArea.val(),
                timestamp: timestamp
            }
            let sendString = JSON.stringify(entry)
            $.ajax({
                method: "POST",
                url: urlString + '\.json',
                data: sendString
            }).then(() => {
                refreshAction()
                authorArea.val('')
                messageArea.val('')
                console.log(sendString)
            }).catch(errorHandle)
        } else {
            alert('Empty field')
        }


    }

    function refreshAction() {
        $.ajax({
            method: "GET",
            url: urlString + '/.json',
            success: refreshPosts,
            error: errorHandle
        })

    }

    function refreshPosts(res) {
        let sorted = Object.keys(res).sort((a, b) => res[a].timestamp - res[b].timestamp)
        let messagesString = ''
        for (let key of sorted) {
            messagesString += `\n${res[key].author}: ${res[key].content}`
        }
        console.log(res)
        console.log(sorted)
        messagesArea.empty()
        messagesArea.text(messagesString)
    }

    function errorHandle() {
        alert('No connection with Base')
    }
}