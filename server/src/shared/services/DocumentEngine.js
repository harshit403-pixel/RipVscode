// Internal piece-table representation of a document.
// Backs DocumentEngine's edits; not exported and not used outside this module.
class PieceTable {

    constructor(text) {

        // Immutable original buffer holding the initial document.
        this.original = text;

        // Append-only buffer holding every inserted fragment.
        this.added = "";

        // Ordered pieces describing the current document over the two buffers.
        this.pieces = text.length > 0
            ? [{ buffer: "original", start: 0, length: text.length }]
            : [];

    }

    // Resolve the backing buffer string for a piece.
    bufferFor(piece) {
        return piece.buffer === "original" ? this.original : this.added;
    }

    // Materialize the current document into a plain string.
    toString() {

        // Concatenate the slice each piece points at.
        let result = "";

        for (const piece of this.pieces) {
            const buffer = this.bufferFor(piece);
            result += buffer.slice(piece.start, piece.start + piece.length);
        }

        return result;

    }

    // Ensure a clean piece boundary at an absolute offset and return its piece index.
    splitAt(offset) {

        // Offset zero is always a boundary at the start.
        if (offset === 0) {
            return 0;
        }

        // Walk the pieces accumulating their lengths until the offset is reached.
        let consumed = 0;

        for (let i = 0; i < this.pieces.length; i++) {

            const piece = this.pieces[i];

            // The offset lands exactly after this piece: already a clean boundary.
            if (consumed + piece.length === offset) {
                return i + 1;
            }

            // The offset falls inside this piece: split it into two pieces.
            if (consumed + piece.length > offset) {

                const left = offset - consumed;

                const firstPart = {
                    buffer: piece.buffer,
                    start: piece.start,
                    length: left,
                };

                const secondPart = {
                    buffer: piece.buffer,
                    start: piece.start + left,
                    length: piece.length - left,
                };

                this.pieces.splice(i, 1, firstPart, secondPart);

                return i + 1;

            }

            consumed += piece.length;

        }

        // The offset is at or beyond the end of the document.
        return this.pieces.length;

    }

    // Insert text at an absolute position.
    insert(position, text) {

        // Ignore empty insertions.
        if (text.length === 0) {
            return;
        }

        // Append the text to the add buffer and describe it as a new piece.
        const start = this.added.length;
        this.added += text;

        const newPiece = {
            buffer: "added",
            start,
            length: text.length,
        };

        // Split at the insertion point and splice the new piece in.
        const index = this.splitAt(position);
        this.pieces.splice(index, 0, newPiece);

    }

    // Delete a range of the given length starting at an absolute position.
    delete(position, length) {

        // Ignore empty deletions.
        if (length === 0) {
            return;
        }

        // Establish clean boundaries at both ends of the range.
        const startIndex = this.splitAt(position);
        const endIndex = this.splitAt(position + length);

        // Drop every piece between the two boundaries.
        this.pieces.splice(startIndex, endIndex - startIndex);

    }

}

// Creating the document class to update delete and inster the content of the document
class DocumentEngine {

    insert(document, position, text) {

        if (typeof document !== "string") {
            throw new Error("Document must be a string.");
        }

        if (position < 0 || position > document.length) {
            throw new Error("Invalid insert position.");
        }

        // Apply the insertion through a piece table and materialize the result.
        const table = new PieceTable(document);
        table.insert(position, text);
        return table.toString();

    }

    delete(document, position, length) {

        if (typeof document !== "string") {
            throw new Error("Document must be a string.");
        }

        if (position < 0 || position > document.length) {
            throw new Error("Invalid delete position.");
        }

        if (length < 0) {
            throw new Error("Delete length cannot be negative.");
        }

        if (position + length > document.length) {
            throw new Error("Delete range exceeds document length.");
        }

        // Apply the deletion through a piece table and materialize the result.
        const table = new PieceTable(document);
        table.delete(position, length);
        return table.toString();

    }

    replace(document, position, length, text) {

        if (typeof document !== "string") {
            throw new Error("Document must be a string.");
        }

        if (position < 0 || position > document.length) {
            throw new Error("Invalid replace position.");
        }

        if (length < 0) {
            throw new Error("Replace length cannot be negative.");
        }

        if (position + length > document.length) {
            throw new Error("Replace range exceeds document length.");
        }

        // Apply the replacement as a delete followed by an insert at the same position.
        const table = new PieceTable(document);
        table.delete(position, length);
        table.insert(position, text);
        return table.toString();

    }

    applyDelta(document, delta) {

        switch (delta.type) {

            case "insert":
                return this.insert(
                    document,
                    delta.position,
                    delta.text
                );

            case "delete":
                return this.delete(
                    document,
                    delta.position,
                    delta.length
                );

            case "replace":
                return this.replace(
                    document,
                    delta.position,
                    delta.length,
                    delta.text
                );

            default:
                throw new Error(`Unknown delta type: ${delta.type}`);

        }

    }


}

export default DocumentEngine;
