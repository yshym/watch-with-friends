export default class ChatMessage {
    constructor(container, username, content, currentUser) {
        this.container = container
        this.username = username
        this.content = content
        this.lightBackground = currentUser != username
        this.timestamp = this.formattedCurrentDate()
    }

    createElement() {
        let cardDiv = document.createElement("div")
        cardDiv.className = "img-thumbnail d-inline-flex"
        cardDiv.id = "message-div"
        cardDiv.style = "max-width: 55vw;"

        let cardBodyDiv = document.createElement("div")

        let authorP = document.createElement("p")
        authorP.className = "font-weight-bold"
        let authorText = document.createTextNode(`${this.username} `)
        authorP.appendChild(authorText)

        let timestampSpan = document.createElement("span")
        timestampSpan.className = "badge text-muted"
        let timestampText = document.createTextNode(this.timestamp)
        timestampSpan.appendChild(timestampText)

        let contentP = document.createElement("span")
        let contentText = document.createTextNode(this.content)
        contentP.appendChild(contentText)

        authorP.appendChild(timestampSpan)
        cardBodyDiv.appendChild(authorP)
        cardBodyDiv.appendChild(contentP)
        cardDiv.appendChild(cardBodyDiv)

        return cardDiv
    }

    formattedCurrentDate() {
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

    post() {
        this.container.appendChild(this.createElement())
        this.container.appendChild(document.createElement("br"))
        this.container.appendChild(document.createElement("br"))

        if (this.lightBackground) {
            let messageCards = document.querySelectorAll("#message-div")
            let lastMessageCard = [].slice.call(messageCards).pop()
            lastMessageCard.className = "img-thumbnail d-inline-flex bg-light"
        }
    }
}
