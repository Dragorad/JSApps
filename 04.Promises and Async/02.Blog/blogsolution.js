function attachEvents() {
    const URL = 'https://baas.kinvey.com/appdata/kid_HJ-AeZHqf/'
    const UserName = 'peter'
    const Password = 'p'
    const Base_64 = btoa(`${UserName}:${Password}`)
    const AuthorizHeads = {
        'Authorization': "Basic " + Base_64
    }

    let postsSelect = $('#posts')
    $('#btnLoadPosts').click(function() {
        postsSelect.empty()
        $.ajax({
            method: "GET",
            url: URL + 'posts',
            headers: AuthorizHeads
        }).then(addOptions)
    })
    $('#btnViewPost').click(function() {
        $.ajax({
            method: 'GET',
            url: URL + 'posts',
            headers: AuthorizHeads
        }).then(displayDetails)
    })

    function displayDetails(res) {
        $('#post-body').empty()
        let postTitle = postsSelect.find(':selected').val()
        let currentPost = res.find(e => e.title === postTitle)
        let postID = currentPost['_id']
        console.log(postID)
        $('#post-title').text(postTitle)
        $('#post-body').append($('<li>').text(`${currentPost.body}`))
        $.ajax({
            url: URL + `comments/?query={"post_id":"${postID}"}`,
            headers: AuthorizHeads
        }).then(addComments)

        function addComments(res) {
            $('#post-comments').empty()
            console.log(res)
            for (let comment of res) {
                $('#post-comments').append(`<li>${comment.text}</li>`)

            }
        }
    }

    function addOptions(res) {
        for (let key in res) {
            console.log(res[key])
            let postID = res[key]['_id']
            let postTitle = res[key].title
            let element = $(`<option>`)
                .text(postTitle)
            postsSelect.append(element)
        }

    }
}