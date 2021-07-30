import Component from "../Component";

export default class NotNewUserWarning extends Component {
    constructor(public container: HTMLElement, public text: string) {
        super();
    }

    createElement = (): HTMLElement => {
        let warningH1 = document.createElement("h1");

        let surpriseIcon = document.createElement("i");
        surpriseIcon.className = "far fa-surprise";

        let warningText = document.createTextNode(" " + this.text);

        warningH1.appendChild(surpriseIcon);
        warningH1.appendChild(warningText);

        return warningH1;
    };

    mount = (): void => {
        this.container.removeChildren();
        this.container.appendChild(this.createElement());
    };
}
