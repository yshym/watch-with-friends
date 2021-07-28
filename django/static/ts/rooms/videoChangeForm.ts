import showVideoField from "./showVideoField";

export const initializeVideoChangeForm = () => {
    const videoTypeSelectElement = document.getElementById("id_video_type");
    const roomVideoChangeForm = document.getElementById("room-video-change");
    const roomVideoChangeButton = document.getElementById(
        "room-video-change-form-show"
    );
    const roomVideoChangeCancelButton = document.getElementById(
        "room-video-change-cancel"
    );

    // Change room video
    if (
        videoTypeSelectElement &&
        roomVideoChangeButton &&
        roomVideoChangeCancelButton &&
        roomVideoChangeForm
    ) {
        showVideoField();
        videoTypeSelectElement.onchange = showVideoField;

        roomVideoChangeButton.onclick = function (_e) {
            (this as any).style.display = "none";
            roomVideoChangeForm.style.display = "block";
        };

        roomVideoChangeCancelButton.onclick = (e) => {
            e.preventDefault();
            roomVideoChangeForm.style.display = "none";
            roomVideoChangeButton.style.display = "block";
        };
    }
};
