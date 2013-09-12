function heapTree() {

    /**
     * Pointer to root node in the tree.
     * @property _root
     * @type Object
     * @private
     */
    this.root = null;
    this.length = 0;
}


heapTree.prototype = {

    //restore constructor
    constructor: BinarySearchTree,

    count: function (node) {
        if (!node){ return 0;}

        var c = 1;
        c += this.count(node.children[0]);
        c += this.count(node.children[1]);

    },

    _swap : function(a, b) {
        var cleft, cright, tparent;

        cleft = b.children[0];
        cright = b.children[1];

        if (a._parent) {
            if (a._parent.children[0] == a) a._parent.children[0] = b;
            else a._parent.children[1] = b;
        }

        b._parent = a._parent;
        a._parent = b;

        // This assumes direct descendents
        if (a.children[0] == b) {
            b.children[0] = a;
            b.children[1] = a.children[1];
            if (b.children[1]) b.children[1]._parent = b;
        } else {
            b.children[1] = a;
            b.children[0] = a.children[0];
            if (b.children[0]) b.children[0]._parent = b;
        }

        a.children[0] = cleft;
        a.children[1] = cright;

        if (a.children[0]) a.children[0]._parent = a;
        if (a.children[1]) a.children[1]._parent = a;

    },

    _last: function (){
        var path, pos, mod, insert;

        pos = this.length;
        path=[];

        while (pos >1){
            mod = pos % 2;
            pos = Math.floor(pos / 2);
            path.push(mod);
        }

        insert = this.root;

        while (path.length > 1) {
            pos = path.pop();
            if (pos === 0)
                insert = insert.children[0];
            else
                insert = insert.children[1];
        }

        return insert;
    },


    _head: function(){
        if (!this.root)
            return;

        var tmp = this.root;
        while (tmp._parent) {
            tmp = tmp._parent;
        }

        this.root = tmp;
    }   ,

    _up: function (node){
        if (!node || !node._parent)
            return;

        var next = this.smallest(node._parent);

        if (next != node._parent) {
            this._swap(node._parent, node);
            this._up(node);
        }
    },

    _down : function(node) {
        if (!node)
            return;

        var next = this.smallest(node);
        if (next != node) {
            this._swap(node, next);
            this._down(node);
        }
    },

    smallest: function (heap){
        var small = heap;

        if (heap.children[0] && heap.name > heap.children[0].name) {
            small = heap.children[0];
        }

        if (heap.children[1] && small.name > heap.children[1].name) {
            small = heap.children[1];
        }

        return small;
    },

    largest : function(heap) {
        var large = heap;

        if (heap.children[0] && heap.name < heap.children[0].name) {
            large = heap.children[0];
        }

        if (heap.children[1] && large.name < heap.children[1].name) {
            large = heap.children[1];
        }

        return large;
    },

    insert: function (v){
        var node = {
                name: v,
                _parent: null,
                children:[null,null]
            }, insert

        this.length +=1;

        if (!this.root) {
            this.root = node;
        }
        else {
            insert = this._last();

            node._parent = insert;

            if (!insert.children[0])
                insert.children[0] = node;
            else
                insert.children[1] = node;

            this._up(node);
        }

        this._head();

    },

   pop : function() {
        var ret, last;

        if (!this.root)
            return null;

        return this.remove(this.root);
    },

    remove : function(v) {
        var ret, last;

        var node = this.find(v)

        if (node){
            ret = node;
            last = this._last();

            if (last.children[1])
                last = last.children[1];
            else
                last = last.children[0];

            this.length -= 1;

            if (!last) {
                if (ret == this.root)
                    this.root = null;
                return ret;
            }

            if (ret == last) {
                if (ret._parent.children[0] == node)
                    ret._parent.children[0] = null;
                else
                    ret._parent.children[1] = null;
                last = ret._parent;
                ret._parent = null;
            } else if (!ret.children[0] && !ret.children[1]) {
                // we're trying to remove an element without any children and its not the last
                // move the last under its parent and heap-up
                if (last._parent.children[0] == last) last._parent.children[0] = null;
                else last._parent.children[1] = null;

                if (ret._parent.children[0] == ret) ret._parent.children[0] = last;
                else ret._parent.children[1] = last;

                last._parent = ret._parent;

                ret._parent = null;

                // TODO in this case we shouldn't later also do a down, but it should only visit once
                this._up(last);
            } else {
                this._delete_swap(ret, last);
            }

            if (ret == this.root)
                this.root = last;

            this._down(last);
            this._head();
        }

    },

    _delete_swap : function(a, b) {
        if (a.children[0] != b) b.children[0] = a.children[0];
        if (a.children[1] != b) b.children[1] = a.children[1];

        if (b._parent.children[0] == b) b._parent.children[0] = null;
        else b._parent.children[1] = null;

        if (a._parent) {
            if (a._parent.children[0] == a) a._parent.children[0] = b;
            else a._parent.children[1] = b;
        }

        b._parent = a._parent;

        if (b.children[0]) b.children[0]._parent = b;
        if (b.children[1]) b.children[1]._parent = b;

        a._parent = null;
        a.children[0] = null;
        a.children[1] = null;
    },

    find: function (v){
        var node = this.root
        var stack = []

        while (node || stack.size()!=0) {
            if (node) {
                if(node.name===v) return node
                // go left as far as possible, push to the stack
                stack.push(node);
                node = node.children[0];
            } else {
                // we are at the bottom, pop from the stack
                node = stack.top();
                stack.pop();
                node = node.children[1];
            }
        }

        return false
    }
}