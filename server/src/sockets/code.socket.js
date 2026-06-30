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

                // Process the edit and obtain the applied (possibly transformed) delta.
                const result =
                    roomEditingService.process(
                        activeRoom,
                        delta
                    );

                // Broadcast the applied delta so every client converges on the same document.
                socket.to(roomCode).emit(
                    "code-change",
                    {
                        delta: result.delta,
                        version: result.version,
                    }
                );

            } catch (error) {

                // Resync the sender with the latest version when the delta is stale.
                if (error.code === "STALE_DELTA") {

                    socket.emit(
                        "sync-required",
                        {
                            version: error.currentVersion,
                            document: error.currentDocument,
                        }
                    );

                    return;

                }

                // Report any other editor error back to the sender.
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