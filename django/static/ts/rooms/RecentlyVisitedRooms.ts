import Component from "../Component";
import SizedSet from "../SizedSet";

export default class RecentlyVisitedRooms extends Component {
    static maxSize: number = 5;

    constructor(public container: HTMLElement) {
        super();
    }

    static rooms = (n: number): SizedSet<string> => {
        let item = localStorage.getItem("recentlyVisitedLinks");

        if (item !== null && item !== "") {
            return SizedSet.fromJSON(n, item);
        }

        return new SizedSet(n);
    };

    createElement = (): HTMLElement => {
        let linksDiv = document.createElement("div");
        linksDiv.className = "recently-visited-rooms";

        let headingH5 = document.createElement("h5");
        headingH5.className = "font-weight-lighter";

        let headingText = document.createTextNode("Recently visited rooms:");

        headingH5.appendChild(headingText);
        linksDiv.appendChild(headingH5);

        RecentlyVisitedRooms.rooms(RecentlyVisitedRooms.maxSize).set_.forEach(
            (v: string) => {
                let room = JSON.parse(v);

                let linkA = document.createElement("a");
                let linkText = document.createTextNode(room.name);

                linkA.appendChild(linkText);
                linkA.href = room.link;

                linksDiv.appendChild(linkA);
            }
        );

        return linksDiv;
    };

    mount = (): void => {
        if (
            RecentlyVisitedRooms.rooms(RecentlyVisitedRooms.maxSize).set_
                .size == 0
        ) {
            return;
        }

        let splitterHr = document.createElement("hr");

        this.container.appendChild(splitterHr);
        this.container.appendChild(this.createElement());
    };

    static onRoomVisit = (roomName: string, roomLink: string): void => {
        let rooms = RecentlyVisitedRooms.rooms(5);
        let roomString = JSON.stringify({ name: roomName, link: roomLink });
        if (rooms.prepend(roomString)) {
            localStorage.setItem("recentlyVisitedLinks", rooms.toJSON());
        }
    };
}
