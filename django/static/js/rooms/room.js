// Remove alert if exist
let alert = document.querySelector(".alert")
let container = document.querySelector(".container-xl")
if (alert !== null) {
    setTimeout(() => container.removeChild(alert), 5000)
}

const plyrPlayer = new Plyr("#video-active", {
    controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "captions",
        "airplay",
        "fullscreen",
    ],
})

let chatLog = document.querySelector("#chat-log")
let chatLogBody = document.querySelector("#chat-log-body")
let messageInput = document.querySelector("#chat-message-input")
let video = document.querySelector("#video-active")
let connectedUsers = []

chatLog.scrollTop = chatLog.scrollHeight

let chatSocket = new WebSocket(
    `ws://${window.location.host}/ws/chat/${roomName}/`
)

function newMessageDiv(username, timestamp, message) {
    let cardDiv = document.createElement("div")
    cardDiv.className = "img-thumbnail d-inline-flex"
    cardDiv.style = "max-width: 55vw;"

    let cardBodyDiv = document.createElement("div")

    let authorP = document.createElement("p")
    authorP.className = "font-weight-bold"
    let authorText = document.createTextNode(username)
    authorP.appendChild(authorText)

    let timestampSpan = document.createElement("span")
    timestampSpan.className = "badge text-muted"
    let timestampText = document.createTextNode(timestamp)
    timestampSpan.appendChild(timestampText)

    let contentP = document.createElement("span")
    let contentText = document.createTextNode(message)
    contentP.appendChild(contentText)

    authorP.appendChild(timestampSpan)
    cardBodyDiv.appendChild(authorP)
    cardBodyDiv.appendChild(contentP)
    cardDiv.appendChild(cardBodyDiv)

    return cardDiv
}

HTMLElement.prototype.removeChildren = function() {
    while (this.firstChild) {
        this.removeChild(this.firstChild)
    }
    return this
}

function userSpan(username) {
    let spanWrapper = document.createElement("span")
    spanWrapper.className = "img-thumbnail bg-info"

    let userIcon = document.createElement("i")
    userIcon.className = "fa fa-user"

    let usernameText = document.createTextNode(` ${username}`)
    spanWrapper.appendChild(userIcon)
    spanWrapper.appendChild(usernameText)

    return spanWrapper
}

chatSocket.onmessage = function(e) {
    console.log(e)
    let data = JSON.parse(e.data)
    let message_type = data["type"]
    let username


    if (roomAuthor != user) {
    switch (message_type) {
        case "message":
            username = data["username"]
            let message = data["message"]
            let timestamp = data["timestamp"]

            if (chatLogBody.firstElementChild) {
                chatLogBody.appendChild(document.createElement("br"))
            }
            chatLogBody.appendChild(newMessageDiv(username, timestamp, message))
            chatLogBody.appendChild(document.createElement("br"))

            if (username != "{{ user.username }}") {
                messagesCards = document.querySelectorAll(
                    ".img-thumbnail.d-inline-flex"
                )
                lastMessageCard = messagesCards[messagesCards.length - 1]
                lastMessageCard.className =
                    "img-thumbnail d-inline-flex bg-light"
            }

            chatLog.scrollTop = chatLog.scrollHeight
            break
        case "seeked_video":
            let currentTimeData = data["current_time"]
            console.log(currentTimeData)
            video.currentTime = currentTimeData
            break
        case "pause_video":
            video.pause()
            break
        case "play_video":
            video.play()
            break
        case "user_connected":
        case "user_disconnected":
            connectedUsers = data["connected_users"].split(",")
            let connectedUsersContainer = document.querySelector(
                "#connectedUsers"
            )
            connectedUsersContainer.removeChildren()

            connectedUsers.forEach(function(username) {
                connectedUsersContainer.appendChild(userSpan(username))
            })

            break
        default:
            console.log("Unknown WS message!")
    }
    }
}

if (roomAuthor == user) {
    video.onpause = function() {
        chatSocket.send(
            JSON.stringify({
                type: "pause_video",
            })
        )
    }

    video.onplay = function() {
        chatSocket.send(
            JSON.stringify({
                type: "play_video",
            })
        )
    }

    video.onseeked = function() {
        chatSocket.send(JSON.stringify({
            'type': 'seeked_video',
            'currentTime': video.currentTime,
        }));
    };
}

chatSocket.onclose = function(e) {
    console.error("Chat socket closed unexpectedly")
}

messageInput.focus()
messageInput.onkeyup = function(e) {
    if (e.keyCode === 13) {
        // enter, return
        document.querySelector("#chat-message-submit").click()
    }
}

document.querySelector("#chat-message-submit").onclick = function(e) {
    if (messageInput.value.trim() != "") {
        let message = messageInput.value

        chatSocket.send(
            JSON.stringify({
                type: "message",
                room_name: "{{ room.name }}",
                username: "{{ user.username }}",
                message: message,
            })
        )

        messageInput.value = ""
    }
}
