function registerCodeEvents(
    io,
    socket,
    {
        roomLifecycleService,
        roomEditingService,
    }
) {

    socket.on(
        "code-change",
        async ({ roomCode, delta }) => {

            try {

                const activeRoom =
                    await roomLifecycleService.getOrCreateRoom(
                        roomCode
                    );

                const updatedRoom =
                    roomEditingService.process(
                        activeRoom,
                        delta
                    );

                socket.to(roomCode).emit(
                    "code-change",
                    {
                        delta,
                        version:
                            updatedRoom.version,
                    }
                );

            } catch (error) {

                socket.emit(
                    "editor-error",
                    {
                        message: error.message,
                    }
                );

            }

        }
    );

}

export default registerCodeEvents;