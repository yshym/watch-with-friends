export const initializeRoomNameChangeForm = () => {
    const roomNameElement = document.getElementById("room-name");
    const roomNameChangeForm = document.getElementById("room-name-change");
    const roomNameChangeButton = document.getElementById(
        "room-name-change-form-show"
    );
    const roomNameChangeCancelButton = document.getElementById(
        "room-name-change-cancel"
    );

    // Change room name
    if (
        roomNameElement &&
        roomNameChangeButton &&
        roomNameChangeCancelButton &&
        roomNameChangeForm
    ) {
        roomNameChangeButton.onclick = (_e) => {
            roomNameElement.className = "";
            roomNameElement.style.display = "none";
            roomNameChangeForm.style.display = "block";
        };

        roomNameChangeCancelButton.onclick = (e) => {
            e.preventDefault();
            roomNameChangeForm.style.display = "none";
            roomNameElement.className = "d-flex";
        };
    }
};
