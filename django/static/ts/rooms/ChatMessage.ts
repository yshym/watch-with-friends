export default class ChatMessage {
    lightBackground: boolean;
    timestamp: string;

    constructor(
        public container: HTMLElement,
        public username: string,
        public content: string,
        currentUserUsername: string
    ) {
        this.lightBackground = currentUserUsername != username;
        this.timestamp = this.formattedCurrentDate();
    }

    createElement(): HTMLElement {
        let messageDiv = document.createElement("div");
        messageDiv.className = "chat-message img-thumbnail d-inline-flex";

        let messageBodyDiv = document.createElement("div");

        let titleP = document.createElement("p");
        titleP.className = "font-weight-bold";

        let authorText = document.createTextNode(`${this.username} `);

        let timestampSpan = document.createElement("span");
        timestampSpan.className = "badge text-muted";

        let timestampText = document.createTextNode(this.timestamp);

        let contentSpan = document.createElement("span");
        let contentText = document.createTextNode(this.content);

        timestampSpan.appendChild(timestampText);
        contentSpan.appendChild(contentText);

        titleP.appendChild(authorText);
        titleP.appendChild(timestampSpan);

        messageBodyDiv.appendChild(titleP);
        messageBodyDiv.appendChild(contentSpan);

        messageDiv.appendChild(messageBodyDiv);

        return messageDiv;
    }

    formattedCurrentDate(): string {
        let now = new Date();
        let pad = (n: number): string => (n < 10 ? "0" + n : n.toString());

        let [year, month, day, hours, minutes] = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
            pad(now.getHours()),
            pad(now.getMinutes()),
        ];

        return `${day}.${month}.${year}, ${hours}:${minutes}`;
    }

    post(): void {
        this.container.appendChild(this.createElement());
        this.container.appendChild(document.createElement("br"));
        this.container.appendChild(document.createElement("br"));

        if (this.lightBackground) {
            let messageCards = document.getElementsByClassName("chat-message");
            let lastMessageCard = [].slice.call(messageCards).pop();
            lastMessageCard.className =
                "chat-message img-thumbnail d-inline-flex bg-light";
        }
    }
}
