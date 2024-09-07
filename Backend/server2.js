const WebSocket = require('ws');
const getPortTraffic = require('./functions/getApp');

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port: 8080 });

// 字节 -> MB单位转换
function bytesToMB(bytes) {
    return bytes / (1024 * 1024);
}

wss.on('connection', (ws) => {
  console.log('客户端已连接');

  // 定期获取并发送端口流量信息
  const intervalId = setInterval(() => {
    getPortTraffic((connections) => {
      let totalTraffic = connections[0].totalSentBytes
      let totalReceived = connections[0].totalReceivedBytes

      let sentMB = parseFloat(bytesToMB(totalTraffic).toFixed(4))
      let receivedMB = parseFloat(bytesToMB(totalReceived).toFixed(4))
      let total = sentMB + receivedMB;
      console.log(total);
      
      ws.send(JSON.stringify({connections, total}));
    });
  }, 1000); // 每1秒获取一次数据

  // 处理客户端断开连接
  ws.on('close', () => {
    console.log('客户端已断开');
    clearInterval(intervalId);
  });
});

console.log('WebSocket 服务器已启动，监听端口 8080');

