function attachEvents() {
    const locationsUrl = 'https://judgetests.firebaseio.com/locations.json'
    let locationInput = $('#location')
    let locationCode = ''
    let loadingP = ('<p class="loading"><i>Loading...</i></p>')
    $('#submit').click(function () {
        $('#forecast').css('display', 'block')
        $('#current').append(loadingP)
        $('#upcoming').append(loadingP)
        $.get(locationsUrl)
            .then(getID)
            .catch(displayError)
    })

    let weatherSymbols = [['Sunny', "&#x2600"], // ☀,
        ['Partly sunny', "&#x26C5"], // ⛅,
        ['Overcast', "&#x2601"], // ☁,
        ['Rain', "&#x2614"], // ☂,
        ['Degrees', "&#176"]]  // °

    function getID(result) {
        locationCode = (result.find(e => e.name === locationInput.val()))['code']
        let currentWeatherURL = `https://judgetests.firebaseio.com/forecast/today/${locationCode}.json`
        console.log(currentWeatherURL)
        $.get(currentWeatherURL)
            .then(renderCurrentDiv)
            .catch(displayError)
        $.get(`https://judgetests.firebaseio.com/forecast/upcoming/${locationCode}.json`)
            .then(renderUpcomingDiv)
            .catch(displayError)
    }

    function renderCurrentDiv(res) {
        $('.errorMessage').remove()
        let conditionString = res.forecast.condition
        let condSymbol = (weatherSymbols.find(e => e[0] === conditionString))[1]
        let currentDiv = $('#current')
        currentDiv.find('span').remove()
        $('#current>.loading').remove()

        let conditionSymb = ''
        let weatherSymbol = $(`<span class="condition symbol">${condSymbol}</span>`)
        let conditionSpan = $(`<span class="condition">`)
        let tempSpan = $(`<span class="forecast-data">${res.forecast.low}&#176/${res.forecast.high}&#176</span>`)
        let stringSpan = $(`<span class="forecast-data">${res.forecast.condition}</span>`)
        let nameSpan = $(`<span class="forecast-data">${res.name}</span>`)
        conditionSpan.append(nameSpan)
            .append(tempSpan)
            .append(stringSpan)
        currentDiv.append(weatherSymbol)
        currentDiv.append(conditionSpan)
    }

    function renderUpcomingDiv(result) {
        $('.errorMessage').remove()
        $('#upcoming').find('span').remove()
        $('#upcoming > .loading').remove()
        for (let day of result.forecast) {
            let conditionString = day.condition
            let condSymbol = (weatherSymbols.find(e => e[0] === conditionString))[1]
            let weatherSymbol = $(`<span class="symbol">${condSymbol}</span>`)
            let tempSpan = $(`<span class="forecast-data">${day.low}&#176/${day.high}&#176</span>`)
            let stringSpan = $(`<span class="forecast-data">${day.condition}</span>`)
            let element = $(`<span class="upcoming">`)
            element.append(weatherSymbol).append(tempSpan).append(stringSpan)
            $('#upcoming').append(element)
        }
    }

    function displayError() {
        let errorElement = $('<div class="errorMessage">Error</div>')
            .css({'background-color':'red','text-align':'center'})
        $('#upcoming').find('span').remove()
        $('#current').find('span').remove()
        $('#upcoming > .loading').remove()
        $('#current > .loading').remove()
        $('#forecast').prepend(errorElement).css('display', 'block')

    }
}