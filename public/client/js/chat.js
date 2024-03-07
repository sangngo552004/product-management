import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    const inputContent = formSendData.querySelector("input[name='content']");
    formSendData.addEventListener("submit", (event) => {
        event.preventDefault();
        const content = inputContent.value;
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            inputContent.value = "";
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    })

}
//END CLIENT_SEND_MESSAGE

//SEVER_SEND_MESSAGE
socket.on("SEVER_SEND_MESSAGE", (data) => {
    const body = document.querySelector(".chat .inner-body");
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const elementListTyping = body.querySelector(".inner-list-typing");

    const div = document.createElement("div");
    let htmlFullName = "";

    if (myId != data.userId) {
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    }
    else {
        div.classList.add("inner-outgoing");
    }

    div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `
    body.insertBefore(div, elementListTyping);
    body.scrollTop = body.scrollHeight;

});
//END SEVER_SEND_MESSAGE

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll Chat To Bottom

//emoji-picker
const buttonIcon = document.querySelector(".button-icon");

if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)
    
    //show tooltip
    buttonIcon.addEventListener("click", () => {
        tooltip.classList.toggle("shown");
    })
    //insert icon vào input
    const inputContent = document.querySelector(".chat .inner-form input[name='content']");
    const emojiPicker = document.querySelector("emoji-picker");

    emojiPicker.addEventListener("emoji-click", event => {
        inputContent.value = inputContent.value + event.detail.unicode;
    });
    //Show typing
    var timeOut;
    inputContent.addEventListener("keyup", () => {
        socket.emit("CLIENT_SEND_TYPING", "show");

        clearTimeout(timeOut);

        timeOut = setTimeout(() => {
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }, 3000);
    })
}

//end emoji-picker

//SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-body .inner-list-typing");

socket.on("SERVER_RETURN_TYPING", (data) => {
    if(data.type == "show") {
        const existTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);

        if(!existTyping) {
            const typingElement = document.createElement("div");
            typingElement.classList.add("box-typing");
            typingElement.setAttribute("user-id",data.userId);
            typingElement.innerHTML = `
                <div class="inner-name">${data.fullName}</div>
                <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
          `;
            elementListTyping.appendChild(typingElement);
        }
    }
    else {
        const removeTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);

        if(removeTyping) {
            elementListTyping.removeChild(removeTyping);
        }
    }
    
    
})
//END SEVER_RETURN_TYPING