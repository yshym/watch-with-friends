import {chatSocket} from "./websockets"
import {video} from "./video"
import {removeAlertMessage} from "./alertMessages"


// Check if variables are correctly initialized using DTL
[
    roomName,
    roomAuthor,
    user,
];

// Get necessaty DOM elements
const chatLog = document.querySelector("#chat-log")
const messageInput = document.querySelector("#chat-message-input")
const messageSubmitButton = document.querySelector("#chat-message-submit")
const container = document.querySelector(".container-xl")

removeAlertMessage(container)

chatLog.scrollTop = chatLog.scrollHeight

HTMLElement.prototype.removeChildren = function() {
    while (this.firstChild) {
        this.removeChild(this.firstChild)
    }
    return this
}

// html5 video events for room author
if (roomAuthor === user) {
    video.on("pause", function(_e) {
        chatSocket.send(
            JSON.stringify({
                type: "pause_video",
            })
        )
    })

    video.on("play", function(_e) {
        chatSocket.send(
            JSON.stringify({
                type: "play_video",
            })
        )
    })

    video.on("seeked", function(_e) {
        chatSocket.send(JSON.stringify({
            'type': 'seeked_video',
            'currentTime': video.currentTime,
        }));
    });
}

chatSocket.onclose = function(_e) {
    console.error("Chat socket closed unexpectedly")
}

messageInput.focus()
messageInput.onkeyup = function(e) {
    if (e.keyCode === 13) {
        // enter, return
        messageSubmitButton.click()
    }
}

messageSubmitButton.onclick = function(_e) {
    if (messageInput.value.trim() != "") {
        let message = messageInput.value

        chatSocket.send(
            JSON.stringify({
                type: "message",
                room_name: roomName,
                username: user,
                message: message,
            })
        )

        messageInput.value = ""
    }
}
