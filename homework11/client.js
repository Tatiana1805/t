const chat = document.querySelector('.messages')
const inputMessag = document.querySelector('.inputMessag')
const form = document.querySelector('.form')
// const userName = document.querySelector('.inputUserName')
let userName = prompt('Введите ваше имя')


//Соединение клиента к серверу
const socket = new WebSocket('ws://localhost:8080')

socket.onopen = (e) => {
    console.log('Соединение прошло успешно')
}

//отображение информации при подключении нового клиента
socket.onmessage = (e) => {
    console.log ('Получено сообщение: ', e.data);
    const message = JSON.parse(e.data);
    const messageEl = document.createElement('div');

    if(message.type === 'system') {
        messageEl.classList.add('system-message')
        messageEl.textContent = message.content;

    } else {
    messageEl.textContent = message.username + ': ' + message.content;
    }
    chat.appendChild(messageEl);

    //чат скролится вниз при новых сообщениях
    chat.scrollTop = chat.scrollHeight;
}

//Закрытие соединения
socket.onclose = (ev) => {
    if(ev.wasClean) {
        console.log(`Соединение закрыто без ошибок ${ev.code} по причине ${ev.reason}`);
    } else {
        console.log(`Соединение прервано`)
    }
}

//Обработка ошибок
socket.onerror = (error) => {
    console.log(`Ошибка ${error.message}`)
}

//Принимаем сообщения клиента
form.onsubmit = (e) => {
    // При отправке стр не перезагружается
    e.preventDefault();
    //Будет отправлятся, если в сообщении хоть что-то написано
    if(inputMessag.value) {
        const message = {
            username: userName,
            content: inputMessag.value
        };
        socket.send(JSON.stringify(message))
        //При отправке сообщения окно очищается
        inputMessag.value = '';
    }
}

