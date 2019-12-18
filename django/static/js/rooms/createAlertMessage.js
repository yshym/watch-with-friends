export default function createAlertMessage(text, type) {
    const alert = document.querySelector(".alert")
    const container = document.querySelector(".container-xl")

    if (alert === null) {
        let messageDiv = document.createElement("div")
        messageDiv.className = `alert alert-${type}`
        let messageText = document.createTextNode(text)
        messageDiv.appendChild(messageText)
        container.prepend(messageDiv)
        setTimeout(
            () => container.removeChild(alert),
            5000
        )
    }
}
