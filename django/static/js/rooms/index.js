import slugify from "./slugify"
import createAlertMessage from "./createAlertMessage"


const roomNameInput = document.querySelector("#room-name-input")
const roomNameSubmitButton = document.querySelector("#room-name-submit")

roomNameInput.focus()
roomNameInput.onkeyup = function(e) {
    if (e.keyCode === 13) {
        roomNameSubmitButton.click()
    }
}

roomNameSubmitButton.onclick = function(e) {
    let roomName = roomNameInput.value
    if (roomName != "") {
        console.log(roomNames)
        if (roomNames.includes(roomName)) {
            window.location.pathname = `/${slugify(roomName)}/`
        } else {
            createAlertMessage("Room with this name does not exist!", "warning")
        }
    }
}
