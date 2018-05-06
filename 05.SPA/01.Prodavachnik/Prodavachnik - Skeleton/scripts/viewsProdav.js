function showWelcomeScreen() {
    $("#menu").children().hide()
    let welcomeElements = $('#linkHome, #linkLogin, #linkRegister')
    welcomeElements.show()
    showProdView("viewHome")

}
function showActualAdsList() {
    hideAllElements()
    $('#viewAds table').children().not('first').remove()
    renderAdsList()
}
function hideAllElements() {
    $('main section').hide()
}

function showProdView( selector) {
    $('a, button').attr('onclick', "return false")
    hideAllElements()
    $('#' + selector).show()
}

function showCreateAd() {
    hideAllElements()
    $("#viewCreateAd").show()
}
function showRegisterScreen() {
    hideAllElements()
    $('#viewRegister').show()
}

function showLoginView() {
    hideAllElements()
    $('#viewLogin').show()
}

function showLoggedInView() {
    hideAllElements()
    $('#linkRegister').hide()
    $('#linkLogin').hide()
    $('#linkLogout').show()
    $('#linkCreateAd').show()
    $('#linkListAds').show()
    $('#viewAds').show()


}

function showInfo(message) {
    let infoBox = $('#infoBox')
    infoBox.text(message).css('background-color', '#76eaea')
    infoBox.show()
    setTimeout(function() {
        $('#infoBox').fadeOut()
    }, 3000)
}

function showError(errorMsg) {
    let errorBox = $('#errorBox')
    errorBox.text("Error: " + errorMsg)
    errorBox.show()
}

function showHomeView() {
    showView('viewHome')
}
