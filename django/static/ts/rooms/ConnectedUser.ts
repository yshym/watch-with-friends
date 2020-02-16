export default class ConnectedUser {
    constructor(public username: string, public roomAuthorUsername: string) {}

    createElement(): HTMLElement {
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
    }

    addToContainer(container: HTMLElement) {
        container.appendChild(this.createElement())
    }
}
