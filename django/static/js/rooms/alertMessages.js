export function createAlertMessage(container, text, type) {
    const alert = document.querySelector(".alert")

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

// Remove alert if exist
export function removeAlertMessage(container) {
    const alert = document.querySelector(".alert")

    if (alert !== null) {
        setTimeout(() => container.removeChild(alert), 5000)
    }
}
