// Copyright 2011 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/**
 * Constructs a Splay tree.  A splay tree is a self-balancing binary
 * search tree with the additional property that recently accessed
 * elements are quick to access again. It performs basic operations
 * such as insertion, look-up and removal in O(log(n)) amortized time.
 *
 * @constructor
 */
function SplayTree() {
};


/**
 * Pointer to the root node of the tree.
 *
 * @type {SplayTree.Node}
 * @private
 */
SplayTree.prototype.root_ = null;


/**
 * @return {boolean} Whether the tree is empty.
 */
SplayTree.prototype.isEmpty = function() {
    return !this.root_;
};


/**
 * Inserts a node into the tree with the specified key and value if
 * the tree does not already contain a node with the specified key. If
 * the value is inserted, it becomes the root of the tree.
 *
 * @param {number} key Key to insert into the tree.
 * @param {*} value Value to insert into the tree.
 */
SplayTree.prototype.insert = function(key, value) {
    if (this.isEmpty()) {
        this.root_ = new SplayTree.Node(key, value);
        return;
    }
    // Splay on the key to move the last node on the search path for
    // the key to the root of the tree.
    this.splay_(key);
    if (this.root_.name == key) {
        return;
    }
    var node = new SplayTree.Node(key, value);
    if (key > this.root_.name) {
        node.children[0] = this.root_;
        node.children[1] = this.root_.children[1];
        this.root_.children[1] = null;
    } else {
        node.children[1] = this.root_;
        node.children[0] = this.root_.children[0];
        this.root_.children[0] = null;
    }
    this.root_ = node;
};


/**
 * Removes a node with the specified key from the tree if the tree
 * contains a node with this key. The removed node is returned. If the
 * key is not found, an exception is thrown.
 *
 * @param {number} key Key to find and remove from the tree.
 * @return {SplayTree.Node} The removed node.
 */
SplayTree.prototype.remove = function(key) {
    if (this.isEmpty()) {
        throw Error('Key not found: ' + key);
    }
    this.splay_(key);
    if (this.root_.name != key) {
        throw Error('Key not found: ' + key);
    }
    var removed = this.root_;
    if (!this.root_.children[0]) {
        this.root_ = this.root_.children[1];
    } else {
        var right = this.root_.children[1];
        this.root_ = this.root_.children[0];
        // Splay to make sure that the new root has an empty right child.
        this.splay_(key);
        // Insert the original right child as the right child of the new
        // root.
        this.root_.children[1] = right;
    }
    return removed;
};


/**
 * Returns the node having the specified key or null if the tree doesn't contain
 * a node with the specified key.
 *
 * @param {number} key Key to find in the tree.
 * @return {SplayTree.Node} Node having the specified key.
 */
SplayTree.prototype.find = function(key) {
    if (this.isEmpty()) {
        return null;
    }
    this.splay_(key);
    return this.root_.name == key ? this.root_ : null;
};


/**
 * @return {SplayTree.Node} Node having the maximum key value.
 */
SplayTree.prototype.findMax = function(opt_startNode) {
    if (this.isEmpty()) {
        return null;
    }
    var current = opt_startNode || this.root_;
    while (current.children[1]) {
        current = current.children[1];
    }
    return current;
};


/**
 * @return {SplayTree.Node} Node having the maximum key value that
 *     is less than the specified key value.
 */
SplayTree.prototype.findGreatestLessThan = function(key) {
    if (this.isEmpty()) {
        return null;
    }
    // Splay on the key to move the node with the given key or the last
    // node on the search path to the top of the tree.
    this.splay_(key);
    // Now the result is either the root node or the greatest node in
    // the left subtree.
    if (this.root_.name < key) {
        return this.root_;
    } else if (this.root_.children[0]) {
        return this.findMax(this.root_.children[0]);
    } else {
        return null;
    }
};


/**
 * @return {Array<*>} An array containing all the keys of tree's nodes.
 */
SplayTree.prototype.exportKeys = function() {
    var result = [];
    if (!this.isEmpty()) {
        this.root_.traverse_(function(node) { result.push(node.name); });
    }
    return result;
};


/**
 * Perform the splay operation for the given key. Moves the node with
 * the given key to the top of the tree.  If no node has the given
 * key, the last node on the search path is moved to the top of the
 * tree. This is the simplified top-down splaying algorithm from:
 * "Self-adjusting Binary Search Trees" by Sleator and Tarjan
 *
 * @param {number} key Key to splay the tree on.
 * @private
 */
SplayTree.prototype.splay_ = function(key) {
    if (this.isEmpty()) {
        return;
    }
    // Create a dummy node.  The use of the dummy node is a bit
    // counter-intuitive: The right child of the dummy node will hold
    // the L tree of the algorithm.  The left child of the dummy node
    // will hold the R tree of the algorithm.  Using a dummy node, left
    // and right will always be nodes and we avoid special cases.
    var dummy, left, right;
    dummy = left = right = new SplayTree.Node(null, null);
    var current = this.root_;
    while (true) {
        if (key < current.name) {
            if (!current.children[0]) {
                break;
            }
            if (key < current.children[0].name) {
                // Rotate right.
                var tmp = current.children[0];
                current.children[0] = tmp.children[1];
                tmp.children[1] = current;
                current = tmp;
                if (!current.children[0]) {
                    break;
                }
            }
            // Link right.
            right.children[0] = current;
            right = current;
            current = current.children[0];
        } else if (key > current.name) {
            if (!current.children[1]) {
                break;
            }
            if (key > current.children[1].name) {
                // Rotate left.
                var tmp = current.children[1];
                current.children[1] = tmp.children[0];
                tmp.children[0] = current;
                current = tmp;
                if (!current.children[1]) {
                    break;
                }
            }
            // Link left.
            left.children[1] = current;
            left = current;
            current = current.children[1];
        } else {
            break;
        }
    }
    // Assemble.
    left.children[1] = current.children[0];
    right.children[0] = current.children[1];
    current.children[0] = dummy.children[1];
    current.children[0] = dummy.children[1];
    current.children[1] = dummy.children[0];
    this.root_ = current;
};


/**
 * Constructs a Splay tree node.
 *
 * @param {number} key Key.
 * @param {*} value Value.
 */
SplayTree.Node = function(key, value) {
    this.name = key;
    this.value = value;
    this.children = [null,null];
};




/**
 * Performs an ordered traversal of the subtree starting at
 * this SplayTree.Node.
 *
 * @param {function(SplayTree.Node)} f Visitor function.
 * @private
 */
SplayTree.Node.prototype.traverse_ = function(f) {
    var current = this;
    while (current) {
        var left = current.children[0];
        if (left) left.traverse_(f);
        f(current);
        current = current.children[1];
    }
};

SplayTree.prototype.traverseBreadthFirst = function (f) {
    if (f(this.root_.value)) return;

    var stack = [this.root_];
    var length = 1;

    while (length > 0) {
        var new_stack = new Array(stack.length * 2);
        var new_length = 0;
        for (var i = 0; i < length; i++) {
            var n = stack[i];
            var l = n.children[0];
            var r = n.children[1];
            if (l) {
                if (f(l.value)) return;
                new_stack[new_length++] = l;
            }
            if (r) {
                if (f(r.value)) return;
                new_stack[new_length++] = r;
            }
        }
        stack = new_stack;
        length = new_length;
    }
};