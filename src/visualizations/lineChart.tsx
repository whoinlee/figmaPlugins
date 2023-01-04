import {
  createVectorFromRef,
  getFlattenedVectorNodes,
  getRandomPoints,
  getRandomizedPoints,
  getSvgPathData,
} from './index';

const renderLineChartWithOptions = (
  nodes,
  { dataSets = null, metric = null, timeType, timeStart, timeEnd }
) => {};

const renderLineChartWithRandomPoints = (nodes) => {
  // console.log("INFO lineChart.tsx :: renderLineChartWithRandomPoints, nodes? ", nodes)

  //-- find lineChart vectors only
  const lineChartVectors = getFlattenedVectorNodes(nodes).filter((i) =>
    i.parent.name.split('/').includes('line-chart')
  );

  let nodesToGroup = [];
  let parentNodesToGroup = null;
  //-- for all line-chart vectorNodes
  lineChartVectors.forEach((node) => {
    let parentNode = node.parent;
    const vertices = node.vectorNetwork.vertices;
    const randomPoints = getRandomPoints(vertices.length);
    const randomizedVertices = getRandomizedPoints(vertices, randomPoints, [
      0,
      parentNode.height,
    ]);
    const path: VectorPath = {
      windingRule: 'NONE',
      data: getSvgPathData(randomizedVertices),
    };

    //-- create a new VectorNode
    //-- bc, "node.vectorPaths = [path]" doesn't work as 'vectorPaths' is read-only
    const newVector = createVectorFromRef(
      node,
      ['name', 'strokes', 'strokeCap', 'strokeJoin', 'strokeWeight'],
      [path]
    );

    //-- if a holder node is an INSTANCE, can't remove its child nodes
    if (parentNode.type === 'INSTANCE') {
      parentNode = parentNode.detachInstance();
    }
    //-- can't do 'node.remove()' since node changed its id on detaching its parent
    parentNode.children[0].remove();
    parentNode.appendChild(newVector);

    //-- Nov/15/22
    //-- as parentNode's id has been changed on being detached
    // parentNode = parentNode.children[0].parent;
    // parentNode.remove();
    // const testFrame = figma.createFrame();
    // testFrame.appendChild(newVector);

    //-- re-group detached frames, to hide frame name on canvas
    if (parentNode.parent) {
      if (parentNodesToGroup && parentNodesToGroup !== parentNode.parent) {
        //-- group all the previous nodes
        figma.group(nodesToGroup, parentNodesToGroup);
        //-- then reset
        nodesToGroup = [];
      }
      parentNodesToGroup = parentNode.parent;
      nodesToGroup.push(parentNode);
    } else if (nodesToGroup.length > 0) {
      figma.group(nodesToGroup, parentNodesToGroup);
      nodesToGroup = [];
      parentNodesToGroup = null;
    }
  });

  //-- re-group detached frames
  if (parentNodesToGroup && nodesToGroup.length > 0) {
    figma.group(nodesToGroup, parentNodesToGroup);
    //-- then, group the current parentNodesToGroup itself, if it's a FRAME node
    //-- to remove a frame name on the canvas
    if (parentNodesToGroup.type === 'FRAME' && parentNodesToGroup.parent)
      figma.group([parentNodesToGroup], parentNodesToGroup.parent);
  }
};

const renderLineChart = (nodes, options = null) => {
  if (options) renderLineChartWithOptions(nodes, options);
  else renderLineChartWithRandomPoints(nodes);
};

export default renderLineChart;
