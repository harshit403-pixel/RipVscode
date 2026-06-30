// Service responsible for transforming concurrent deltas so they apply consistently.
// Pure and stateless: it never mutates documents or rooms.
class ConflictResolver {

    transform(incomingDelta, appliedDelta) {

        // Shift the incoming position to account for the already-applied delta.
        const position = this.shiftPosition(incomingDelta.position, appliedDelta);

        // Return a new delta with the adjusted position, preserving all other fields.
        return {
            ...incomingDelta,
            position,
        };

    }

    resolve(incomingDelta, appliedDeltas) {

        // Start from the original incoming delta.
        let transformed = incomingDelta;

        // Transform against each concurrent delta in application order.
        for (const appliedDelta of appliedDeltas) {
            transformed = this.transform(transformed, appliedDelta);
        }

        // Return the fully transformed delta.
        return transformed;

    }

    shiftPosition(position, appliedDelta) {

        // Resolve the applied delta's footprint on the document.
        const start = appliedDelta.position;
        const removed = appliedDelta.length || 0;
        const inserted = appliedDelta.text ? appliedDelta.text.length : 0;

        // Positions before the change are unaffected.
        if (position <= start) {
            return position;
        }

        // Positions after the affected range shift by the net length change.
        if (position >= start + removed) {
            return position - removed + inserted;
        }

        // Positions inside a removed range collapse to the change start.
        return start;

    }

}

export default ConflictResolver;
