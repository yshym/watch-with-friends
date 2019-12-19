import userSpan from "./userSpan"
import newMessageDiv from "./newMessageDiv"
import {video} from "./video"


// Initialize WebSocket
export const chatSocket = new WebSocket(
    `ws://${window.location.host}/ws/chat/${roomName}/`
)

let connectedUsers = []
const chatLogBody = document.querySelector("#chat-log-body")
const connectedUsersContainer = document.querySelector("#connectedUsers")
const messagesCards = document.querySelectorAll(".img-thumbnail.d-inline-flex")

chatSocket.onmessage = function(e) {
    console.log(e)
    let data = JSON.parse(e.data)
    let message_type = data["type"]
    let username

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

            if (username !== "{{ user.username }}") {
                let lastMessageCard = messagesCards[messagesCards.length - 1]
                lastMessageCard.className =
                    "img-thumbnail d-inline-flex bg-light"
            }

            chatLog.scrollTop = chatLog.scrollHeight
            break
        case "user_connected":
        case "user_disconnected":
            connectedUsers = data["connected_users"].split(",")

            connectedUsersContainer.removeChildren()

            connectedUsers.forEach(function(username) {
                connectedUsersContainer.appendChild(userSpan(username))
            })
            break
    }
    if (user !== roomAuthor) {
        switch (message_type) {
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
        }
    }
}
