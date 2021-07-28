import Component from "./Component";

export default class AlertMessage extends Component {
    constructor(
        public container: HTMLElement,
        public text: string,
        public type_: string
    ) {
        super();
    }

    createElement = (): HTMLElement => {
        let messageDiv = document.createElement("div");
        messageDiv.className = `alert alert-${this.type_}`;

        let messageText = document.createTextNode(this.text);

        messageDiv.appendChild(messageText);

        return messageDiv;
    };

    mount = (): void => {
        const alertElement = document.getElementsByClassName("alert")[0];

        if (alertElement === undefined) {
            const messageDiv = this.createElement();
            this.container.prepend(messageDiv);
            setTimeout(() => this.container.removeChild(messageDiv), 5000);
        }
    };

    static removeFrom = (container: HTMLElement): void => {
        const alertElement = document.getElementsByClassName("alert")[0];

        if (alertElement) {
            setTimeout(() => container.removeChild(alertElement), 5000);
        }
    };
}
