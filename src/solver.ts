'use strict';

/**
 * An implementation of A* to solve a Typo puzzle.
 * Supports substitutions, insertions, deletions, and shuffles.
 */
function a_star(start: string, goal: string, moves: Map<string, string[]>): string[]|null {
  // index is estimated cost of solution along this path
  // value is array of words with the same estimate
  // (ideally this should actually be a heap or prio queue for efficiency)
  const edge = [[start]];
  const parents = (new Map<string, string|null>).set(start, null);
  const costs = (new Map<string, number>).set(start, 0);

  while (edge.filter(x => Array.isArray(x) && x.length > 0).length > 0) {
    const current: string = edge.find(x => Array.isArray(x) && x.length > 0)?.pop() as string;
    if (current === goal) {
      break;
    }

    for (const move of moves.get(current) ?? []) {
      // all moves currently cost one
      const costSoFar = (costs.get(current) as number) + 1;
      const moveCost = costs.get(move) as number;
      if (! costs.has(move) || costSoFar < moveCost) {
        costs.set(move, costSoFar);
        if (edge[costSoFar] === undefined) {
          edge[costSoFar] = [];
        }
        edge[costSoFar].push(move);
        parents.set(move, current);
      }
    }
  }

  return retrace(parents, goal);
}

/**
 * Given a goal state and a map of parent/previous states, return the array representing the path
 * from the start state to the end state. If no solution was found, return null.
 */
function retrace(parents: Map<string, string|null>, end: string): string[]|null {
  if (! parents.has(end)) {
    return null; // no solution
  }

  const path = [];
  let current: string = end;
  while (parents.has(current)) {
    path.push(current);
    current = parents.get(current) as string;
  }
  return path.reverse();
}

/**
 * Get the start and end words and solve the word ladder. Return the array of steps or null if no
 * solution is found. Assumes start and end are valid words.
 */
export function solve(start: string, end: string, moves: Map<string, string[]>): string[]|null {
  const path = a_star(start, end, moves);

  if (path && path.length) {
    return path;
  } else {
    return null;
  }
}
