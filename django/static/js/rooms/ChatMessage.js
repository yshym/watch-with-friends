export default class ChatMessage {
    constructor(container, username, content, currentUser) {
        this.container = container
        this.username = username
        this.content = content
        this.lightBackground = currentUser != username
        this.timestamp = this.formattedCurrentDate()
    }

    createElement() {
        let messageDiv = document.createElement("div")
        messageDiv.className = "chat-message img-thumbnail d-inline-flex"

        let messageBodyDiv = document.createElement("div")

        let titleP = document.createElement("p")
        titleP.className = "font-weight-bold"

        let authorText = document.createTextNode(`${this.username} `)

        let timestampSpan = document.createElement("span")
        timestampSpan.className = "badge text-muted"

        let timestampText = document.createTextNode(this.timestamp)

        let contentSpan = document.createElement("span")
        let contentText = document.createTextNode(this.content)


        timestampSpan.appendChild(timestampText)
        contentSpan.appendChild(contentText)

        titleP.appendChild(authorText)
        titleP.appendChild(timestampSpan)

        messageBodyDiv.appendChild(titleP)
        messageBodyDiv.appendChild(contentSpan)

        messageDiv.appendChild(messageBodyDiv)

        return messageDiv
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
            let messageCards = document.getElementsByClassName("chat-message")
            let lastMessageCard = [].slice.call(messageCards).pop()
            lastMessageCard.className = "chat-message img-thumbnail d-inline-flex bg-light"
        }
    }
}
