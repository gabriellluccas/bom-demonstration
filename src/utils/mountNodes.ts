import { Edge, Node } from 'react-flow-renderer';
import { CustomNodeType } from '../context';

const findNextNodes = (
  currentNodes: CustomNodeType[],
  nodes: Node[],
  edges: Edge[],
  count: number,
): CustomNodeType[] => {
  const nextNodes: CustomNodeType[] = [];

  currentNodes.forEach((node) => {
    const targetEdges = edges.filter(({ source }) => source === node.id);

    targetEdges.forEach(({ target }) => {
      const targetNode = nodes.find(({ id }) => id === target);
      if (targetNode) {
        nextNodes.push({
          ...targetNode, layer: count, amount: 0, timer: 0, available: false,
        });
      }
    });
  });

  if (!nextNodes.length) return currentNodes;
  return [...currentNodes, ...findNextNodes(nextNodes, nodes, edges, count + 1)];
};

const removeDuplicateds = (nodes: CustomNodeType[]) => {
  return nodes.reduce((acc, el) => {
    const index = acc.findIndex((subEl) => subEl.id === el.id);
    let addElement = true;

    if (index > -1) {
      if (acc[index].layer < el.layer) acc.splice(index, 1);
      else addElement = false;
    }

    return addElement ? [...acc, el] : acc;
  }, [] as CustomNodeType[]);
};

export const updateNodesPosition = (nodes: CustomNodeType[]) => {
  const countArray: number[] = [];
  return nodes.map((node) => {
    const countLayer = countArray[node.layer] || 0;
    countArray[node.layer] = countLayer + 1;
    return { ...node, position: { x: countLayer * 200, y: node.layer * 200 } };
  });
};

export const nodeToCustomNode = (nodes: Node[], edges: Edge[]): CustomNodeType[] => {
  const rootNodes: CustomNodeType[] = [];

  nodes.forEach((node) => {
    if (!edges.find(({ target }) => target === node.id)) {
      rootNodes.push({
        ...node, layer: 0, amount: 0, timer: 0, available: true,
      });
    }
  });

  const nodesWithDuplicateds = findNextNodes(rootNodes, nodes, edges, 1);
  const nodesWithLayer = removeDuplicateds(nodesWithDuplicateds);
  return updateNodesPosition(nodesWithLayer);
};