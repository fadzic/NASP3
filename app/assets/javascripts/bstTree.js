/*
 * Binary Search Tree implementation in JavaScript
 * Copychildren[1] (c) 2009 Nicholas C. Zakas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the children[1]s
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copychildren[1] notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYchildren[1] HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * A binary search tree implementation in JavaScript. This implementation
 * does not allow duplicate names to be inserted into the tree, ensuring
 * that there is just one instance of each name.
 * @class BinarySearchTree
 * @constructor
 */
function BinarySearchTree() {

    /**
     * Pointer to root node in the tree.
     * @property _root
     * @type Object
     * @private
     */
    this._root = null;
}


BinarySearchTree.prototype = {

    //restore constructor
    constructor: BinarySearchTree,

    //-------------------------------------------------------------------------
    // Private members
    //-------------------------------------------------------------------------

    /**
     * Appends some data to the appropriate point in the tree. If there are no
     * nodes in the tree, the data becomes the root. If there are other nodes
     * in the tree, then the tree must be traversed to find the correct spot
     * for insertion.
     * @param {variant} name The data to add to the list.
     * @return {Void}
     * @method add
     */
    add: function (name){

        //create a new item object, place data in
        var node = {
                name: name,
                children:[null,null]
            },

        //used to traverse the structure
            current;

        //special case: no items in the tree yet
        if (this._root === null){
            this._root = node;
        } else {
            current = this._root;

            while(true){

                //if the new name is less than this node's name, go left
                if (name < current.name){

                    //if there's no left, then the new node belongs there
                    if (current.children[0] === null){
                        current.children[0] = node;
                        break;
                    } else {
                        current = current.children[0];
                    }

                    //if the new name is greater than this node's name, go children[1]
                } else if (name > current.name){

                    //if there's no children[1], then the new node belongs there
                    if (current.children[1] === null){
                        current.children[1] = node;
                        break;
                    } else {
                        current = current.children[1];
                    }

                    //if the new name is equal to the current one, just ignore
                } else {
                    break;
                }
            }
        }
    },

    /**
     * Determines if the given name is present in the tree.
     * @param {variant} name The name to find.
     * @return {Boolean} True if the name is found, false if not.
     * @method contains
     */
    contains: function(name){

        var found       = false,
            current     = this._root

        //make sure there's a node to search
        while(!found && current){

            //if the name is less than the current node's, go left
            if (name < current.name){
                current = current.children[0];

                //if the name is greater than the current node's, go children[1]
            } else if (name > current.name){
                current = current.children[1];

                //names are equal, found it!
            } else {
                found = true;
            }
        }

        //only proceed if the node was found
        return found;

    },

    /**
     * Removes the node with the given name from the tree. This may require
     * moving around some nodes so that the binary search tree remains
     * properly balanced.
     * @param {variant} name The name to remove.
     * @return {void}
     * @method remove
     */
    remove: function(name){

        var found       = false,
            parent      = null,
            current     = this._root,
            childCount,
            replacement,
            replacementParent;

        //make sure there's a node to search
        while(!found && current){

            //if the name is less than the current node's, go left
            if (name < current.name){
                parent = current;
                current = current.children[0];

                //if the name is greater than the current node's, go children[1]
            } else if (name > current.name){
                parent = current;
                current = current.children[1];

                //names are equal, found it!
            } else {
                found = true;
            }
        }

        //only proceed if the node was found
        if (found){

            //figure out how many children
            childCount = (current.children[0] !== null ? 1 : 0) + (current.children[1] !== null ? 1 : 0);

            //special case: the name is at the root
            if (current === this._root){
                switch(childCount){

                    //no children, just erase the root
                    case 0:
                        this._root = null;
                        break;

                    //one child, use one as the root
                    case 1:
                        this._root = (current.children[1] === null ? current.children[0] : current.children[1]);
                        break;

                    //two children, little work to do
                    case 2:

                        //new root will be the old root's left child...maybe
                        replacement = this._root.children[0];
                        replacementParent = null

                        //find the children[1]-most leaf node to be the real new root
                        while (replacement.children[1] !== null){
                            replacementParent = replacement;
                            replacement = replacement.children[1];
                        }

                        //it's not the first node on the left
                        if (replacementParent !== null){

                            //remove the new root from it's previous position
                            replacementParent.children[1] = replacement.children[0];

                            //give the new root all of the old root's children
                            replacement.children[1] = this._root.children[1];
                            replacement.children[0] = this._root.children[0];
                        } else {

                            //just assign the children
                            replacement.children[1] = this._root.children[1];
                        }

                        //officially assign new root
                        this._root = replacement;

                    //no default

                }

                //non-root names
            } else {

                switch (childCount){

                    //no children, just remove it from the parent
                    case 0:
                        //if the current name is less than its parent's, null out the left pointer
                        if (current.name < parent.name){
                            parent.children[0] = null;

                            //if the current name is greater than its parent's, null out the children[1] pointer
                        } else {
                            parent.children[1] = null;
                        }
                        break;

                    //one child, just reassign to parent
                    case 1:
                        //if the current name is less than its parent's, reset the children[0] pointer
                        if (current.name < parent.name){
                            parent.children[0] = (current.children[0] === null ? current.children[1] : current.children[0]);

                            //if the current name is greater than its parent's, reset the children[1] pointer
                        } else {
                            parent.children[1] = (current.children[0] === null ? current.children[1] : current.children[0]);
                        }
                        break;

                    //two children, a bit more complicated
                    case 2:

                        //reset pointers for new traversal
                        replacement = current.children[0];
                        replacementParent = current;

                        //find the children[1]-most node
                        while(replacement.children[1] !== null){
                            replacementParent = replacement;
                            replacement = replacement.children[1];
                        }

                        replacementParent.children[1] = replacement.children[0];

                        //assign children to the replacement
                        replacement.children[1] = current.children[1];
                        replacement.children[0] = current.children[0];

                        //place the replacement in the children[1] spot
                        if (current.name < parent.name){
                            parent.children[0] = replacement;
                        } else {
                            parent.children[1] = replacement;
                        }

                    //no default


                }

            }

        }

    },

    /**
     * Returns the number of items in the tree. To do this, a traversal
     * must be executed.
     * @return {int} The number of items in the tree.
     * @method size
     */
    size: function(){
        var length = 0;

        this.traverse(function(node){
            length++;
        });

        return length;
    },

    /**
     * Converts the tree into an array.
     * @return {Array} An array containing all of the data in the tree.
     * @method toArray
     */
    toArray: function(){
        var result = [];

        this.traverse(function(node){
            result.push(node.name);
        });

        return result;
    },

    /**
     * Converts the list into a string representation.
     * @return {String} A string representation of the list.
     * @method toString
     */
    toString: function(){
        return this.toArray().toString();
    },

    /**
     * Traverses the tree and runs the given method on each node it comes
     * across while doing an in-order traversal.
     * @param {Function} process The function to run on each node.
     * @return {void}
     * @method traverse
     */
    traverse: function(process){

        //helper function
        function inOrder(node){
            if (node){

                //traverse the children[0] subtree
                if (node.children[0] !== null){
                    inOrder(node.children[0]);
                }

                //call the process method on this node
                process.call(this, node);

                //traverse the children[1] subtree
                if (node.children[1] !== null){
                    inOrder(node.children[1]);
                }
            }
        }

        //start with the root
        inOrder(this._root);
    },

    find: function(id){
        var found       = false,
            parent      = null,
            current     = this._root

        while(!found && current){

            //if the name is less than the current node's, go left
            if (id < current.name){
                parent = current;
                current = current.children[0];

                //if the name is greater than the current node's, go children[1]
            } else if (id > current.name){
                parent = current;
                current = current.children[1];

                //names are equal, found it!
            } else {
                found = true;
            }
        }

        return found;
    }
};