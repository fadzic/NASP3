var RedBlackTree = function() { this.initialize.apply(this, arguments); };

RedBlackTree.prototype = {
    initialize: function(opts) {
        if (typeof opts == 'undefined')
            opts = {};

        this.c = opts['comparator'] ?
            opts['comparator']:
            function(l, r) { return l.name < r.name ? -1: (l.name > r.name ? 1: 0); };
        if (opts['accessors']) {
            this.gp = opts['accessors']['parent']['get'];
            this.sp = opts['accessors']['parent']['set'];
            this.gl = opts['accessors']['left']['get'];
            this.sl = opts['accessors']['left']['set'];
            this.gr = opts['accessors']['right']['get'];
            this.sr = opts['accessors']['right']['set'];
            this.gc = opts['accessors']['color']['get'];
            this.sc = opts['accessors']['color']['set'];
        } else {
            this.gp = function(i) { return i.p; };
            this.sp = function(i, v) { i.p = v; };
            this.gl = function(i) {
                if(typeof i.children == 'undefined'){
                    return null;
                }
                return i.children[0];
            };
            this.sl = function(i, v) {
                if(typeof i.children == 'undefined'){
                    i.children=[v,null]
                }
                else{
                    i.children[0]=v
                }
            };
            this.gr = function(i) {
                if(typeof i.children == 'undefined'){
                    return null;
                }
                return i.children[1];
            };
            this.sr = function(i, v) {
                if(typeof i.children == 'undefined'){
                    i.children=[null,v]
                }
                else{
                    i.children[1]=v
                }
            };
            this.gc = function(i) { return i.color; };
            this.sc = function(i, v) { i.color = v; };
        }

    },

    put: function(nn) {
        var np = null, _n = this.root, c = 0, h = 0;
        while (_n != null) {
            np = _n;
            c = this.c(_n, nn);
            if (c == 0) {
                var _np = this.gp(np), _nl = this.gl(np), _nr = this.gr(np);
                this.sp(nn, _np);
                this.sl(nn, _nl);
                this.sr(nn, _nr);
                if (_nl != null)
                    this.sp(_nl, nn);
                if (_nr != null)
                    this.sp(_nr, nn);
                if (_np != null) {
                    if (h < 0) {
                        this.sr(_np, nn);
                    } else {
                        this.sl(_np, nn);
                    }
                }
                return false;
            } else if (c < 0) {
                _n = this.gr(_n);
            } else if (c > 0) {
                _n = this.gl(_n);
            }
            h = c;
        }

        this.sc(nn, true);
        this.sp(nn, np);
        this.sl(nn, null);
        this.sr(nn, null);

        if (np == null) {
            this.sc(nn, false);
            this.root = nn;
            return true;
        } else {
            if (c < 0)
                this.sr(np, nn);
            else
                this.sl(np, nn);
        }

        var ni = nn;

        while (this.gc(np)) {
            var g = this.gp(np);
            if (this.gl(g) == np) {
                var u = this.gr(g), gg = this.gp(g);
                if (u == null || !this.gc(u)) {
                    // if the uncle is null or black, perform the right rotate
                    if (c < 0) {
                        this.sl(g, this.gr(ni));
                        if (this.gr(ni) != null)
                            this.sp(this.gr(ni), g);
                        this.sr(np, this.gl(ni));
                        if (this.gl(ni) != null)
                            this.sp(this.gl(ni), np);
                        this.sl(ni, np), this.sp(np, ni);
                        this.sr(ni, g), this.sp(g, ni), this.sc(g, true);
                        this.sp(ni, gg), this.sc(ni, false);
                        if (gg != null) {
                            if (this.gl(gg) == g)
                                this.sl(gg, ni);
                            else
                                this.sr(gg, ni);
                        } else {
                            this.root = ni;
                            break;
                        }
                        ni = np, np = this.gp(np);
                    } else {
                        this.sl(np, ni), this.sc(ni, true);
                        this.sl(g, this.gr(np));
                        if (this.gr(np) != null)
                            this.sp(this.gr(np), g);
                        this.sr(np, g), this.sp(g, np), this.sc(g, true);
                        this.sp(np, gg), this.sc(np, false);
                        if (gg != null) {
                            if (this.gl(gg) == g)
                                this.sl(gg, np);
                            else
                                this.sr(gg, np);
                        } else {
                            this.root = np;
                            break;
                        }
                    }
                    g = gg;
                    c = 1;
                } else {
                    // recolor the parent and the uncle if they are both red.
                    this.sc(np, false), this.sc(u, false);
                    if (gg == null) {
                        this.sc(g, false);
                        break;
                    }
                    this.sc(g, true);
                    if (this.gl(gg) == g)
                        c = 1;
                    else
                        c = -1;
                    ni = g;
                    np = gg;
                }
            } else {
                var u = this.gl(g), gg = this.gp(g);
                if (u == null || !this.gc(u)) {
                    // if the uncle is null, perform the left rotate
                    var gg = this.gp(g);
                    if (c < 0) {
                        this.sr(g, this.gl(np));
                        if (this.gl(np) != null)
                            this.sp(this.gl(np), g);
                        this.sl(np, g), this.sp(g, np), this.sc(g, true);
                        this.sr(np, ni), this.sc(ni, true);
                        this.sp(np, gg), this.sc(np, false);
                        if (gg != null) {
                            if (this.gl(gg) == g)
                                this.sl(gg, np);
                            else
                                this.sr(gg, np);
                        } else {
                            this.root = np;
                            break;
                        }
                    } else {
                        this.sr(g, this.gl(ni));
                        if (this.gl(ni) != null)
                            this.sp(this.gl(ni), g);
                        this.sl(np, this.gr(ni));
                        if (this.gr(ni) != null)
                            this.sp(this.gr(ni), np);
                        this.sl(ni, g), this.sp(g, ni), this.sc(g, true);
                        this.sr(ni, np), this.sp(np, ni);
                        this.sp(ni, gg), this.sc(ni, false);
                        if (gg != null) {
                            if (this.gl(gg) == g)
                                this.sl(gg, ni);
                            else
                                this.sr(gg, ni);
                        } else {
                            this.root = ni;
                            break;
                        }
                        ni = np, np = this.gp(np);
                    }
                    g = gg;
                    c = -1;
                } else {
                    // recolor the parent and the uncle if they are both red.
                    this.sc(np, false), this.sc(u, false);
                    if (gg == null) {
                        this.sc(g, false);
                        break;
                    }
                    this.sc(g, true);
                    if (this.gl(gg) == g)
                        c = 1;
                    else
                        c = -1;
                    ni = g;
                    np = gg;
                }
            }
        }
        return true;
    },

    remove: function(v) {
        var n = this.root, c = 0, h = 0;
        while (n != null) {
            c = this.c(n, v);
            if (c == 0) {
                break;
            } else if (c < 0) {
                n = this.gr(n);
            } else if (c > 0) {
                n = this.gl(n);
            }
            h = c;
        }

        if (n == null) {
            return false;
        }

        var np = null;
        while (n != null) {
            np = this.gp(n);
            var nl = this.gl(n), nr = this.gr(n), nc = this.gc(n), hh = 0;
            if (nl != null && this.gr(nl) != null) {
                var ngcr = this.gr(nl);
                hh = -1;
                for (; this.gr(ngcr) != null; ngcr = this.gr(ngcr));

                if (this.gl(ngcr) != null)
                    this.sp(this.gl(ngcr), n);
                if (this.gr(ngcr) != null)
                    this.sp(this.gr(ngcr), n);
                if (this.gl(n) != null)
                    this.sp(this.gl(n), ngcr);
                if (this.gr(n) != null)
                    this.sp(this.gr(n), ngcr);
                this.sl(n, this.gl(ngcr));
                this.sr(n, this.gr(ngcr));
                this.sp(n, this.gp(ngcr));
                this.sc(n, this.gc(ngcr));
                this.sr(this.gp(ngcr), n);
                this.sl(ngcr, nl);
                this.sr(ngcr, nr);
                this.sp(ngcr, np);
                this.sc(ngcr, nc);
                if (np != null) {
                    if (h < 0)
                        this.sr(np, ngcr);
                    else
                        this.sl(np, ngcr);
                } else {
                    this.root = ngcr;
                }
            } else if (nr != null && this.gl(nr) != null) {
                var ngcl = this.gl(nr);
                hh = 1;
                for (; this.gl(ngcl) != null; ngcl = this.gl(ngcl));

                if (this.gl(ngcl) != null)
                    this.sp(this.gl(ngcl), n);
                if (this.gr(ngcl) != null)
                    this.sp(this.gr(ngcl), n);
                if (this.gl(n) != null)
                    this.sp(this.gl(n), ngcl);
                if (this.gr(n) != null)
                    this.sp(this.gr(n), ngcl);
                this.sl(n, this.gl(ngcl));
                this.sr(n, this.gr(ngcl));
                this.sp(n, this.gp(ngcl));
                this.sc(n, this.gc(ngcl));
                this.sl(this.gp(ngcl), n);
                this.sl(ngcl, nl);
                this.sr(ngcl, nr);
                this.sp(ngcl, np);
                this.sc(ngcl, nc);
                if (np != null) {
                    if (h < 0)
                        this.sr(np, ngcl);
                    else
                        this.sl(np, ngcl);
                } else {
                    this.root = ngcl;
                }
            } else {
                break;
            }
            h = hh;
        }

        var s = null;
        if (nl != null) {
            if (nr != null)
                this.sp(nr, nl);
            this.sp(nl, np), this.sr(nl, nr);
            if (np != null) {
                if (h < 0)
                    this.sr(np, nl);
                else
                    this.sl(np, nl);
            } else {
                this.root = nl;
            }
            np = nl, nl = this.gl(np), s = nr, nr = null;
            h = 1;
        } else if (nr != null) {
            this.sp(nr, np), this.sl(nr, nl);
            if (np != null) {
                if (h < 0)
                    this.sr(np, nr);
                else
                    this.sl(np, nr);
            } else {
                this.root = nr;
            }
            np = nr, nr = this.gr(np), s = nl, nl = null;
            h = -1;
        } else {
            if (np != null) {
                if (h < 0) {
                    this.sr(np, null);
                    s = this.gl(np);
                } else {
                    this.sl(np, null);
                    s = this.gr(np);
                }
            } else {
                this.root = nl != null ? nl: nr;
                if (this.root != null) {
                    this.sc(this.root, false);
                    this.sp(this.root, null);
                }
            }
        }

        for (;;) {
            if (np != null) {
                if (nc)
                    break;

                var g = this.gp(np), npc = this.gc(np);
                if (s == null) {
                    if (npc)
                        this.sc(np, false);
                    break;
                }

                if (h < 0) {
                    if (this.gc(s)) {
                        if (this.gr(s) != null)
                            this.sp(this.gr(s), np);
                        this.sl(np, this.gr(s));
                        this.sc(np, true), npc = true;
                        this.sp(np, s), this.sr(s, np);
                        this.sp(s, g), this.sc(s, false);
                        if (g != null) {
                            if (this.gl(g) == np)
                                this.sl(g, s);
                            else
                                this.sr(g, s);
                        } else {
                            this.root = s;
                        }
                        g = s;
                        s = this.gl(np);
                    }

                    if (s == null)
                        break;

                    var slc = this.gl(s) != null ? this.gc(this.gl(s)): false,
                        src = this.gr(s) != null ? this.gc(this.gr(s)): false;
                    if (src) {
                        var srl = this.gl(this.gr(s));
                        if (srl != null)
                            this.sp(srl, s);
                        this.sl(np, this.gr(s));
                        this.sp(this.gr(s), np);
                        this.sc(this.gr(s), false);
                        this.sp(s, this.gl(np));
                        this.sr(s, this.gl(this.gl(np)));
                        this.sl(this.gl(np), s);
                        this.sc(s, true);
                        s = this.gl(np);
                        slc = this.gl(s) != null ? this.gc(this.gl(s)): false;
                        src = this.gr(s) != null ? this.gc(this.gr(s)): false;
                    } else {
                        if (!slc) {
                            if (npc) {
                                this.sc(np, false);
                                this.sc(s, true);
                            } else {
                                this.sc(s, true);
                                if (g != null) {
                                    if (this.gl(g) == np) {
                                        h = 1;
                                        s = this.gr(g);
                                    } else {
                                        h = -1;
                                        s = this.gl(g);
                                    }
                                }
                                nl = this.gl(np), nr = this.gr(np), n = np, nc = this.gc(np);
                                np = g;
                                continue;
                            }
                        }
                    }

                    if (slc) {
                        this.sc(this.gl(s), false);
                        if (this.gr(s) != null)
                            this.sp(this.gr(s), np);
                        this.sl(np, this.gr(s));
                        this.sp(np, s);
                        this.sr(s, np);
                        this.sc(np, this.gc(s));
                        this.sp(s, g);
                        this.sc(s, npc);
                        if (g != null) {
                            if (this.gl(g) == np)
                                this.sl(g, s);
                            else
                                this.sr(g, s);
                        } else {
                            this.root = s;
                        }
                    }
                } else {
                    if (this.gc(s)) {
                        if (this.gl(s) != null)
                            this.sp(this.gl(s), np);
                        this.sr(np, this.gl(s));
                        this.sc(np, true), npc = true;
                        this.sp(np, s), this.sl(s, np);
                        this.sp(s, g), this.sc(s, false);
                        if (g != null) {
                            if (this.gl(g) == np)
                                this.sl(g, s);
                            else
                                this.sr(g, s);
                        } else {
                            this.root = s;
                        }
                        g = s;
                        s = this.gr(np);
                    }

                    if (s == null)
                        break;

                    var slc = this.gl(s) != null ? this.gc(this.gl(s)): false,
                        src = this.gr(s) != null ? this.gc(this.gr(s)): false;
                    if (slc) {
                        var slr = this.gr(this.gl(s));
                        if (slr)
                            this.sp(slr, s);
                        this.sr(np, this.gl(s));
                        this.sp(this.gl(s), np);
                        this.sc(this.gl(s), false);
                        this.sp(s, this.gr(np));
                        this.sl(s, this.gr(this.gr(np)));
                        this.sr(this.gr(np), s);
                        this.sc(s, true);
                        s = this.gr(np);
                        slc = this.gl(s) != null ? this.gc(this.gl(s)): false,
                            src = this.gr(s) != null ? this.gc(this.gr(s)): false;
                    } else {
                        if (!src) {
                            if (npc) {
                                this.sc(np, false);
                                this.sc(s, true);
                            } else {
                                this.sc(s, true);
                                if (g != null) {
                                    if (this.gl(g) == np) {
                                        h = 1;
                                        s = this.gr(g);
                                    } else {
                                        h = -1;
                                        s = this.gl(g);
                                    }
                                }
                                nl = this.gl(np), nr = this.gr(np), n = np, nc = this.gc(np);
                                np = g;
                                continue;
                            }
                        }
                    }

                    if (src) {
                        this.sc(this.gr(s), false);
                        if (this.gl(s) != null)
                            this.sp(this.gl(s), np);
                        this.sr(np, this.gl(s));
                        this.sp(np, s);
                        this.sl(s, np);
                        this.sc(np, this.gc(s));
                        this.sp(s, g);
                        this.sc(s, npc);
                        if (g != null) {
                            if (this.gl(g) == np)
                                this.sl(g, s);
                            else
                                this.sr(g, s);
                        } else {
                            this.root = s;
                        }
                    }
                }
            }
            break;
        }

        return true;
    },

    find: function(id){
        var found       = false,
            parent      = null,
            current     = this.root

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
