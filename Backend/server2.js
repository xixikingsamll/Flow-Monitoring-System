const WebSocket = require('ws');
const getPortTraffic = require('./functions/getApp');

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('客户端已连接');

  // 定期获取并发送端口流量信息
  const intervalId = setInterval(() => {
    getPortTraffic((connections) => {
      ws.send(JSON.stringify(connections));
    });
  }, 1000); // 每1秒获取一次数据

  // 处理客户端断开连接
  ws.on('close', () => {
    console.log('客户端已断开');
    clearInterval(intervalId);
  });
});

console.log('WebSocket 服务器已启动，监听端口 8080');

