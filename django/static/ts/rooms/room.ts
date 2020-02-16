import {roomSocket} from "./websockets"
import {video} from "./video"
import AlertMessage from "./AlertMessage"
import showVideoField from "./showVideoField"


// Check if variables are correctly initialized using DTL
[
    roomName,
    roomAuthor,
    user,
    videoURL,
]

// Get necessary DOM elements
const videoDiv = document.getElementById("video-player")
const videoElement = document.getElementById("video-active")
const chatLogBody = document.getElementById("chat-log-body")
const messageInput = document.getElementById("chat-message-input")
const messageSubmitButton = document.getElementById("chat-message-submit")
const constcontainer = document.getElementsByClassName("container-xl")[0]
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
const videoSpinner = document.getElementById("video-spinner")

// Remove alert message
AlertMessage.removeFrom(container)

// Scroll down chat log
chatLogBody.scrollTop = chatLogBody.scrollHeight

// Remove all children of the element
HTMLElement.prototype.removeChildren = () => {
    while (this.firstChild) {
        this.removeChild(this.firstChild)
    }

    return this
}

// HTML5 video events for room author
if (roomAuthor == user) {
    video.on("pause", (_e) => roomSocket.send(JSON.stringify({type: "pause_video"})))

    video.on("play", (_e) => roomSocket.send(JSON.stringify({type: "play_video"})))

    video.on("seeked", (_e) => {
        roomSocket.send(JSON.stringify({
            type: "seeked_video",
            currentTime: video.currentTime,
        }))
        if (videoURL) {
            video.pause()
            setTimeout(
                () => video.play(),
                1000
            )
        }
    })
}

// Change state of the yt video player event
video.on("statechange", (e) => {
    if (e.detail.code == 3) {
        roomSocket.send(JSON.stringify({type: "buffering_video"}))
    } else {
        roomSocket.send(JSON.stringify({type: "buffered_video"}))
    }
});

roomSocket.onclose = (_e) => console.error("Chat socket closed unexpectedly")

// Focus chat message input
messageInput.focus()
messageInput.onkeyup = (e) => {
    if (e.keyCode == 13) {
        // enter, return
        messageSubmitButton.click()
    }
}


messageSubmitButton.onclick = (_e) => {
    if (messageInput.value.trim() != "") {
        let message = messageInput.value

        roomSocket.send(JSON.stringify({
                type: "message",
                room_name: roomName,
                username: user,
                message: message,
        }))

        messageInput.value = ""
    }
}

// Show room change forms on button clicks
if (roomAuthor == user) {
    // Change room name
    roomNameChangeButton.onclick = (_e) => {
        roomNameElement.className = ""
        roomNameElement.style.display = "none"
        roomNameChangeForm.style.display = "block"
    }

    roomNameChangeCancelButton.onclick = (e) => {
        e.preventDefault()
        roomNameChangeForm.style.display = "none"
        roomNameElement.className = "d-flex"
    }

    // Change room video
    showVideoField()
    videoTypeSelectElement.onchange = showVideoField

    roomVideoChangeButton.onclick = (_e) => {
        this.style.display = "none"
        roomVideoChangeForm.style.display = "block"
    }

    roomVideoChangeCancelButton.onclick = (e) => {
        e.preventDefault()
        roomVideoChangeForm.style.display = "none"
        roomVideoChangeButton.style.display = "block"
    }
}

// Load m3u8 file into player
if (videoURL && Hls.isSupported()) {
    let hls = new Hls()
    let HLSFileWaiter = new Worker("/static/bundles/HLSFileWaiter.js")

    let [videoName, _videoExt] = videoURL.split(".")
    HLSFileWaiter.addEventListener("message", (_e) => {
        hls.loadSource("${videoName}.m3u8")
        hls.attachMedia(videoElement)

        videoSpinner.style.display = "none"
        videoDiv.style.display = "block"
        roomVideoChangeButton.style.display = "block"
    })


    HLSFileWaiter.postMessage({ videoName })
} else {
    videoSpinner.style.display = "none"
    videoDiv.style.display = "block"
    roomVideoChangeButton.style.display = "block"
}
