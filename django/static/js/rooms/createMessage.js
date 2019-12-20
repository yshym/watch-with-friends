import newMessageDiv from "./newMessageDiv"


function formattedCurrentDate() {
    let current_datetime = new Date()
    let [
        year,
        month,
        day,
        hours,
        minutes,
    ] = [
        current_datetime.getFullYear(),
        current_datetime.getMonth() + 1,
        current_datetime.getDate(),
        current_datetime.getHours(),
        current_datetime.getMinutes(),
    ]
    return `${day}.${month}.${year}, ${hours}:${minutes}`
}

export default function createMessage(chatLogBody, messagesCards, username, message) {
    let timestamp = formattedCurrentDate()

    chatLogBody.appendChild(newMessageDiv(username, timestamp, message))
    chatLogBody.appendChild(document.createElement("br"))
    chatLogBody.appendChild(document.createElement("br"))

    if (username !== user) {
        let lastMessageCard = messagesCards.slice(-1)[0]
        lastMessageCard.className =
            "img-thumbnail d-inline-flex bg-light"
    }
}
