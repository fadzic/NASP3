(function(R, B) {
    rbTree = function() {
        return arguments.length && arguments.length == 4
            ? new Node(arguments[0], arguments[1], arguments[2], arguments[3])
            : new Leaf();
    };

    rbTree.prototype.isLeaf = function() {
        return this instanceof Leaf;
    };

    var Node = function(color, left, name, right) {
        this.color  = color;
        this.name  = name;
        this.children=[left,right]
    };

    var F = new Function();
    F.prototype = rbTree.prototype;
    Node.prototype = new F();

    Node.prototype.balanceLeft = function() {
        switch(true) {
            case this.color == B && this.children[0].color == R && this.children[0].children[0].color == R:
                var name = this.children[0].name,
                    right = new Node(B, this.children[0].children[1], this.name, this.children[1]),
                    left  = new Node(B, this.children[0].children[0].children[0], this.children[0].children[0].name,
                        this.children[0].children[0].children[1]);

                return new Node(R, left, name, right);

            case this.color == B && this.children[0].color == R && this.children[0].children[1].color == R:
                var name = this.children[0].children[1].name,
                    right = new Node(B, this.children[0].children[1].children[1], this.name, this.children[1]);
                left  = new Node(B, this.children[0].children[0], this.children[0].name,
                    this.children[0].children[1].children[0]);

                return new Node(R, left, name, right);

            default:
                return this;
        }
    };

    Node.prototype.balanceRight = function() {
        switch(true) {
            case this.color == B && this.children[1].color == R && this.children[1].children[1].color == R:
                var name = this.children[1].name,
                    left  = new Node(B, this.children[0], this.name, this.children[1].children[0]),
                    right = new Node(B, this.children[1].children[1].children[0], this.children[1].children[1].name,
                        this.children[1].children[1].children[1]);

                return new Node(R, left, name, right);

            case this.color == B && this.children[1].color == R && this.children[1].children[0].color == R:
                var name = this.children[1].children[0].name,
                    left  = new Node(B, this.children[0], this.name, this.children[1].children[0].children[0]),
                    right = new Node(B, this.children[1].children[0].children[1], this.children[1].name,
                        this.children[1].children[1]);

                return new Node(R, left, name, right);

            default:
                return this;
        }
    };

    Node.prototype.insert = function(name) {
        return (function(node) {
            var self = arguments.callee;

            if(node instanceof Leaf) {
                return new Leaf().insert(name);
            } else if(name < node.name) {
                return new Node(
                    node.color,
                    self.call(node, node.children[0]),
                    node.name,
                    node.children[1]).balanceLeft();
            } else if(name > node.name) {
                return new Node(
                    node.color,
                    node.children[0],
                    node.name,
                    self.call(node, node.children[1])).balanceRight();
            } else {
                return node;
            }
        })(this).blacken();
    };

    Node.prototype.contains = function(name) {
        switch(true) {
            case name < this.name:
                return this.children[0].contains(name);

            case name > this.name:
                return this.children[1].contains(name);

            case name == this.name:
                return this;

            default:
                return null;
        }
    };

    Node.prototype.size = function() {
        return this.children[0].size() + 1 + this.children[1].size();
    };

    Node.prototype.depth = function() {
        return Math.max(this.children[0].depth(), this.children[1].depth()) + 1;
    };

    Node.prototype.first = function() {
        if(this.children[0] instanceof Leaf) {
            return this;
        } else {
            return this.children[0].first();
        }
    };

    Node.prototype.last = function() {
        if(this.children[1] instanceof Leaf) {
            return this
        } else {
            return this.children[1].last();
        }
    };

    Node.prototype.blacken = function() {
        return this.copy({color: B});
    };

    Node.prototype.copy = function(/* diff */) {
        var copy = new Leaf().insert(this.name);
        diff = arguments[0] || {};

        for(var key in copy) {
            if(key in diff && copy.hasOwnProperty(key))
                copy[key] = diff[key];
            else
                copy[key] = this[key];
        }

        return copy;
    };

    Node.prototype.merge = function(node) {
        return this.fromArray(node.toArray(), this);
    };

    Node.prototype.toArray = function() {
        return this.left.toArray().concat([this.name], this.children[1].toArray());
    };

    Node.prototype.fromArray = function(array /*, acc*/) {
        return (function(index, acc) {
            var self = arguments.callee;

            if(index < array.length) {
                return self.call(acc, index + 1, acc.insert(array[index]));
            } else {
                return acc;
            }
        })(0, arguments[1] || new Leaf());
    };

    Node.prototype.toString = function() {
        return "Node(" + this.color + ", " + this.name + ")";
    };

    var Leaf = function() {
        this.color = B;
        this.children = [null,null];
        this.name = null;
        this.name = "leaf"
    };

    var F = new Function();
    F.prototype = Node.prototype
    Leaf.prototype = new F();

    Leaf.prototype.insert = function(name) {
        return new Node(R, new Leaf(), name, new Leaf());
    };

    Leaf.prototype.remove = function(name) {
        return null;
    };

    Leaf.prototype.contains = function() {
        return null;
    };

    Leaf.prototype.nodes = function() {
        return [];
    };

    Leaf.prototype.edges = function() {
        return [];
    };

    Leaf.prototype.size = function() {
        return 0;
    };

    Leaf.prototype.depth = function() {
        return 0;
    };

    Leaf.prototype.first = function() {
        return null;
    };

    Leaf.prototype.last = function() {
        return null;
    };

    Leaf.prototype.copy = function() {
        return new Leaf();
    };

    Leaf.prototype.paths = function() {
        return [];
    };

    Leaf.prototype.toArray = function() {
        return [];
    };

    Leaf.prototype.toString = function() {
        return "Leaf";
    };
})("red", "black");

rbTree.prototype.nodes = function() {
    return this.children[0].nodes().concat([this], this.children[1].nodes());
};

rbTree.prototype.edges = function() {
    var edges = [];

    if(!this.children[0].isLeaf()) {
        edges.push([this.name, this.children[0].name, "L"]);
    }

    if(!this.children[1].isLeaf()) {
        edges.push([this.name, this.children[1].name, "R"]);
    }

    return edges.concat(this.children[0].edges(), this.children[1].edges());
};

rbTree.prototype.paths = function(/* accumulation */) {
    var accumulation = arguments[0] || [],
        paths = [];

    if(!this.children[0].isLeaf()) {
        paths.push(accumulation.slice(0, -1).concat([this.name, this.children[0].name]));
    }

    if(!this.children[1].isLeaf()) {
        paths.push(accumulation.slice(0, -1).concat([this.name, this.children[1].name]));
    }

    return paths.concat(this.children[0].paths(paths[0] || []), this.children[1].paths(paths[0] || []));
};

rbTree.prototype.toDot = function() {
    var edges = this.edges(),
        nodes = this.nodes(),
        out   = [];

    for(var i = 0, j = nodes.length; i < j; i++) {
        var node = nodes[i], font = node.color == "red" ? "black" : "white";
        out.push(node.name + " [fontcolor=" + font + ",fillcolor=" + node.color + ",style=filled];");
    }

    for(var i = 0, j = edges.length; i < j; i++) {
        var edge = edges[i];
        out.push(edge[0] + " -> " + edge[1] + " [label=\"" + edge[2] + "\"];");
    }

    out.unshift("digraph G {");
    out.push("}");

    return out.join("\n");
};


/* Usage:
 *
 * var tree = new rbTree().fromArray([26, 17, 41, 10, 12, 16, 15, 30, 28, 35, 39, 47, 23, 20]);
 * tree = tree.insert(23);
 *
 * console.log(tree.toDot());
 */