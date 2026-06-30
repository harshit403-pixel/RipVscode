// Persistent piece tree backing a single document.
// A balanced (treap) binary tree of pieces over an immutable original buffer and
// an append-only add buffer, giving expected O(log n) inserts and deletes without
// rebuilding the document on every edit. In-order traversal yields the document.
class PieceTree {

    constructor(text) {

        // Immutable original buffer holding the initial document.
        this.original = text || "";

        // Append-only buffer holding every inserted fragment.
        this.added = "";

        // Root of the balanced tree; null for an empty document.
        this.root = null;

        // Cached materialized string; invalidated on every mutation.
        this.cachedText = null;

        // Seed the tree with a single piece covering the original buffer.
        if (this.original.length > 0) {
            this.root = this.createNode("original", 0, this.original.length);
        }

    }

    // Create a new tree node describing a single piece.
    createNode(buffer, start, length) {

        return {
            buffer,
            start,
            length,
            left: null,
            right: null,
            priority: Math.random(),
            subtreeLength: length,
        };

    }

    // Total length of the document in characters.
    get length() {
        return this.root ? this.root.subtreeLength : 0;
    }

    // Recompute a node's subtree length from its children.
    update(node) {

        const leftLength = node.left ? node.left.subtreeLength : 0;
        const rightLength = node.right ? node.right.subtreeLength : 0;
        node.subtreeLength = node.length + leftLength + rightLength;
        return node;

    }

    // Merge two ordered subtrees into one, preserving heap priority.
    merge(left, right) {

        // A missing side means the other side is the whole result.
        if (!left) return right;
        if (!right) return left;

        // The higher-priority root stays on top; the other side hangs below it.
        if (left.priority >= right.priority) {
            left.right = this.merge(left.right, right);
            return this.update(left);
        }

        right.left = this.merge(left, right.left);
        return this.update(right);

    }

    // Split a subtree at an absolute offset into [first `position` chars, rest].
    split(node, position) {

        // An empty subtree splits into two empty subtrees.
        if (!node) return [null, null];

        const leftLength = node.left ? node.left.subtreeLength : 0;

        // The split point lies within the left subtree.
        if (position <= leftLength) {
            const [l, r] = this.split(node.left, position);
            node.left = r;
            this.update(node);
            return [l, node];
        }

        // The split point lies within the right subtree.
        if (position >= leftLength + node.length) {
            const [l, r] = this.split(node.right, position - leftLength - node.length);
            node.right = l;
            this.update(node);
            return [node, r];
        }

        // The split point falls inside this node's piece: split the piece in two.
        const offsetInPiece = position - leftLength;
        const leftPart = this.createNode(node.buffer, node.start, offsetInPiece);
        const rightPart = this.createNode(node.buffer, node.start + offsetInPiece, node.length - offsetInPiece);

        // Reuse the original priority so both halves keep the heap valid.
        leftPart.priority = node.priority;
        rightPart.priority = node.priority;

        // Reattach the original children to the matching halves.
        leftPart.left = node.left;
        rightPart.right = node.right;
        this.update(leftPart);
        this.update(rightPart);

        return [leftPart, rightPart];

    }

    // Insert text at an absolute position.
    insert(position, text) {

        // Ignore empty insertions.
        if (!text || text.length === 0) return;

        // Append the text to the add buffer and describe it as a new piece.
        const start = this.added.length;
        this.added += text;
        const node = this.createNode("added", start, text.length);

        // Splice the new piece in at the requested position.
        const [left, right] = this.split(this.root, position);
        this.root = this.merge(this.merge(left, node), right);

        // Invalidate the materialized cache.
        this.cachedText = null;

    }

    // Delete a range of the given length starting at an absolute position.
    delete(position, length) {

        // Ignore empty deletions.
        if (length <= 0) return;

        // Isolate the target range and drop it.
        const [left, rest] = this.split(this.root, position);
        const [, right] = this.split(rest, length);
        this.root = this.merge(left, right);

        // Invalidate the materialized cache.
        this.cachedText = null;

    }

    // Materialize the document into a plain string (cached between mutations).
    toString() {

        // Return the cached string when no mutation has occurred since.
        if (this.cachedText !== null) return this.cachedText;

        // Concatenate every piece via an in-order traversal.
        const parts = [];
        this.collect(this.root, parts);
        this.cachedText = parts.join("");
        return this.cachedText;

    }

    // In-order traversal appending each piece's slice to the output list.
    collect(node, parts) {

        if (!node) return;

        this.collect(node.left, parts);

        const buffer = node.buffer === "original" ? this.original : this.added;
        parts.push(buffer.slice(node.start, node.start + node.length));

        this.collect(node.right, parts);

    }

}

export default PieceTree;
