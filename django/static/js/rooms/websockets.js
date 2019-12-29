import {video} from "./video"
import ChatMessage from "./ChatMessage"
import ConnectedUser from "./ConnectedUser"


// Initialize WebSocket
export const chatSocket = new WebSocket(
    `ws://${window.location.host}/ws/chat/${roomName}/`
)

let connectedUsers = []
const chatLogBody = document.getElementById("chat-log-body")
const connectedUsersContainer = document.getElementById("connectedUsers")

chatSocket.onmessage = function(e) {
    console.log(e)
    let data = JSON.parse(e.data)
    let message_type = data["type"]

    // Messages for all users
    switch (message_type) {
        case "message":
            let username = data["username"]
            let content = data["message"]
            let message = new ChatMessage(chatLogBody, username, content, user)

            message.post()

            chatLogBody.scrollTop = chatLogBody.scrollHeight
            break
        case "user_connected":
        case "user_disconnected":
            connectedUsers = data["connected_users"].split(",")

            connectedUsersContainer.removeChildren()

            connectedUsers.forEach(function(username) {
                let connectedUser = new ConnectedUser(username)
                connectedUser.addToContainer(connectedUsersContainer)
            })
            break
        case "buffering_video":
            video.pause()
            break
        case "all_players_buffered":
            video.play()
            break
    }
    // Messages for all users, except the room creator
    if (user !== roomAuthor) {
        switch (message_type) {
            case "seeked_video":
                let currentTimeData = data["current_time"]
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
