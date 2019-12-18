// Add user span to the DOM on new connection
export default function userSpan(username) {
    let spanWrapper = document.createElement("span")
    username !== roomAuthor
        ? spanWrapper.className = "img-thumbnail bg-info"
        : spanWrapper.className = "img-thumbnail bg-warning"

    let userIcon = document.createElement("i")
    username !== roomAuthor
        ? userIcon.className = "fa fa-user"
        : userIcon.className = "fa fa-user-cog"

    let usernameText = document.createTextNode(` ${username}`)
    spanWrapper.appendChild(userIcon)
    spanWrapper.appendChild(usernameText)

    return spanWrapper
}
