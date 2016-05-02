'use strict';

d3.chart = {};

d3.chart.treeChart = function() {

  var treeData, svg, diameter, activeNode;
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

    var nodes = tree.nodes(treeData),
      links = tree.links(nodes);

    activeNode = null;

    svg.call(update, nodes, links);
  }

d3.json("./data.json", function(json) {
  treeData = json;
  treeData.x0 = height / 2;
  treeData.y0 = 0;
  function toggleAll(d) {
    if (d.children) {
      d.children.forEach(toggleAll);
      toggle(d);
    }
  }
  // Initialize the display to show a few nodes.
  treeData.children.forEach(toggleAll);
  console.log("i", treeData.children[1])
  toggle(treeData.children[1]);
  toggle(treeData.children[1].children[2]);
  toggle(treeData.children[9]);
  toggle(treeData.children[9].children[0]);
  update(treeData);
});
 
  var update = function(container, nodes, links) {
    nodes.map(function(node) {
      addIndex(node);
    });

    var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

    var linkSelection = svg.selectAll(".link").data(links, function(d) {
      return d.source.name + d.target.name + Math.random();
    });
    linkSelection.exit().remove();

    linkSelection.enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

    var nodeSelection = container.selectAll(".node").data(nodes, function(d) {
      return d.name + Math.random();
    });
    nodeSelection.exit().remove();

    var node = nodeSelection.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .on('mouseover', function(d) {
        if(activeNode !== null) {
          return;
        }
        fade(0.1)(d);
        document.querySelector('#panel').dispatchEvent(
          new CustomEvent("hoverNode", { "detail": d.name })
        );
      })
      .on('mouseout', function(d) {
        if(activeNode !== null) {
          return;
        }
        fade(1)(d);
      })
      .on('click', function(d) {
        select(d.name);

      });

    node.append("circle")
      .attr("r", function(d) { return 4.5 * (d.size || 1); })
      .style('stroke', function(d) {
        return d3.scale.linear()
          .domain([1, 0])
          .range(["steelblue", "red"])(typeof d.satisfaction !== "undefined" ? d.satisfaction : 1);
      })
      .style('fill', function(d) {
        if (typeof d.satisfaction === "undefined") return '#fff';
        return d3.scale.linear()
          .domain([1, 0])
          .range(["white", "#f66"])(typeof d.satisfaction !== "undefined" ? d.satisfaction : 1);
      }).on("click", toggle)

    node.append("text")
      .attr("dy", ".45em")
      .attr("text-anchor", function(d) { return d.x  ? "start" : "end"; })
      .attr("transform", function(d) { return d.x  ? "translate(9)" : "translate(-9)"; })
      .text(function(d) {
        return d.name;
    });
  };


  var addIndex = function(node) {
    node.index = {
      relatedNodes: []
    };
    if (node.dependents) {
      node.index.relatedNodes = node.index.relatedNodes.concat(node.dependents);
    }
  };


  var fade = function(opacity) {
    return function(node) {
      svg.selectAll(".node")
        .filter(function(d) {
          if (d.name === node.name) return false;
          return node.index.relatedNodes.indexOf(d.name) === -1;
        })
        .transition()
        .style("opacity", opacity);
    };
  };

  var select = function(name) {
    if (activeNode && activeNode.name == name) {
      unselect();
      return;
    }
    unselect();
    svg.selectAll(".node")
      .filter(function(d) {
        if (d.name === name) return true;
      })
      .each(function(d) {
        document.querySelector('#panel').dispatchEvent(
          new CustomEvent("selectNode")
        );
        d3.select(this).attr("id", "node-active");
        activeNode = d;
        fade(0.1)(d);
      });
  };
  function toggle(d) {
  if (d.name) {
    console.log(d)
    d._children = d.name;
    d.name = null;
  } else {
    d.name = d._children;
    d._children = null;
    }
  }

  var unselect = function() {
    if (activeNode == null) return;
    fade(1)(activeNode);
    d3.select('#node-active').attr("id", null);
    activeNode = null;
    document.querySelector('#panel').dispatchEvent(
      new CustomEvent("unSelectNode")
    );
  };



  chart.select = select;
  chart.unselect = unselect;

  chart.data = function(value) {
    if (!arguments.length) return treeData;
    treeData = value;
    return chart;
  };

  chart.diameter = function(value) {
    if (!arguments.length) return diameter;
    diameter = value;
    return chart;
  };

  return chart;
};
