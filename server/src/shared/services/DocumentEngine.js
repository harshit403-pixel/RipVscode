// Importing modules
import PieceTree from "./PieceTree.js";

// Validates document edits and applies them to a document's piece tree.
// Owns no document state; it only mutates the PieceTree it is given.
class DocumentEngine {

    insert(tree, position, text) {

        // Validate the target piece tree.
        if (!(tree instanceof PieceTree)) {
            throw new Error("Document tree is required.");
        }

        // Validate the insert position against the current document length.
        if (position < 0 || position > tree.length) {
            throw new Error("Invalid insert position.");
        }

        // Apply the insertion to the tree.
        tree.insert(position, text);
        return tree;

    }

    delete(tree, position, length) {

        // Validate the target piece tree.
        if (!(tree instanceof PieceTree)) {
            throw new Error("Document tree is required.");
        }

        // Validate the delete position against the current document length.
        if (position < 0 || position > tree.length) {
            throw new Error("Invalid delete position.");
        }

        if (length < 0) {
            throw new Error("Delete length cannot be negative.");
        }

        if (position + length > tree.length) {
            throw new Error("Delete range exceeds document length.");
        }

        // Apply the deletion to the tree.
        tree.delete(position, length);
        return tree;

    }

    replace(tree, position, length, text) {

        // Validate the target piece tree.
        if (!(tree instanceof PieceTree)) {
            throw new Error("Document tree is required.");
        }

        // Validate the replace position against the current document length.
        if (position < 0 || position > tree.length) {
            throw new Error("Invalid replace position.");
        }

        if (length < 0) {
            throw new Error("Replace length cannot be negative.");
        }

        if (position + length > tree.length) {
            throw new Error("Replace range exceeds document length.");
        }

        // Apply the replacement as a delete followed by an insert at the same position.
        tree.delete(position, length);
        tree.insert(position, text);
        return tree;

    }

    applyDelta(tree, delta) {

        switch (delta.type) {

            case "insert":
                return this.insert(
                    tree,
                    delta.position,
                    delta.text
                );

            case "delete":
                return this.delete(
                    tree,
                    delta.position,
                    delta.length
                );

            case "replace":
                return this.replace(
                    tree,
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
