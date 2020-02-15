import {video} from "./video"
import ChatMessage from "./ChatMessage"
import ConnectedUser from "./ConnectedUser"


# Initialize WebSocket
export roomSocket = new WebSocket(
    "ws://#{window.location.host}/ws/chat/#{roomName}/"
)

container = document.getElementsByClassName("container-xl")[0]
chatLogBody = document.getElementById "chat-log-body"
connectedUsersContainer = document.getElementById "connectedUsers"

roomSocket.onmessage = (e) ->
    console.log e
    data = JSON.parse e.data
    message_type = data.type

    # Messages for all users
    switch message_type
        when "message"
            username = data.username
            content = data.message
            message = new ChatMessage chatLogBody, username, content, user

            message.post()

            chatLogBody.scrollTop = chatLogBody.scrollHeight
        when "user_connected", "user_disconnected"
            connectedUsersUsernames = connectedUsersContainer.textContent.trim().split(" ")

            usernameData = data.username
            isNewUserData = data.is_new_user
            connectedUsersDataSet = new Set(data.connected_users.split(","))

            if isNewUserData
                connectedUsersContainer.removeChildren()

                connectedUsersDataSet.forEach (username) ->
                    connectedUser = new ConnectedUser username
                    connectedUser.addToContainer connectedUsersContainer
            else
                container.removeChildren()

                warningH1 = document.createElement "h1"
                warningText = document.createTextNode "You are already in this room from the other tab/browser"

                warningH1.appendChild warningText

                container.appendChild warningH1

        when "buffering_video"
            video.pause()
        when "all_players_buffered"
            video.play()
    # Messages for all users, except the room creator
    if user != roomAuthor
        switch message_type
            when "seeked_video"
                video.currentTime = data.current_time
            when "pause_video"
                video.pause()
            when "play_video"
                video.play()
