export default class ChatMessage
    constructor: (container, username, content, currentUser) ->
        @container = container
        @username = username
        @content = content
        @lightBackground = currentUser != username
        @timestamp = @formattedCurrentDate()

    createElement: ->
        messageDiv = document.createElement "div"
        messageDiv.className = "chat-message img-thumbnail d-inline-flex"

        messageBodyDiv = document.createElement "div"

        titleP = document.createElement "p"
        titleP.className = "font-weight-bold"

        authorText = document.createTextNode "#{this.username} "

        timestampSpan = document.createElement "span"
        timestampSpan.className = "badge text-muted"

        timestampText = document.createTextNode @timestamp

        contentSpan = document.createElement "span"
        contentText = document.createTextNode @content


        timestampSpan.appendChild timestampText
        contentSpan.appendChild contentText

        titleP.appendChild authorText
        titleP.appendChild timestampSpan

        messageBodyDiv.appendChild titleP
        messageBodyDiv.appendChild contentSpan

        messageDiv.appendChild messageBodyDiv

        messageDiv

    formattedCurrentDate: ->
        current_datetime = new Date()
        pad = (n) => if n < 10 then "0" + n else n

        [
            year,
            month,
            day,
            hours,
            minutes,
        ] = [
            current_datetime.getFullYear(),
            pad(current_datetime.getMonth() + 1),
            pad(current_datetime.getDate()),
            pad(current_datetime.getHours()),
            pad(current_datetime.getMinutes()),
        ]

        "#{day}.#{month}.#{year}, #{hours}:#{minutes}"

    post: ->
        @container.appendChild @createElement()
        @container.appendChild document.createElement "br"
        @container.appendChild document.createElement "br"

        if @lightBackground
            messageCards = document.getElementsByClassName "chat-message"
            lastMessageCard = [].slice.call(messageCards).pop()
            lastMessageCard.className = "chat-message img-thumbnail d-inline-flex bg-light"
