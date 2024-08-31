const WebSocket = require('ws');
const { getNetworkDownloadSpeed, getNetworkLatency } = require('./functions/getSpeed');

// 创建一个 WebSocket 服务器
const wss = new WebSocket.Server({ port: 3007 });

wss.on('connection', (ws) => {
    console.log('客户端已连接');

    // 定期获取网速并发送给客户端
    setInterval(async () => {
        const downloadSpeed = await getNetworkDownloadSpeed();
        const latency = await getNetworkLatency();
        ws.send(JSON.stringify({ downloadSpeed, latency }));
    }, 1000); // 每1秒获取一次网速

    // 当服务器收到消息时，触发该事件
    ws.on('message', (message) => {
        console.log(`收到消息：${message}`);
        // 可以根据需要处理消息
    });

    // 处理客户端断开连接的事件
    ws.on('close', () => {
        console.log('客户端已断开连接');
    });
});

console.log('WebSocket 服务器已启动，正在监听端口 3007');

