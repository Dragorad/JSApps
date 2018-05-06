const handlers = {}

$(() => {
    let app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs')

        this.get('index.html', loadWelcomeView)
        this.get('#/index', loadWelcomeView)

        function loadWelcomeView() {
            this.loadPartials({
                header: "./templates/common/chirpHeader.hbs",
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/welcome.hbs')

            })
        }


        this.get('#/register', (ctx) => {
            ctx.loadPartials({
                header: './templates/common/chirpHeader.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function (ctx) {
                this.partial('./templates/forms/register.hbs')
            })
        })

        this.post('#/register', function (ctx) {

            let username = ctx.params.username
            let password = ctx.params.password
            let repeatPass = ctx.params.repeatPass
            if (username == '' || password == '') {
                alert('Username and password can not be empty!')
                return
            }

            if (password !== repeatPass) {
                alert('Passwords do not match')

            } else {
                auth.register(username, password)
                ctx.redirect('#/home')
            }

        })

        this.get('#/login', function (ctx) {
            this.loadPartials({
                header: "./templates/common/chirpHeader.hbs",
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/forms/login.hbs')

            })

        })

        this.post('#/login', function (ctx) {
            let username = ctx.params.username
            let password = ctx.params.password
            if (username == '' || password == '') {
                notify.showInfo('Username and password can not be empty!')
                return
            }
            console.log(username)
            auth.login(username, password)
                .then(function (data) {
                    auth.saveSession(data)
                    let mess = `User ${data.username} successfully logged in`
                    notify.showInfo(mess)
                    ctx.redirect('#/home')
                })

        })
        this.get('#/logout', function (ctx) {
            console.log('Logout in progerss')
            auth.logout()
            ctx.redirect('#/index')
        })

        this.get('#/home', function (ctx) {
            console.log(ctx)
            let isLogged = auth.isAuth()
            if (!isLogged) {
                ctx.redirect('#/index.html')
                return
            }
            getUserChirps()
                .then(function (data) {

                    console.log(data)
                    ctx.loadPartials({
                        header: "./templates/common/chirpHeader.hbs",
                        footer: './templates/common/footer.hbs',
                        navigation: './templates/common/navigation.hbs',
                        submitChirp: "templates/common/submitChirp.hbs"
                    })
                        .then(function () {
                            this.partial('./templates/home.hbs')
                        })
                })
        })
        this.get('#/logout', function () {
            auth.logout()
        })
        this.get('#/submitChirp', function () {
            console.log("SubmitChirp Getted")
        })
        this.post('/#submitChirp', function (ctx) {
            let text = ctx.params.text
            let author = sessionStorage.getItem('username')
            let chirpData = {
                "text": text,
                "author": author
            }
            console.log(chirpData)
            createChirp(chirpData)
                .then(function () {
                    notify.showInfo('Chirp submitted')
                    ctx.redirect('#/home')
                })
                .catch(handlechirpError)
        })

        //post - newChirp
        //post - Follow

        //get - All chirps


    }).run()
})



