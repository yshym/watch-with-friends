import RecentlyVisitedRooms from "./RecentlyVisitedRooms";

const container = <HTMLElement>(
    document.getElementsByClassName("container-xl")[0]
);

let recentlyVisitedRooms = new RecentlyVisitedRooms(container);
recentlyVisitedRooms.mount();
