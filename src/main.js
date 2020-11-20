import * as d3 from 'd3';
import { attrs } from 'd3-selection-multi';

let dim = { width: 600, height: 400 };
let svg = d3
  .select('body')
  .append('svg')
  .style('background', 'lightgrey')
  .attrs(dim)
  .on('click', clicked);

let colors = ['orange', 'teal'];
let dataset = d3.range(100).map(function () {
  return {
    r: Math.round(Math.random() * 10) + 5,
    color: colors[Math.round(Math.random())]
  };
});

let sim = d3.forceSimulation(dataset);

let nodes = svg
  .append('g')
  .selectAll('circle')
  .data(dataset)
  .enter()
  .append('circle')
  .attrs({
    r: d => d.r,
    fill: d => d.color,
    stroke: 'black'
  });

sim.on('tick', function (d) {
  nodes.attrs({
    cx: d => d.x,
    cy: d => d.y
  });
});

sim
  .force('yForce', d3.forceY(200))
  .force('center', d3.forceX(300))
  .force('right', d3.forceX(500).strength(0))
  .force('left', d3.forceX(100).strength(0))
  .force(
    'collide',
    d3.forceCollide().radius(d => d.r)
  );

sim.force('right').initialize(
  dataset.filter(function (d) {
    return d.color == 'teal';
  })
);
sim.force('left').initialize(
  dataset.filter(function (d) {
    return d.color == 'orange';
  })
);

sim.alphaDecay(0.08);
sim.velocityDecay(0.2);

let allInCenter = true;

function clicked() {
  allInCenter = !allInCenter;
  if (allInCenter) {
    sim.force('right').strength(0);
    sim.force('left').strength(0);
    sim.force('center').strength(0.1);
    sim.alpha(1).restart();
  } else {
    sim.force('right').strength(0.1);
    sim.force('left').strength(0.1);
    sim.force('center').strength(0);
    sim.alpha(1).restart();
  }
}
