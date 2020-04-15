export default class AlertMessage {
    constructor(
        public container: HTMLElement,
        public text: string,
        public type_: string
    ) {}

    post(): void {
        let alertElement = document.getElementsByClassName("alert")[0];

        if (alertElement === undefined) {
            console.log(123);
            let messageDiv = document.createElement("div");
            messageDiv.className = `alert alert-${this.type_}`;

            let messageText = document.createTextNode(this.text);

            messageDiv.appendChild(messageText);
            this.container.prepend(messageDiv);

            setTimeout(() => this.container.removeChild(messageDiv), 5000);
        }
    }

    static removeFrom(container: HTMLElement): void {
        let alertElement = document.getElementsByClassName("alert")[0];

        if (alertElement) {
            setTimeout(() => container.removeChild(alertElement), 5000);
        }
    }
}
