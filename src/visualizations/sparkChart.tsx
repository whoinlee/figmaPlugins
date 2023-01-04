import {
  createVectorFromRef,
  getRandomPoints,
  getRandomNumber,
  getRandomizedPoints,
  getSvgPathData,
  getSvgShapeData,
} from './index';

const renderBarSparkChart = (nodes, options = null) => {};

const renderLineSparkChart = (nodes, options = null) => {
  //-- for all lineSpark instances
  nodes.forEach((node) => {
    let parentFrame = node.type === 'INSTANCE' ? node.detachInstance() : node;
    const childVectors = parentFrame.children.filter((vector) =>
      vector.name.includes('Vector')
    );
    const baseLineVectors = parentFrame.children.filter((vector) =>
      vector.name.includes('Line')
    );
    let lineVector = childVectors[0];
    let shapeVector = childVectors[1];
    if (childVectors[0].vectorPaths[0].data.endsWith('Z')) {
      //-- if the first child is a shape vector, then swap
      shapeVector = childVectors[0];
      lineVector = childVectors[1];
    }
    const vertices = lineVector.vectorNetwork.vertices;
    const randomPoints = getRandomPoints(vertices.length);
    const randomizedVertices = getRandomizedPoints(vertices, randomPoints, [
      0,
      parentFrame.height,
    ]);
    const pathLine: VectorPath = {
      windingRule: 'NONE',
      data: getSvgPathData(randomizedVertices),
    };
    const pathShape: VectorPath = {
      windingRule: 'NONE',
      data: getSvgShapeData(randomizedVertices),
    };
    const newLVector = createVectorFromRef(
      lineVector,
      ['name', 'strokes', 'strokeCap', 'strokeJoin', 'strokeWeight'],
      [pathLine]
    );
    const newSVector = createVectorFromRef(
      shapeVector,
      ['name', 'opacity', 'fills'],
      [pathShape]
    );
    lineVector.remove();
    shapeVector.remove();
    parentFrame.appendChild(newSVector);
    parentFrame.appendChild(newLVector);

    figma.group([parentFrame], parentFrame.parent);

    if (baseLineVectors && baseLineVectors.length > 0)
      baseLineVectors.forEach(
        (vector) =>
          (vector.y = Math.floor(getRandomNumber(0, newSVector.height)))
      );
  });
};

const renderSparkChart = (nodes, options = null) => {
  // console.log("INFO sparkChart.tsx :: renderSparkChart, nodes? ", nodes);

  //-- can't use this method, due to the re-rendering cases (node changed to a FRAME with no componentProperties)
  // const lineSparkChartNodes = nodes.filter(node => (node.componentProperties.type.value === "line"));
  // const barSparkChartNodes = nodes.filter(node => (node.componentProperties.type.value === "bar"));

  const lineSparkChartNodes = nodes.filter(
    (node) =>
      node.children.filter((node) =>
        node.name.split('/').includes('column-and-bar-chart')
      ).length == 0
  );
  if (lineSparkChartNodes.length > 0)
    renderLineSparkChart(lineSparkChartNodes, options);

  // const barSparkChartNodes = nodes.filter(node =>
  //     (node.children.filter(node => node.name.split('/').includes('column-and-bar-chart'))).length > 0
  // );
  // if (barSparkChartNodes.length > 0) renderBarSparkChart(barSparkChartNodes, options);
};

export default renderSparkChart;
