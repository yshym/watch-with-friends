export default class AlertMessage {
    constructor(container, text, type) {
        this.container = container
        this.text = text
        this.type = type
    }

    post() {
        const alertElement = document.getElementsByClassName("alert")[0]

        if (!alertElement) {
            let messageDiv = document.createElement("div")
            messageDiv.className = `alert alert-${this.type}`

            let messageText = document.createTextNode(this.text)

            messageDiv.appendChild(messageText)
            this.container.prepend(messageDiv)

            setTimeout(
                () => this.container.removeChild(messageDiv),
                5000
            )
        }
    }

    static removeFrom(container) {
        const alertElement = document.getElementsByClassName("alert")[0]

        if (alertElement !== null) {
            setTimeout(() => container.removeChild(alertElement), 5000)
        }
    }
}
