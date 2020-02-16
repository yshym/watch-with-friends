export default class AlertMessage {
    constructor(
        public container: HTMLElement,
        public text: string,
        public type_: string
    ) {}

    post() {
        let alertElement = document.getElementsByClassName("alert")[0];

        if (alertElement != null) {
            let messageDiv = document.createElement("div");
            messageDiv.className = `alert alert-${this.type}`;

            let messageText = document.createTextNode(this.text);

            messageDiv.appendChild(messageText);
            this.container.prepend(messageDiv);

            setTimeout(() => this.container.removeChild(messageDiv), 5000);
        }
    }

    removeFrom(container: HTMLElement) {
        let alertElement = document.getElementsByClassName("alert")[0];

        if (alertElement) {
            setTimeout(() => container.removeChild(alertElement), 5000);
        }
    }
}
