
function SplayTree() {
    this.root_ = null;
};


SplayTree.prototype.insert = function(value) {
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
        if (T.name == value){
            this.splay(T);
            return
        }; // cvor vec postoji

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

    this.splay(new_node);
}

SplayTree.prototype.delete = function(value) {
    var n=this.find(value)
    this.deleteIt(n);
}

SplayTree.prototype.deleteIt = function(n) {
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

SplayTree.prototype.find = function(value) {
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

    this.splay(T);
    return T;
}

SplayTree.prototype.splay = function(n) {
    if (n==null) return;
    if(n.parent==null) return;

    //otac je korjen
    if(n.parent.parent==null){
        if(n.parent.name> n.name) this.RightRotation(n.parent)
        else this.LeftRotation(n.parent)
    }
    //otac i sin su s iste strane
    else if(n.name< n.parent.name && n.parent.name< n.parent.parent.name){
        this.RightRotation(n.parent.parent);
        this.RightRotation(n.parent);
    }
    else if(n.name> n.parent.name && n.parent.name> n.parent.parent.name){
        this.LeftRotation(n.parent.parent);
        this.LeftRotation(n.parent);
    }
    //x je desno djete, otac je ljevo djete
    else if(n.name> n.parent.name && n.parent.name< n.parent.parent.name){
        this.LeftRotation(n.parent);
        this.RightRotation(n.parent);
    }
    //x je ljevo djete, otac je desno djete
    else if(n.name< n.parent.name && n.parent.name> n.parent.parent.name){
        this.RightRotation(n.parent);
        this.LeftRotation(n.parent);
    }
    this.splay(n);
}

SplayTree.prototype.RightRotation = function(n) {
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

SplayTree.prototype.LeftRotation = function(n) {
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
