// Add new message to the DOM
export default function newMessageDiv(username, timestamp, message) {
    let cardDiv = document.createElement("div")
    cardDiv.className = "img-thumbnail d-inline-flex"
    cardDiv.style = "max-width: 55vw;"

    let cardBodyDiv = document.createElement("div")

    let authorP = document.createElement("p")
    authorP.className = "font-weight-bold"
    let authorText = document.createTextNode(username)
    authorP.appendChild(authorText)

    let timestampSpan = document.createElement("span")
    timestampSpan.className = "badge text-muted"
    let timestampText = document.createTextNode(timestamp)
    timestampSpan.appendChild(timestampText)

    let contentP = document.createElement("span")
    let contentText = document.createTextNode(message)
    contentP.appendChild(contentText)

    authorP.appendChild(timestampSpan)
    cardBodyDiv.appendChild(authorP)
    cardBodyDiv.appendChild(contentP)
    cardDiv.appendChild(cardBodyDiv)

    return cardDiv
}
