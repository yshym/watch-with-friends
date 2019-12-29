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
const videoElement = document.querySelector("#video-active")
const chatLogBody = document.querySelector("#chat-log-body")
const messageInput = document.querySelector("#chat-message-input")
const messageSubmitButton = document.querySelector("#chat-message-submit")
const container = document.querySelector(".container-xl")
const roomNameElement = document.querySelector("div#room-name")
const roomNameChangeForm = document.querySelector("form#room-name-change")
const roomNameChangeButton = document.querySelector(
    "h3#room-name-change-form-show"
)
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

    video.on("seeked", function(_e) {
        chatSocket.send(JSON.stringify({
            'type': 'seeked_video',
            'currentTime': video.currentTime,
        }))
    })
}

video.on("statechange", function(e) {
    let code = e.detail.code

    if (code == 3) {
        chatSocket.send(JSON.stringify({
            'type': 'buffering_video',
        }));
    } else {
        chatSocket.send(JSON.stringify({
            'type': 'buffered_video',
        }));
    }
})

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
    // Change room name
    roomNameChangeButton.onclick = function(_e) {
        roomNameElement.className = ""
        roomNameElement.style.display = "none"
        roomNameChangeForm.style.display = "block"
    }

    roomNameChangeCancelButton.onclick = function(e) {
        e.preventDefault()
        roomNameChangeForm.style.display = "none"
        roomNameElement.className = "d-flex"
    }

    // Change room video
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
}

if (videoElement) {
    if(Hls.isSupported()) {
        var hls = new Hls()
        hls.loadSource(videoURL)
        hls.attachMedia(videoElement)
    }
}
