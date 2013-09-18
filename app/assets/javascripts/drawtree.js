
var drawTree = function(where) {
    this.width = 500 ;
    this.height = 500 ;

    var mask = where.replace(/#/gi,"")
    var canvas = d3.select(where)
        .append("svg")
        .attr('width', this.width)
        .attr('height',this.height)
        .append('g')
        .attr('transform','translate(50,50)');

    var tree = d3.layout.tree()
        .size([this.width-100,this.height-100]);

    var diagonal = d3.svg.diagonal();

    this.draw = function(d,where) {
        var data =  d

        
        d3.select(where).select('svg').remove();

        canvas = d3.select(where)
                .append("svg")
                .attr('width', this.width)
                .attr('height',this.height)
                .append('g')
                .attr('transform','translate(50,50)');

        tree = d3.layout.tree()
                .size([this.width-100,this.height-100]);

        var nodes = tree.nodes(data);
        var links = tree.links(nodes);

        var node = canvas.selectAll('.node')
                .data(nodes)
                .enter()
                .append('g')
                .attr('id', function(d){
                        if(d.name){return 'node'}
                        return 'corak'
                    })
                .attr('transform', function(d){
                    if(d.parent){
                        return 'translate('+ d.parent.x + ',' + d.parent.y + ')';
                    }
                    return 'translate('+ d.x + ',' + d.y + ')';
                })

        canvas.selectAll('#node')
            .append('circle')
            .attr('r', 10)
            .attr('fill',function(d){
                if (d.color){
                    return 'red' ;
                }else
                {
                    return "black";
                }

            });


        node.append('text')
                .text(function(d){return d.name;})
                    .attr('x','15')
                    .attr('y','0')

        node.transition()
                .duration(1000)
                .attr('transform',function(d){return 'translate('+ d.x + ',' + d.y + ')';})
                .each('end',function(){
                    canvas.selectAll('.link')
                            .data(links)
                            .enter()
                            .append('path')
                            .attr('id',function(d){
                                if(d.target.children){return 'dobar'}
                                return 'coraklinija'
                            })
                            .attr('class','link')
                            .attr('fill','none')
                            .attr('stroke','black')
                            .attr('d',diagonal);

                    canvas.selectAll('#corak').remove()
                    canvas.selectAll('path#coraklinija.link').remove()
                })


    }
}