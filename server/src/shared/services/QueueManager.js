class QueueManager {

    constructor() {

        // Backing array of queued deltas.
        this.queue = [];

        // Head index marking the next item to dequeue (avoids O(n) shifts).
        this.head = 0;

    }

    enqueue(delta) {
        this.queue.push(delta);
    }

    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty.");
        }

        // Read the item at the head and release its reference.
        const delta = this.queue[this.head];
        this.queue[this.head] = undefined;
        this.head++;

        // Compact the backing array once it has been fully drained.
        if (this.head === this.queue.length) {
            this.queue = [];
            this.head = 0;
        }

        return delta;
    }

    peek() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty.");
        }

        return this.queue[this.head];
    }

    isEmpty() {
        return this.head === this.queue.length;
    }

    size() {
        return this.queue.length - this.head;
    }

    clear() {
        this.queue = [];
        this.head = 0;
    }

}

export default QueueManager;
