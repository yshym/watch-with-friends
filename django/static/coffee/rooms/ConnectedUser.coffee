export default class ConnectedUser
    constructor: (@username) ->

    createElement: ->
        spanWrapper = document.createElement "span"
        if @username != roomAuthor
            spanWrapper.className = "img-thumbnail bg-info"
        else
            spanWrapper.className = "img-thumbnail bg-warning"

        userIcon = document.createElement "i"
        if @username != roomAuthor
            userIcon.className = "fa fa-user"
        else
            userIcon.className = "fa fa-user-cog"

        usernameText = document.createTextNode " #{this.username}"
        spanWrapper.appendChild userIcon
        spanWrapper.appendChild usernameText

        spanWrapper

    addToContainer: (container) ->
        container.appendChild @createElement @username
