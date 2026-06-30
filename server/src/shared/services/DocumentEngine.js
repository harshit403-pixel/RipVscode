// Creating the document class to update delete and inster the content of the document
class DocumentEngine {

    insert(document, position, text) {

        if (typeof document !== "string") {
            throw new Error("Document must be a string.");
        }

        if (position < 0 || position > document.length) {
            throw new Error("Invalid insert position.");
        }

        return (
            document.slice(0, position) +
            text +
            document.slice(position)
        );

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

        return (
            document.slice(0, position) +
            document.slice(position + length)
        );

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

        return (
            document.slice(0, position) +
            text +
            document.slice(position + length)
        );

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