import Hls from "hls.js";

import { getElementTextContent } from "./documentTools";
import { RoomSocket } from "./websockets";
import { initializeVideo } from "./video";
import AlertMessage from "./AlertMessage";
import showVideoField from "./showVideoField";

// Check if variables are correctly initialized using DTL
const [roomName, roomAuthor, user, videoURL] = [
    getElementTextContent("roomName") || "",
    getElementTextContent("roomAuthorUsername") || "",
    getElementTextContent("currentUserUsername") || "",
    getElementTextContent("videoURL") || "",
];

// Get necessary DOM elements
const videoDiv = document.getElementById("video-player");
const videoElement = document.getElementById("video-active");
const chatLogBody = document.getElementById("chat-log-body");
const messageInput = <HTMLInputElement>(
    document.getElementById("chat-message-input")
);
const messageSubmitButton = document.getElementById("chat-message-submit");
const container = <HTMLElement>(
    document.getElementsByClassName("container-xl")[0]
);
const roomNameElement = document.getElementById("room-name");
const roomNameChangeForm = document.getElementById("room-name-change");
const roomNameChangeButton = document.getElementById(
    "room-name-change-form-show"
);
const roomNameChangeCancelButton = document.getElementById(
    "room-name-change-cancel"
);
const videoTypeSelectElement = document.getElementById("id_video_type");
const roomVideoChangeForm = document.getElementById("room-video-change");
const roomVideoChangeButton = document.getElementById(
    "room-video-change-form-show"
);
const roomVideoChangeCancelButton = document.getElementById(
    "room-video-change-cancel"
);
const videoSpinner = document.getElementById("video-spinner");
const copyURLButton = document.getElementById("copy-url");

// Remove alert message
AlertMessage.removeFrom(container);

// Scroll down chat log
if (chatLogBody) {
    chatLogBody.scrollTop = chatLogBody.scrollHeight;
}

// Remove all children of the element
declare global {
    interface HTMLElement {
        removeChildren(): HTMLElement;
    }
}
HTMLElement.prototype.removeChildren = function (): HTMLElement {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }

    return this;
};

if (copyURLButton) {
    copyURLButton.onclick = (_e) => {
        navigator.clipboard.writeText(window.location.href);
        let alertMessage = new AlertMessage(
            container,
            "Current URL was copied to the clipboard",
            "success"
        );
        alertMessage.post();
    };
}
// Initialize video player
const video = initializeVideo();
// Initialize room websocket
const roomSocket = new RoomSocket(roomName, roomAuthor, user, video, videoURL);

// Focus chat message input
if (messageSubmitButton) {
    messageInput.focus();
    messageInput.onkeyup = (e) => {
        if (e.keyCode === 13) {
            // enter, return
            messageSubmitButton.click();
        }
    };

    messageSubmitButton.onclick = (_e) => {
        if (messageInput.value.trim() !== "") {
            let message = messageInput.value;

            roomSocket.socket.send(
                JSON.stringify({
                    type: "message",
                    room_name: roomName,
                    username: user,
                    message: message,
                })
            );

            messageInput.value = "";
        }
    };
}

// Show room change forms on button clicks
if (roomAuthor === user) {
    // Change room name
    if (
        roomNameElement &&
        roomNameChangeButton &&
        roomNameChangeCancelButton &&
        roomNameChangeForm
    ) {
        roomNameChangeButton.onclick = (_e) => {
            roomNameElement.className = "";
            roomNameElement.style.display = "none";
            roomNameChangeForm.style.display = "block";
        };

        roomNameChangeCancelButton.onclick = (e) => {
            e.preventDefault();
            roomNameChangeForm.style.display = "none";
            roomNameElement.className = "d-flex";
        };
    }

    // Change room video
    if (
        videoTypeSelectElement &&
        roomVideoChangeButton &&
        roomVideoChangeCancelButton &&
        roomVideoChangeForm
    ) {
        showVideoField();
        videoTypeSelectElement.onchange = showVideoField;

        roomVideoChangeButton.onclick = function (_e) {
            (this as any).style.display = "none";
            roomVideoChangeForm.style.display = "block";
        };

        roomVideoChangeCancelButton.onclick = (e) => {
            e.preventDefault();
            roomVideoChangeForm.style.display = "none";
            roomVideoChangeButton.style.display = "block";
        };
    }
}

// Load m3u8 file into player
function initializeVideoElements() {
    if (videoDiv && videoSpinner) {
        videoSpinner.style.display = "none";
        videoDiv.style.display = "block";
        if (roomVideoChangeButton) {
            roomVideoChangeButton.style.display = "block";
        }
    }
}

if (videoURL && Hls.isSupported()) {
    let hls = new Hls();
    let HLSFileWaiter = new Worker("/static/bundles/HLSFileWaiter.js");

    let videoName = videoURL.split(".")[0];
    HLSFileWaiter.addEventListener("message", (_e) => {
        hls.loadSource(`${videoName}.m3u8`);
        videoElement && hls.attachMedia(<HTMLVideoElement>videoElement);

        initializeVideoElements();
    });

    HLSFileWaiter.postMessage({ videoName });
} else {
    initializeVideoElements();
}
