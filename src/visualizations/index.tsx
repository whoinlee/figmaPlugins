import renderLineChart from './lineChart';
import renderSparkChart from './sparkChart';

const allowedVisualizations = ['line-chart', 'spark-chart'];
const createVectorFromRef = (refVector, keys, paths = null) => {
  const newVector = figma.createVector();

  keys.forEach((key) => (newVector[key] = refVector[key]));
  if (paths) newVector.vectorPaths = paths;

  return newVector;
};

const getFlattenedVectorNodes = (nodes) => {
  let vectorNodes = [];

  nodes.forEach((node) => {
    if (node.type !== 'TEXT') {
      const vNodes = node.findAllWithCriteria({ types: ['VECTOR'] });
      vectorNodes.push(vNodes);
    }
  });

  return vectorNodes.flat(Infinity);
};

const getUngroupedNodes = (nodes) => {
  let ungroupedNodes = [];

  function ungroupNodes(nodes) {
    nodes.forEach((node) => {
      switch (node.type) {
        case 'GROUP':
          ungroupNodes(figma.ungroup(node));
          break;
        case 'INSTANCE':
        case 'FRAME':
          //-- if these are not done here, when a child node is detached its parent node detached as well, then all the nodes ids change
          //-- no nested group
          if (node.findAllWithCriteria({ types: ['GROUP'] }).length == 0) {
            ungroupedNodes.push(node);
            break;
          }
          //-- if any nested group node, detach the current first and ungroup child group nodes
          const frameNode =
            node.type === 'INSTANCE' ? node.detachInstance() : node;
          frameNode
            .findAllWithCriteria({ types: ['GROUP'] })
            .forEach((node) => {
              figma.ungroup(node);
            });
          ungroupedNodes.push(frameNode);
          break;
        default:
        //-- 10/13/22
        // ungroupedNodes.push(node);
        //-- excludes all the other types of nodes
      }
    });
  }
  ungroupNodes(nodes);

  return ungroupedNodes;
};

const getMaxNumber = (numbers) => numbers.reduce((a, b) => Math.max(a, b));

const getMinNumber = (numbers) => numbers.reduce((a, b) => Math.min(a, b));

const getRandomNumber = (min, max, toFixed = 2) =>
  (Math.random() * (max - min) + min).toFixed(toFixed);

const getRandomPoints = (numPoints) => {
  let points = [];

  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: (i === 0 ? 0 : i + 1) * (1 / numPoints),
      y: Math.random(),
    });
  }

  return points;
};

const getRandomizedPoints = (points, randomPoints, yRangeVals = []) => {
  const pointsX = points.map((point) => point.x);
  const pointsY = points.map((point) => point.y);
  const minX = getMinNumber(pointsX);
  const minY = yRangeVals.length > 0 ? yRangeVals[0] : getMinNumber(pointsY);
  const xRange = getMaxNumber(pointsX) - minX;
  const yRange =
    yRangeVals.length > 0
      ? yRangeVals[1] - yRangeVals[0]
      : getMaxNumber(pointsY) - minY;
  return points.map((point, index) => {
    return {
      x: minX + xRange * randomPoints[index].x,
      y: minY + yRange * randomPoints[index].y,
    };
  });
};

const getSvgPathData = (points) => {
  return points.reduce(
    (acc, point, i) =>
      i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`,
    ''
  );
};

const getSvgShapeData = (points) => {
  const pointsX = points.map((point) => point.x);
  const pointsY = points.map((point) => point.y);
  const initX = points[0].x;
  const maxX = getMaxNumber(pointsX);
  const initY = points[0].y;
  const maxY = getMaxNumber(pointsY);
  return (
    getSvgPathData(points) +
    ` L ${maxX} ${maxY}` +
    ` L ${initX} ${maxY}` +
    ` L ${initX} ${initY}` +
    ` Z`
  );
};

const getVisualizationTypes = (nodes) => {
  let visualizationTypes = [];

  const vectorNodes = getFlattenedVectorNodes(nodes);
  vectorNodes.forEach((vNode) => {
    vNode.parent.name.split('/').forEach((str) => {
      if (
        allowedVisualizations.includes(str) &&
        !visualizationTypes.includes(str)
      )
        visualizationTypes.push(str);
    });
  });
  // console.log("getVisualizationTypes, visualizationTypes ", visualizationTypes);
  return visualizationTypes;
};

const renderVisualization = (selection: any[], options = null) => {
  // console.log('renderVisualization, selection? ', selection);
  figma.skipInvisibleInstanceChildren = true;

  const ungroupedNodes = getUngroupedNodes(selection);
  const visualizationTypes = getVisualizationTypes(ungroupedNodes);
  const lineChartNodes = ungroupedNodes.filter((node) =>
    node.name.split('/').includes('line-chart')
  );
  const sparkChartNodes = ungroupedNodes.filter((node) =>
    node.name.split('/').includes('spark-chart')
  );

  let count = 0;
  visualizationTypes.forEach((type) => {
    switch (type) {
      case 'line-chart':
        count++;
        renderLineChart(lineChartNodes, options);
        break;
      case 'spark-chart':
        count++;
        renderSparkChart(sparkChartNodes, options);
        break;
      default:
    }
  });

  const closingMsg =
    count === 0
      ? 'This visualization type is not currently supported!'
      : 'Successfully randomized ' + selection.length + ' visualization(s)';
  figma.notify(closingMsg);
};

const randomizeVisualization = (selection) => {
  if (selection && selection.length > 0) {
    renderVisualization(selection);
  } else {
    figma.notify('No element selected!');
  }
};

export {
  createVectorFromRef,
  getFlattenedVectorNodes,
  getMaxNumber,
  getMinNumber,
  getRandomNumber,
  getRandomPoints,
  getRandomizedPoints,
  getSvgPathData,
  getSvgShapeData,
  getUngroupedNodes,
  getVisualizationTypes,
  renderVisualization,
  randomizeVisualization,
};
