import AlertMessage from "./AlertMessage"


// Check if variables are correctly initialized using DTL
[
    roomNames,
];

const roomNameInput = document.getElementById("room-name-input")
const roomNameSubmitButton = document.getElementById("room-name-submit")
const container = document.getElementsByClassName("container-xl")[0]

roomNameInput.focus()
roomNameInput.onkeyup = function(e) {
    if (e.keyCode === 13) {
        roomNameSubmitButton.click()
    }
}

roomNameSubmitButton.onclick = function(_e) {
    let roomName = roomNameInput.value
    if (roomName !== "") {
        if (roomName in roomNames) {
            window.location.pathname = `/${roomNames[roomName]}/`
        } else {
            let alertMessage = new AlertMessage(
                container,
                "Room with this name does not exist!",
                "warning",
            )
            alertMessage.post()
        }
    }
}
