/**
 * Created by OXOYO on 2019/8/7.
 *
 * TODO 折线寻径
 *
 * 文档：https://www.yuque.com/antv/blog/eyi70n
 */

// import PF from 'pathfinding'

// 折线寻径
const polylineFinding (sNode, tNode, sPort, tPort, offset = 10) {
  // 获取节点带 offset 的区域（扩展区域）
  const sBBox = getExpandedBBox(sNode, offset)
  const tBBox = getExpandedBBox(tNode, offset)
  // 获取扩展区域上的起始和终止连接点
  const sPoint = getExpandedPort(sNode, sPort, offset)
  const tPoint = getExpandedPort(tNode, tPort, offset)
  // 获取合法折点集
  points = getConnectablePoints(sBBox, tBBox, sPoint, tPoint)
  // 过滤合法点集，预处理、剪枝等
  filterConnectablePoints(points, sBBox)
  // 过滤合法点集，预处理、剪枝等
  filterConnectablePoints(points, tBBox)
  // 用 A-Star 算法寻径
  polylinePoints = aStar(points, sPoint, tPoint)
  return polylinePoints
}

// 获取扩展区域
const getExpandedBBox (node, offset) {
  // bbox = clone(node)
  bbox = node
  bbox.width += 2 * offset
  bbox.height += 2 * offset
  return bbox
}

// 获取扩展区域上的连接点
const getExpandedPort (node, port) {
  // 判断连接点在上下左右哪个区域，相应地给 x 或 y 加上或者减去 offset
}

// 获取合法折点集合
const getConnectablePoints (sBBox, tBBox, sPoint, tPoint) {
  lineBBox = getBBoxFromVertexes(sPoint, tPoint)
  outerBBox = combineBBoxes(sBBox, tBBox)
  points = []
  points.push(vertexOfBBox(sBBox))
  points.push(vertexOfBBox(tBBox))
  points.push(vertexOfBBox(lineBBox))
  bboxes = [ outerBBox, sBBox, tBBox, lineBBox ]
  for bbox in bboxes
    points.push(crossPointsByLineAndBBox(bbox, /* 中心横线 */)) // 包含 bbox 延长线和线段的相交线
  points.push(crossPointsByLineAndBBox(bbox, /* 中心竖线 */))
  end
  return points
}

// 过滤连接点
const filterConnectablePoints (points, bbox) {
  // for point in points
  //   if point inside bbox
  // remove point from points
  // end
  // end
  // end
}

// aStar 寻径
const aStart (points, sPoint, tPoint) {

}
