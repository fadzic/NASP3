function RedBlackTree(){
    this.root_=null;
};

RedBlackTree.prototype.insert = function(value) {
    var new_node = {
        name: value,
        children:[null,null],
        color:true, //is red?
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

    this.insert_fix(new_node);
}

RedBlackTree.prototype.insert_fix = function(nn) {
    var stric = null;

    //scenarij 2 (otac i stric crveni)
    if(nn.parent.color!=false){

        //otac je lijevo djete
        if (nn.parent.name<nn.parent.parent.name){
            stric = nn.parent.parent.children[1];
        }

        //otac je desno djete
        if (nn.parent.name>nn.parent.parent.name){
            stric = nn.parent.parent.children[0];
        }

        //stric je crven
        if(stric!=null){
            if(stric.color){
                //oboji oca i strica crno, a djeda crveno
                nn.parent.color=false;
                stric.color=false;
                nn.parent.parent.color=true;
            }
        }
        //stric je crn
        else
        {
            //scenarij 3: x je lijevo/desno dijete, dok je otac desno/lijevo dijete
            if(nn.name < nn.parent.name && nn.parent.name>nn.parent.parent.name){
                //oboji djeda crveno, a x crno
                nn.color=false;
                nn.parent.parent.color=true;

                this.RightRotation(nn.parent);
                this.LeftRotation(nn.parent);

            }
            else if(nn.name > nn.parent.name && nn.parent.name<nn.parent.parent.name){
                //oboji djeda crveno, a x crno
                nn.color=false;
                nn.parent.parent.color=true;

                this.LeftRotation(nn.parent);
                this.RightRotation(nn.parent);
            }
            //scenarij 4: x je lijevo/desno dijete i otac je lijevo/desno dijete
            else if(nn.name < nn.parent.name && nn.parent.name<nn.parent.parent.name){
                //oboji oca crno, a djeda crveno
                nn.parent.color=false;
                nn.parent.parent.color=true;
                this.RightRotation(nn.parent.parent);
            }else if(nn.name > nn.parent.name && nn.parent.name>nn.parent.parent.name){
                //oboji oca crno, a djeda crveno
                nn.parent.color=false;
                nn.parent.parent.color=true;
                this.LeftRotation(nn.parent.parent);
            }
        }

    }
    this.root_.color=false;
}

RedBlackTree.prototype.delete = function(value) {
    if (this.root_==null) return;

    var T=this.root_;

    // pronadi cvor kojeg treba obrisati
    while(T.name!=value){
        if(value < T.name){
            T = T.children[0];
        }
        else{
            T = T.children[1];
        }
    }

    if (T==null) return;

    var y=null;
    if (T.children[0] == null || T.children[1] == null) {
        y = T;
    } else {
        y = this.getSuccessor(T);
        console.log(y);
    }

    var x=null;
    if (y.children[0] != null) {
        x = y.children[0];
    } else {
        x = y.children[1];
        console.log('x=')
        console.log(x)
    }
    if (x != null) {
        x.parent = y.parent;
    }
    var xParent = y.parent;

    var yIsLeft = false;
    if (y.parent == null) {
        this.root_ = x;
    } else if (y.name == y.parent.children[0].name) {
        y.parent.children[0] = x;
        yIsLeft = true;
    } else {
        y.parent.children[1] = x;
        yIsLeft = false;
    }

    if (y != T) {
        T.name = y.name;
    }

    if (!y.color) {
        console.log([x], [xParent],[yIsLeft])

        if (x==null){
            var leaf_node = {
                name: null,
                children:[null,null],
                color:false, //is red?
                parent:xParent
            }
            x=leaf_node;
        }
        this.deleteFixUp(x, xParent, yIsLeft);
    }

    return y;
}

RedBlackTree.prototype.isRed=function(x){
    if (x==null) return false;
    return x.color;
}

RedBlackTree.prototype.isBlack=function(x){
    if (x==null) return true;
    return x.color;
}

RedBlackTree.prototype.deleteFixUp = function(node, nodeParent, nodeIsLeft) {

    while (node != this.root_ && this.isBlack(node)) {
        var w;
        if (nodeIsLeft) {
            w = nodeParent.children[1];
            if (this.isRed(w)) {
                w.color = false;
                nodeParent.color = true;
                this.LeftRotation(nodeParent);
                w = nodeParent.children[1];
            }

            if (this.isBlack(w.children[0]) && this.isBlack(w.children[1])) {
                w.color = true;
                node = nodeParent;
                nodeParent = node.parent;
                nodeIsLeft = (node == nodeParent.children[0]);
            } else {
                if (this.isBlack(w.children[1])) {
                    w.children[0].color = false;
                    w.color = true;
                    this.RightRotation(w);
                    w = nodeParent.children[1];
                }

                w.color = nodeParent.color;
                nodeParent.color = false;
                if (w.children[1] != null) {
                    w.children[1].color = false;
                }
                this.LeftRotation(nodeParent);
                node = this.root_
                nodeParent = null;
            }
        } else { /* nodeIsLeft == false */
            w = nodeParent.children[0];
            if (this.isRed(w)) {
                w.color = false;
                nodeParent.color = true;
                this.RightRotation(nodeParent);
                w = nodeParent.children[0];
            }

            if (this.isBlack(w.children[1]) && this.isBlack(w.children[0])) {
                w.color = true;
                node = nodeParent;
                nodeParent = node.parent;
                nodeIsLeft = (node == nodeParent.children[0]);
            } else {
                if (this.isBlack(w.children[0])) {
                    w.children[1].color = false;
                    w.color = true;
                    this.LeftRotation(w);
                    w = nodeParent.children[0];
                }

                w.color = nodeParent.color;
                nodeParent.color = false;
                if (w.children[0] != null) {
                    w.children[0].color = false;
                }
                this.RightRotation(nodeParent);
                node = this.root_;
                nodeParent = null;
            }
        }
    }

    node.color = false;

}

RedBlackTree.prototype.BINdelete = function(n) {
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
        n.color=sljednik.color;

        this.BINdelete(sljednik);
    }

}

RedBlackTree.prototype.getSuccessor = function(n) {
    var sljednik=n.children[0];
    var tmp = n.children[0];

    while (tmp!=null){
        sljednik=tmp;
        tmp=tmp.children[1];
    }

    return sljednik;
}

RedBlackTree.prototype.RightRotation = function(n) {
    var p = n.children[0];

    if (n.parent !=null){
        if(n.parent.name> n.name) n.parent.children[0] = p;
        else n.parent.children[1] = p;
        p.parent= n.parent;
    }
    else {
        this.root_= p;
        p.parent = null;
    }

    n.children[0]= p.children[1];
    if(n.children[0]) n.children[0].parent=n;

    p.children[1]=n;
    n.parent=p;
}

RedBlackTree.prototype.LeftRotation = function(n) {
    var p = n.children[1];

    if (n.parent !=null){
        if(n.parent.name> n.name) n.parent.children[0] = p;
        else n.parent.children[1] = p;
        p.parent= n.parent;
    }
    else {
        this.root_= p;
        p.parent = null;
    }

    n.children[1]= p.children[0];
    if(n.children[1]) n.children[1].parent=n;

    p.children[0]=n;
    n.parent=p;
}