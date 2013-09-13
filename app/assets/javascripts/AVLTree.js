/**
 * @author   redcrow
 * @link     http://na5cent.blogspot.com/2013/06/avl-tree-javascript.html
 * @create   25/06/2013
 */
var AVLTree = function() {
    this.root_ = null;
    var lastNode_;
    var deleteNode_;

    this.getRoot = function() {
        return this.root_;
    };


    var height__ = function(node) {
        if (node === null) {
            return -1;
        } else {
            return Math.max(height__(node.getLeft()), height__(node.getRight())) + 1;
        }
    };

    this.height = function(node) {
        return height__(node);
    };

    var singleRotateRight_ = function(node) {
        var tmp = node.getLeft();
        node.setLeft(tmp.getRight());
        tmp.setRight(node);

        return tmp;
    };

    var singleRotateLeft_ = function(node) {
        var tmp = node.getRight();
        node.setRight(tmp.getLeft());
        tmp.setLeft(node);

        return tmp;
    };

    var doubleRotateRight_ = function(node) {
        node.setLeft(singleRotateLeft_(node.getLeft()));
        return singleRotateRight_(node);
    };

    var doubleRotateLeft_ = function(node) {
        node.setRight(singleRotateRight_(node.getRight()));
        return singleRotateLeft_(node);
    };

    var insert_ = function(key, node) {
        if (node === null) {
            node = new AVLNode(key);
        } else if (key < node.getItem()) {
            node.setLeft(insert_(key, node.getLeft()));
            if (node.getLeft() !== null) {
                if ((height__(node.getLeft()) - height__(node.getRight())) === 2) {
                    if (key < node.getLeft().getItem()) {
                        node = singleRotateRight_(node);
                    } else {
                        node = doubleRotateRight_(node);
                    }
                }
            }
        } else if (key > node.getItem()) {
            node.setRight(insert_(key, node.getRight()));
            if (node.getRight() !== null) {
                if ((height__(node.getRight()) - height__(node.getLeft())) === 2) {
                    if (key > node.getRight().getItem()) {
                        node = singleRotateLeft_(node);
                    } else {
                        node = doubleRotateLeft_(node);
                    }
                }
            }
        } else {
            //duplicate not allow!
        }

        return node;
    };

    this.insertNode = function(key) {
        this.root_ = insert_(key, this.root_);
    };

    var delete_ = function(key, node) {
        if (node === null) {
            return null;
        }
        lastNode_ = node;

        if (key < node.getItem()) {
            node.setLeft(delete_(key, node.getLeft()));
        } else {
            deleteNode_ = node;
            node.setRight(delete_(key, node.getRight()));
        }

        if (node === lastNode_) {
            if (deleteNode_ !== null && key === deleteNode_.getItem()) {
                if (deleteNode_ === lastNode_) {
                    node = node.getLeft();
                } else {
                    var tmp = deleteNode_.getItem();
                    deleteNode_.setItem(lastNode_.getItem());
                    lastNode_.setItem(tmp);
                    node = node.getRight();
                }
            }
        } else {
            if ((height__(node.getLeft()) - height__(node.getRight())) === 2) {
                if (key < node.getLeft().getItem()) {
                    node = singleRotateRight_(node);
                } else {
                    node = doubleRotateRight_(node);
                }
            }

            if ((height__(node.getRight()) - height__(node.getLeft())) === 2) {
                if (key > node.getRight().getItem()) {
                    node = singleRotateLeft_(node);
                } else {
                    node = doubleRotateLeft_(node);
                }
            }
        }
    };

    this.deleteNode = function(key) {
        lastNode_ = null;
        deleteNode_ = null;
        this.root_ = delete_(key, this.root_);
    };

    this.findMinNode = function(node) {
        if (node !== null) {
            while (node.getLeft() !== null) {
                node = node.getLeft();
            }
        }

        return node;
    };

    this.findMaxNode = function(node) {
        if (node !== null) {
            while (node.getRight() !== null) {
                node = node.getRight();
            }
        }

        return node;
    };

    var removeMinNode_ = function(node) {
        if (node === null) {
            console.log('Error! tree is empty.');
            return null;
        } else if (node.getLeft() !== null) {
            node.setLeft(removeMinNode_(node.getLeft()));
            return node;
        } else {
            return node.getRight();
        }
    };

    var removeMaxNode_ = function(node) {
        if (node === null) {
            console.log('Error! tree is empty.');
            return null;
        } else if (node.getRight() !== null) {
            node.setRight(removeMaxNode_(node.getRight()));
            return node;
        } else {
            return node.getLeft();
        }
    };

    this.removeMinNode = function(node) {
        return removeMinNode_(node);
    };

    this.removeMaxNode = function(node) {
        return removeMaxNode_(node);
    };

    this.printAVLTree = function() {
        console.log('Items : ');
        this.root_.preorderPrint();
        console.log();
    };
};