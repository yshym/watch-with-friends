import {chatSocket} from "./websockets"
import {video} from "./video"
import AlertMessage from "./AlertMessage"
import showVideoField from "./showVideoField"


// Check if variables are correctly initialized using DTL
[
    roomName,
    roomAuthor,
    user,
    videoURL,
];

// Get necessaty DOM elements
const videoElement = document.getElementById("video-active")
const chatLogBody = document.getElementById("chat-log-body")
const messageInput = document.getElementById("chat-message-input")
const messageSubmitButton = document.getElementById("chat-message-submit")
const container = document.getElementsByClassName("container-xl")[0]
const roomNameElement = document.getElementById("room-name")
const roomNameChangeForm = document.getElementById("room-name-change")
const roomNameChangeButton = document.getElementById(
    "room-name-change-form-show"
)
const roomNameChangeCancelButton = document.getElementById(
    "room-name-change-cancel"
)
const videoTypeSelectElement = document.getElementById("id_video_type")
const roomVideoChangeForm = document.getElementById("room-video-change")
const roomVideoChangeButton = document.getElementById(
    "room-video-change-form-show"
)
const roomVideoChangeCancelButton = document.getElementById(
    "room-video-change-cancel"
)

// Remove alert message
AlertMessage.removeFrom(container)

// Scroll down chat log
chatLogBody.scrollTop = chatLogBody.scrollHeight

// Remove all children of the element
HTMLElement.prototype.removeChildren = function() {
    while (this.firstChild) {
        this.removeChild(this.firstChild)
    }
    return this
}

// HTML5 video events for room author
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

// Change state of the yt video player event
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

// Focus chat message input
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

// Show room change forms on button clicks
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
        const hls = new Hls()
        let [videoName, _videoExt] = videoURL.split('.')
        hls.loadSource(`${videoName}.m3u8`)
        hls.attachMedia(videoElement)
    }
}
