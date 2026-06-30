// Service responsible for deciding WHEN dirty rooms are persisted.
// Owns scheduling only; it delegates HOW to persist to the PersistenceService.
class AutosaveScheduler {

    constructor({

        // Injecting the room manager used to read the active rooms.
        roomManager,

        // Injecting the persistence service used to persist dirty rooms.
        persistenceService,

        // Interval in milliseconds between two autosave cycles.
        intervalMs,

        // Optional logger; falls back to the console when not provided.
        logger,

    }) {

        // Storing the room manager for active room lookups.
        this.roomManager = roomManager;

        // Storing the persistence service for database persistence.
        this.persistenceService = persistenceService;

        // Storing the logger used for autosave diagnostics.
        this.logger = logger || console;

        // Reject non-positive intervals so a misconfigured scheduler fails fast.
        if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
            throw new Error("AutosaveScheduler intervalMs must be a positive number.");
        }

        // Storing the autosave interval.
        this.intervalMs = intervalMs;

        // Holds the active timer handle; null while the scheduler is stopped.
        this.timer = null;

        // Guards against overlapping cycles when a save takes longer than the interval.
        this.isCycleRunning = false;

    }

    // Start the recurring autosave loop.
    start() {

        // Avoid scheduling more than one timer.
        if (this.timer) {
            return;
        }

        // Schedule the recurring autosave cycle.
        this.timer = setInterval(() => {
            this.runCycle();
        }, this.intervalMs);

        // Do not let the timer keep the process alive during shutdown.
        if (typeof this.timer.unref === "function") {
            this.timer.unref();
        }

    }

    // Stop the recurring autosave loop.
    stop() {

        // Clear the timer only when one is active.
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

    }

    // Run a single autosave cycle that persists every dirty room.
    async runCycle() {

        // Skip this cycle if the previous one is still in progress.
        if (this.isCycleRunning) {
            return;
        }

        // Mark the cycle as running to prevent overlapping persistence.
        this.isCycleRunning = true;

        try {

            // Persist every dirty room through the persistence service.
            const savedCount = await this.persistenceService.saveDirtyRooms(
                this.collectRooms()
            );

            // Report how many rooms were persisted in this cycle.
            if (savedCount > 0) {
                this.logger.info(`[autosave] Persisted ${savedCount} dirty room(s).`);
            }

        } catch (error) {

            // Log the failure without crashing the scheduler so future cycles continue.
            this.logger.error(`[autosave] Cycle failed: ${error.message}`);

        } finally {

            // Release the guard so the next cycle can run.
            this.isCycleRunning = false;

        }

    }

    // Persist all remaining dirty rooms immediately (used on graceful shutdown).
    async flush() {

        // Persist every dirty room one final time before the process exits.
        return this.persistenceService.saveDirtyRooms(this.collectRooms());

    }

    // Take a snapshot of the active rooms to avoid iterating a live map across awaits.
    collectRooms() {

        // Materialize the room iterator into a stable array.
        return [...this.roomManager.values()];

    }

}

export default AutosaveScheduler;
