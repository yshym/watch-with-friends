import {chatSocket} from "./websockets"
import {video} from "./video"
import AlertMessage from "./AlertMessage"
import showVideoField from "./showVideoField"


# Check if variables are correctly initialized using DTL
unless roomName? or roomAuthor? or user? or videoURL?
    throw "DTL varaibles are not initialized correctly!"

# Get necessary DOM elements
videoElement = document.getElementById "video-active"
chatLogBody = document.getElementById "chat-log-body"
messageInput = document.getElementById "chat-message-input"
messageSubmitButton = document.getElementById "chat-message-submit"
container = document.getElementsByClassName("container-xl")[0]
roomNameElement = document.getElementById "room-name"
roomNameChangeForm = document.getElementById "room-name-change"
roomNameChangeButton = document.getElementById(
    "room-name-change-form-show"
)
roomNameChangeCancelButton = document.getElementById(
    "room-name-change-cancel"
)
videoTypeSelectElement = document.getElementById "id_video_type"
roomVideoChangeForm = document.getElementById "room-video-change"
roomVideoChangeButton = document.getElementById(
    "room-video-change-form-show"
)
roomVideoChangeCancelButton = document.getElementById(
    "room-video-change-cancel"
)

# Remove alert message
AlertMessage.removeFrom container

# Scroll down chat log
chatLogBody.scrollTop = chatLogBody.scrollHeight

# Remove all children of the element
HTMLElement::removeChildren = ->
    while @firstChild 
        @removeChild @firstChild
       
    this

# HTML5 video events for room author
if roomAuthor == user
    video.on "pause", (_e) ->
        chatSocket.send JSON.stringify type: "pause_video"

    video.on "play", (_e) ->
        chatSocket.send JSON.stringify type: "play_video"

    video.on "seeked", (_e) ->
        chatSocket.send JSON.stringify({
            type: "seeked_video",
            currentTime: video.currentTime,
        })

# Change state of the yt video player event
video.on "statechange", (e) ->
    if e.detail.code == 3
        chatSocket.send JSON.stringify type: "buffering_video"
    else
        chatSocket.send JSON.stringify type: "buffered_video"

chatSocket.onclose = (_e) ->
    console.error "Chat socket closed unexpectedly"

# Focus chat message input
messageInput.focus()
messageInput.onkeyup = (e) ->
    if e.keyCode == 13
        # enter, return
        messageSubmitButton.click()


messageSubmitButton.onclick = (_e) ->
    if messageInput.value.trim() != ""
        message = messageInput.value

        chatSocket.send JSON.stringify({
                type: "message",
                room_name: roomName,
                username: user,
                message: message,
            })

        messageInput.value = ""

# Show room change forms on button clicks
if roomAuthor == user
    # Change room name
    roomNameChangeButton.onclick = (_e) ->
        roomNameElement.className = ""
        roomNameElement.style.display = "none"
        roomNameChangeForm.style.display = "block"

    roomNameChangeCancelButton.onclick = (e) ->
        e.preventDefault()
        roomNameChangeForm.style.display = "none"
        roomNameElement.className = "d-flex"

    # Change room video
    showVideoField()
    videoTypeSelectElement.onchange = showVideoField

    roomVideoChangeButton.onclick = (_e) ->
        this.style.display = "none"
        roomVideoChangeForm.style.display = "block"

    roomVideoChangeCancelButton.onclick = (e) ->
        e.preventDefault()
        roomVideoChangeForm.style.display = "none"
        roomVideoChangeButton.style.display = "block"

URLExists = (url) ->
    http = new XMLHttpRequest()
    http.open "HEAD", url, false
    http.send()
    http.status != 404

# Wait for m3u8 file
Hls::waitForHLSFile = (url) ->
    if URLExists url
        @loadSource url
    else
        setTimeout @waitForHLSFile(url), 1000

# Load m3u8 file into player
if videoURL
    if Hls.isSupported()
        hls = new Hls()
        [videoName, _videoExt] = videoURL.split "."
        hls.waitForHLSFile "#{videoName}.m3u8"
        hls.attachMedia videoElement
