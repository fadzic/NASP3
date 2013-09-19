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
    this.root_ = null;
};

BinarySearchTree.prototype.insert = function(value) {
    var new_node = {
        name: value,
        children:[null,null],
        parent:null
    }

    if (this.root_==null){
        new_node.color=false;
        this.root_ = new_node;
        return;
    }

    var T=this.root_;

    // pronadi mjesto gdje treba ubaciti novi cvor i njegovog roditelja
    while(T!=null){
        if (T.name == value){return}; // cvor vec postoji

        if(value < T.name){
            new_node.parent = T;
            T = T.children[0];
        }
        else{
            new_node.parent = T;
            T = T.children[1];
        }
    }

    // ubaci novi cvor na mjesto
    if (value < new_node.parent.name) new_node.parent.children[0]= new_node;
    else  new_node.parent.children[1]= new_node;
}

BinarySearchTree.prototype.delete = function(value) {
    var n=this.find(value)
    this.deleteIt(n);
}

BinarySearchTree.prototype.deleteIt = function(n) {
    if (n==null) return;

    //n je list
    if(n.children[0]==null && n.children[1]==null){
        if(n.parent!=null){
            if(n.name <= n.parent.name){
                n.parent.children[0]=null;
            }
            else{
                n.parent.children[1]=null;
            }
        }else {
            this.root_=null;
        }
    }

    //n ima samo lijevo dijete
    if(n.children[0]!=null && n.children[1]==null){
        if(n.parent!=null){
            if(n.name <= n.parent.name){
                n.parent.children[0]= n.children[0];
                n.children[0].parent= n.parent;
            }else{
                n.parent.children[1]= n.children[0];
                n.children[0].parent= n.parent;
            }
        }
        else{
            this.root_= n.children[0];
            n.children[0].parent= null;
        }
    }

    //n ima samo desno dijete
    if(n.children[0]==null && n.children[1]!=null){
        if(n.parent!=null){
            if(n.name < n.parent.name){
                n.parent.children[0]= n.children[1];
                n.children[1].parent= n.parent;
            }else{
                n.parent.children[1]= n.children[1];
                n.children[1].parent= n.parent;
            }
        }
        else{
            this.root_= n.children[1];
            n.children[1].parent= null;
        }
    }

    //n ima oba djeteta
    if(n.children[0]!=null && n.children[1]!=null){
        var sljednik=n.children[0];
        var tmp = n.children[0];

        while (tmp!=null){
            sljednik=tmp;
            tmp=tmp.children[1];
        }

        n.name=sljednik.name;

        this.deleteIt(sljednik);
    }

}

BinarySearchTree.prototype.find = function(value) {
    var T=null;
    var tmp=this.root_;
    console.log(T);

    // pronadi cvor kojeg treba obrisati
    while(tmp!=null){
        if(tmp.name==value) {
            T=tmp;
            tmp=null;
        }
        else{
            if(value < tmp.name){
                tmp = tmp.children[0];
            }
            else{
                tmp = tmp.children[1];
            }
        }
    }

    return T;
}


