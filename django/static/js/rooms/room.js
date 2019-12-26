import {chatSocket} from "./websockets"
import {video} from "./video"
import AlertMessage from "./AlertMessage"
import showVideoField from "./showVideoField"


// Check if variables are correctly initialized using DTL
[
    roomName,
    roomAuthor,
    user,
];

// Get necessaty DOM elements
const chatLogBody = document.querySelector("#chat-log-body")
const messageInput = document.querySelector("#chat-message-input")
const messageSubmitButton = document.querySelector("#chat-message-submit")
const container = document.querySelector(".container-xl")
const roomNameElement = document.querySelector("h3#room-name")
const roomNameChangeForm = document.querySelector("form#room-name-change")
const roomNameChangeCancelButton = document.querySelector(
    "button#room-name-change-cancel"
)
const videoTypeSelectElement = document.querySelector("#id_video_type")
const roomVideoChangeForm = document.querySelector("form#room-video-change")
const roomVideoChangeButton = document.querySelector(
    "button#room-video-change-form-show"
)
const roomVideoChangeCancelButton = document.querySelector(
    "button#room-video-change-cancel"
)

AlertMessage.removeFrom(container)

chatLogBody.scrollTop = chatLogBody.scrollHeight

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

    // FIXME Fix synchronized video seeking while wathing local video
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
    if (messageInput.value.trim() !== "") {
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

if (roomAuthor === user) {
    roomNameElement.onclick = function(_e) {
        this.style.display = "none"
        roomNameChangeForm.style.display = "block"
    }

    roomNameChangeCancelButton.onclick = function(e) {
        e.preventDefault()
        roomNameChangeForm.style.display = "none"
        roomNameElement.style.display = "block"
    }
}


showVideoField()
videoTypeSelectElement.onchange = showVideoField
roomVideoChangeButton.onclick = function(_e) {
    this.style.display = "none"
    roomVideoChangeForm.style.display = "block"
}
roomVideoChangeCancelButton.onclick = function(e) {
    e.preventDefault()
    roomVideoChangeForm.style.display = "none"
    roomVideoChangeButton.style.display = "block"
}
