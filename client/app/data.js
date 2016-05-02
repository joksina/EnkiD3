'use strict';

d3.chart = {};

d3.chart.treeChart = function() {

  var root, svg, diameter, active;
  var height = 800;
  var width = 700;

  
  function chart(){
    var tree = d3.layout.tree()
      .size([height, width - 160])

    svg = d3.select("#graph").append("svg")
      .attr("width", width)
      .attr("height", height )
      .append("g")
      .attr("transform", "translate(40, 0)");

    var nodes = tree.nodes(root),
      links = tree.links(nodes);

    active = null;

    svg.call(update, nodes, links);
  }
 
  var update = function(container, nodes, links) {
    
    var diagonal = d3.svg.diagonal()
      .projection(function(d) {
        return [d.y, d.x];
      });

    var selectLink = svg.selectAll(".link").data(links, function(d) {
      return d.source.name + d.target.name + Math.random();
    });
    selectLink.exit().remove();

    selectLink.enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

    var selectNode = container.selectAll(".node").data(nodes, function(d) {
      return d.name + Math.random();
    });
    selectNode.exit().remove();

    var node = selectNode.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .on('mouseover', function(d) {
        if(active) {
          return;
        }
        fade(0.1)(d);
        document.querySelector('#panel').dispatchEvent(
          new CustomEvent("hover", { "detail": d.name })
        );
      }).on('mouseout', function(d) {
        if(active) {
          return;
        }
        fade(1)(d);
      }).on('click', function(d) {
        select(d.name);
      });

      node.append("circle")
        .attr("r", 5)
        .style('stroke', "steelblue")
        .style('fill', "white");

      node.append("text")
        .attr("dy", ".45em")
        .attr("text-anchor", function(d) { return d.x  ? "start" : "end"; })
        .attr("transform", function(d) { return d.x  ? "translate(9)" : "translate(-9)"; })
        .text(function(d) {
          return d.name;
      });

    nodes.map(function(node) {
      index(node);
    });
  };

  var index = function(node) {
    node.index = {
      likeNode: []
    };    
    node.index.likeNode = node.index.likeNode.concat(node);   
  };

  var fade = function(opacity) {
    return function(node) {
      svg.selectAll(".node")
        .filter(function(d) {
          if (d.name === node.name) return false;
          return node.index.likeNode.indexOf(d.name) === -1;
        })
        .transition()
        .style("opacity", opacity);
    };
  };

  var select = function(name) {
    if (active && active.name == name) {
      unselect();
      return;
    }
    svg.selectAll(".node")
      .filter(function(d) {
        if (d.name === name) return true;
      }).each(function(d) {
        document.querySelector('#panel').dispatchEvent(
          new CustomEvent("selectNode"));
        d3.select(this).attr("id", "node-active");
        active = d;
        fade(0.1)(d);
      });
  };

  var unselect = function() {
    if (!active) return;
    fade(1)(active);
    d3.select('#node-active').attr("id", null);
    active = null;
    document.querySelector('#panel').dispatchEvent(
      new CustomEvent("unSelectNode")
    );
  };

  chart.select = select;
  chart.unselect = unselect;

  chart.data = function(value) {
    if (!arguments.length) return root;
    root = value;
    return chart;
  };

  chart.diameter = function(value) {
    if (!arguments.length) return diameter;
    diameter = value;
    return chart;
  };

  return chart;
};
