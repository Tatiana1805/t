const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8080});

console.log('Сервер запущен')

wss.on('connection', (ws) => {
    console.log('Новое соединение')

//Вывод когда заходит новый клиент
    ws.send(JSON.stringify({
        type: 'system',
        content: 'Добро пожаловать! Мы Вас уже заждались!)'
    }));

    //Вывод сообщения клиента
    ws.on('message', (message) => {
        let parseMessage;
        try {
            parseMessage = JSON.parse(message);
            console.log(`Получено сообщение: ${parseMessage}`)
        } catch (error) {
            console.log(`Произошла ошибка при обработке сообщения ${error}`);
            return; //При ошибке закрываем сессию
        }

        //Разослать сообщение всем клиентам
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN){
                client.send(JSON.stringify(parseMessage))
            }
        });
    })
})


