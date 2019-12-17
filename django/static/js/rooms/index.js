document.querySelector("#room-name-input").focus()
document.querySelector("#room-name-input").onkeyup = function(e) {
    if (e.keyCode === 13) {
        document.querySelector("#room-name-submit").click()
    }
}

function create_message(text, type) {
    if (document.querySelector(".alert") === null) {
        let messageDiv = document.createElement("div")
        messageDiv.className = `alert alert-${type}`
        let messageText = document.createTextNode(text)
        messageDiv.appendChild(messageText)
        document.querySelector(".container-xl").prepend(messageDiv)
        setTimeout(
            () =>
                document
                    .querySelector(".container-xl")
                    .removeChild(document.querySelector(".alert")),
            5000
        )
    }
}

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, "") // Trim - from end of text
}

document.querySelector("#room-name-submit").onclick = function(e) {
    let roomName = document.querySelector("#room-name-input").value
    if (roomName != "") {
        console.log(roomNames)
        if (roomNames.includes(roomName)) {
            window.location.pathname = `/${slugify(roomName)}/`
        } else {
            create_message("Room with this name does not exist!", "warning")
        }
    }
}
