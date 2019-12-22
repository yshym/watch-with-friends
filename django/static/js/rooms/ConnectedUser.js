export default class ConnectedUser {
    constructor(username) {
        this.username = username
    }

    createElement() {
        let spanWrapper = document.createElement("span")
        this.username !== roomAuthor
            ? spanWrapper.className = "img-thumbnail bg-info"
            : spanWrapper.className = "img-thumbnail bg-warning"

        let userIcon = document.createElement("i")
        this.username !== roomAuthor
            ? userIcon.className = "fa fa-user"
            : userIcon.className = "fa fa-user-cog"

        let usernameText = document.createTextNode(` ${this.username}`)
        spanWrapper.appendChild(userIcon)
        spanWrapper.appendChild(usernameText)

        return spanWrapper
    }

    addToContainer(container) {
        container.appendChild(this.createElement(this.username))
    }
}
