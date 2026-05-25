export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("user:join", (userId) => {
      if (userId) socket.join(`user:${userId}`);
    });

    socket.on("order:join", (orderId) => {
      if (orderId) socket.join(`order:${orderId}`);
    });

    socket.on("delivery:location", ({ orderId, partnerId, lat, lng }) => {
      if (orderId) {
        io.to(`order:${orderId}`).emit("delivery:location", { partnerId, lat, lng, updatedAt: new Date() });
      }
    });

    socket.on("support:message", (payload) => {
      io.to(`order:${payload.orderId}`).emit("support:message", payload);
    });
  });
};
