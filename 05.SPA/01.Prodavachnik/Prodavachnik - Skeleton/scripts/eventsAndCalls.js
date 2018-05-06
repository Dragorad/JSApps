function addAllEvents() {
    $('input, button').each(function () {
        $(this).click(() => {
            return false
        })
    })
    $("#linkLogin").click(function (e) {
        e.preventDefault()
        showProdView('viewLogin')
    })
    $("#linkRegister").click(function (e) {
        e.preventDefault()
        showProdView('viewRegister')
    })
    $('#buttonRegisterUser').click(registerProdUser)
    $('#buttonLoginUser').click(loginProdUser)
    $('#linkLogout').click(userProdLogOut)
    $('#buttonCreateAd').click(createAdd)
    $('#linkListAds').click(showActualAdsList)
    $('#linkCreateAd').click(showCreateAd)
    $('#buttonEditAd').click(editAd)


}