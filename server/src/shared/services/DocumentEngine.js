// Creating the document class to update delete and inster the content of the document
class DocumentEngine {
    constructor(document = "") {
        this.document = document;
    }

    getDocument() {}

    insert(position, text) {}

    delete(position, length) {}

    replace(position, length, text) {}

    applyDelta(delta) {}
}

export default DocumentEngine;