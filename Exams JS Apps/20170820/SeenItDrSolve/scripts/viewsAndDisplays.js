let profileDiv = $('#profile')
function showHideAllSections() {
    $('.content>section').hide()
    profileDiv.hide()
}
function hideAllItems() {
    $('#profile').css('display','none')
    $('#menu').css('display','none')
}
let contentDiv = $('.content')
function generateProfileDiv(res) {
    let userName = res.username
    $('#profile span').text(userName)
}
function showCurrentView(viewName) {
    $('.content>section').hide() // Hide all views
    if(viewName != 'viewWelcome'){
        $('#menu').show()
        let currentUserName = sessionStorage.getItem('currentUser')
        console.log(currentUserName)
        profileDiv.find('<span>').text(currentUserName)
        profileDiv.show()
    }
    $(`#${viewName}`).css('display', 'block') // Show the selected view only
}
