'use strict';

d3.chart = d3.chart || {};

d3.chart.architectureTree = function() {

  var svg, tree, treeData, diameter, activeNode;
  var height = 900;
  var width = 700;

  
  function chart(){
    if (typeof(tree) === 'undefined') {
      tree = d3.layout.tree()
        .size([height, width - 160])

      svg = d3.select("#graph").append("svg")
        .attr("width", width)
        .attr("height", height )
        .append("g")
        .attr("transform", "translate(40, 0)");
    }

    var nodes = tree.nodes(treeData),
      links = tree.links(nodes);

    activeNode = null;

    svg.call(updateData, nodes, links);
  }

 
  var updateData = function(container, nodes, links) {
    addDependents(nodes);
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
      });

    node.append("text")
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x  ? "start" : "end"; })
      .attr("transform", function(d) { return d.x  ? "translate(8)" : "rotate(180)translate(-8)"; })
      .text(function(d) {
        return d.name;
    });
  };

  var addDependents = function(nodes) {
    var dependents = [];
    nodes.forEach(function(node) {
      if (node.dependsOn) {
        node.dependsOn.forEach(function(dependsOn) {
          if (!dependents[dependsOn]) {
            dependents[dependsOn] = [];
          }
          dependents[dependsOn].push(node.name);
        });
      }
    });
    nodes.forEach(function(node, index) {
      if (dependents[node.name]) {
        nodes[index].dependents = dependents[node.name];
      }
    });
  };


  var addIndex = function(node) {
    node.index = {
      relatedNodes: [],
      technos: [],
      hosts: []
    };
    var dependsOn = getDetailCascade(node, 'dependsOn');
    if (dependsOn.length > 0) {
      node.index.relatedNodes = node.index.relatedNodes.concat(dependsOn);
    }
    if (node.dependents) {
      node.index.relatedNodes = node.index.relatedNodes.concat(node.dependents);
    }
    var technos = getDetailCascade(node, 'technos');
    if (technos.length > 0) {
      node.index.technos = technos;
    }
    var hosts = getHostsCascade(node);
    if (hosts.length > 0) {
      node.index.hosts = hosts;
    }
  };

  var getDetailCascade = function(node, detailName) {
    var values = [];
    if (node[detailName]) {
      node[detailName].forEach(function(value) {
        values.push(value);
      });
    }
    if (node.parent) {
      values = values.concat(getDetailCascade(node.parent, detailName));
    }
    return values;
  };

  var getHostsCascade = function(node) {
    var values = [];
    if (node.host) {
      for (var i in node.host) {
        values.push(i);
      }
    }
    if (node.parent) {
      values = values.concat(getHostsCascade(node.parent));
    }
    return values;
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

  var unselect = function() {
    if (activeNode == null) return;
    fade(1)(activeNode);
    d3.select('#node-active').attr("id", null);
    activeNode = null;
    document.querySelector('#panel').dispatchEvent(
      new CustomEvent("unSelectNode", { "detail": d.name })
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
