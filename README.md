# Flow-Monitoring-System

一个实时监控本地软件流量使用的网站



## 项目启动

- Backend目录下终端， 启动服务器server，运行流量和网络延迟的Websocket服务器

```shell
// 端口号为3007
nodemon server
```

- Backend目录下终端，启动服务器server2，运行应用端口的WebSocket服务器

```shell
// 端口号为8080
nodemon server2
```

- Frontend目录下终端，启动前端Vue3项目

```shell
// 端口号为5173
npm i
npm run dev
```

