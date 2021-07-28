import Component from "./Component";

export default class ConnectedUser extends Component {
    constructor(
        public container: HTMLElement,
        public username: string,
        public roomAuthorUsername: string
    ) {
        super();
    }

    createElement = (): HTMLElement => {
        let spanWrapper = document.createElement("span");
        let userIcon = document.createElement("i");

        if (this.username != this.roomAuthorUsername) {
            spanWrapper.className = "img-thumbnail bg-info";
            userIcon.className = "fa fa-user";
        } else {
            spanWrapper.className = "img-thumbnail bg-warning";
            userIcon.className = "fa fa-user-cog";
        }

        let usernameText = document.createTextNode(` ${this.username}`);
        spanWrapper.appendChild(userIcon);
        spanWrapper.appendChild(usernameText);

        return spanWrapper;
    };

    mount = (): void => {
        this.container.appendChild(this.createElement());
    };
}
