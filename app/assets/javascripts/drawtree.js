

function init(){
    width = 500 ;
    height = 500 ;


    canvas = d3.select('#canvas')
        .append('svg')
        .attr('width', width)
        .attr('height',height)
        .append('g')
        .attr('transform','translate(50,50)');

    tree = d3.layout.tree()
        .size([width-100,height-100]);



    diagonal = d3.svg.diagonal();

}

function addNode(){
    restart();
}

function draw(d) {
    data =  d


    d3.select("svg").remove();

    canvas = d3.select('#canvas')
            .append('svg')
            .attr('width', width)
            .attr('height',height)
            .append('g')
            .attr('transform','translate(50,50)');

    tree = d3.layout.tree()
            .size([width-100,height-100]);

    nodes = tree.nodes(data);
    links = tree.links(nodes);

    node = canvas.selectAll('.node')
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


/*
   node.append('circle')
            .attr('r', 10)
            .attr('fill',function(d){
                if (d.color){
                    return d.color ;
                }else
                {
                    return "black";
                }

            });*/

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