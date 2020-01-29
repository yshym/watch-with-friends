export default class AlertMessage
    constructor: (@container, @text, @type) ->

    post: ->
        alertElement = document.getElementsByClassName("alert")[0]

        unless alertElement?
            messageDiv = document.createElement "div"
            messageDiv.className = "alert alert-#{@type}"

            messageText = document.createTextNode @text

            messageDiv.appendChild messageText
            @container.prepend messageDiv

            setTimeout(
                => @container.removeChild messageDiv,
                5000
            )

    @removeFrom: (container) ->
        alertElement = document.getElementsByClassName("alert")[0]

        if alertElement
            setTimeout(
                => container.removeChild alertElement,
                5000
            )
