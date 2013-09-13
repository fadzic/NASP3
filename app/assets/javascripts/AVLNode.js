/**
 * @author   redcrow
 * @link     http://na5cent.blogspot.com/2013/06/avl-tree-javascript.html
 * @create   25/06/2013
 */
var AVLNode = function(item) {
    this.name = item || null;
    this.height_ = 0;
    this.children = [null,null]

    this.getItem = function() {
        return this.name;
    };

    this.getLeft = function() {
        return this.children[0];
    };

    this.setLeft = function(node) {
        this.children[0] = node;
    };

    this.getRight = function() {
        return this.children[1];
    };

    this.setRight = function(node) {
        this.children[1] = node;
    };

    this.getHeight = function() {
        return this.height_;
    };

    this.size = function(node) {
        if (node === null) {
            return 0;
        } else {
            return size(node.getLeft()) + size(node.getRight()) + 1;
        }
    };

    this.preorderPrint = function(padding) {
        padding = padding || '';
        padding = '--' + padding;

        console.log(padding + this.name);

        if (this.children[0] !== null) {
            this.children[0].preorderPrint(padding);
        }

        if (this.children[1] !== null) {
            this.children[1].preorderPrint(padding);
        }
    };

    this.inorderPrint = function(padding) {
        padding = padding || '';
        padding = '--' + padding;

        if (this.children[0] !== null) {
            this.children[0].inorderPrint(padding);
        }

        console.log(padding + this.name);

        if (this.children[1] !== null) {
            this.children[1].inorderPrint(padding);
        }
    };

    this.postorderPrint = function(padding) {
        padding = padding || '';
        padding = '--' + padding;

        if (this.children[0] !== null) {
            this.children[0].postorderPrint(padding);
        }

        if (this.children[1] !== null) {
            this.children[1].postorderPrint(padding);
        }

        console.log(padding + this.name);
    };
};