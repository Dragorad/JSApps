function attachMyEvents() {
    $('#btnLogin').click(loginMyUser)
    $('#btnRegister').click(registerMyUser)
    $('#profile a').click(logoutCurrentUser)
}
