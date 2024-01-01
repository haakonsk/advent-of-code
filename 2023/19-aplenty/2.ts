import { beep, readLines, say } from '../../utils';

/*
 * It takes a while, but it works...
 * Possible improvements for faster execution:
 *  - Add only one threshold value per condition (instead of two)
 *  - Simplify the workflows so that there will be fewer threshold values to consider
 */

console.time()

let sum = 0;

class Condition {
  key: string | undefined;
  index: number;
  comparator: string | undefined;
  value: number | undefined;
  nextWorkflowName: string | undefined;
}

const thresholds: { [key: string]: Set<number> } = {
  x: new Set([1, 4000]),
  m: new Set([1, 4000]),
  a: new Set([1, 4000]),
  s: new Set([1, 4000]),
};
const workflowConditions: { [name: string]: Condition[] } = {};

readLines('workflows.txt').forEach((line: string) => {
  const workflowName = line.substring(0, line.indexOf('{'))
  const workflowStr = line.substring(workflowName.length + 1, line.length - 1);
  const workFlowSteps = workflowStr.split(',');
  const conditions: Condition[] = [];
  workFlowSteps.forEach((step) => {
    const condition = new Condition();
    if (step.match(/^[a-zAR]+$/)) {
      condition.nextWorkflowName = step;
      conditions.push(condition);
      return;
    }
    const [conditionStr, name] = step.split(':');
    const thresholdValue = parseInt(conditionStr.substring(2));
    condition.key = conditionStr[0];
    condition.index = getIndex(condition.key);
    condition.comparator = conditionStr[1];
    condition.value = thresholdValue;
    condition.nextWorkflowName = name;
    conditions.push(condition);
    if (condition.comparator === '<') {
      thresholds[condition.key].add(thresholdValue - 1);
    }
    thresholds[condition.key].add(thresholdValue);
    if (condition.comparator === '>') {
      thresholds[condition.key].add(thresholdValue + 1);
    }
  });
  workflowConditions[workflowName] = conditions;
});

const xThresholds = getSortedThresholds('x');
const mThresholds = getSortedThresholds('m');
const aThresholds = getSortedThresholds('a');
const sThresholds = getSortedThresholds('s');

let prevX = 0;
for (let x of xThresholds) {
  let numAcceptedWithConstantX = 0;
  let prevM = 0;
  for (let m of mThresholds) {
    let numAcceptedWithConstantXM = 0;
    let prevA = 0;
    for (let a of aThresholds) {
      let numAcceptedWithConstantXMA = 0;
      let prevAcceptedSCount = 0;
      let prevAccepted = false;
      for (let s of sThresholds) {
        const part = [x, m, a, s];
        const count = getNumber(part);
        const accepted = runWorkflow(part, 'in');
        if (accepted) {
          numAcceptedWithConstantXMA += (prevAccepted ? count - prevAcceptedSCount : 1);
          prevAcceptedSCount = count;
        }
        prevAccepted = accepted;
      }
      numAcceptedWithConstantXM += (a - prevA) * numAcceptedWithConstantXMA;
      prevA = a;
    }
    numAcceptedWithConstantX += (m - prevM) * numAcceptedWithConstantXM;
    prevM = m;
  }
  say(x, numAcceptedWithConstantX);
  console.timeLog();
  sum += (x - prevX) * numAcceptedWithConstantX;
  prevX = x;
}

say(sum);
console.timeLog();
beep();

function runWorkflow(part: number[], name: string): boolean {
  if (name === 'A') {
    return true;
  }
  if (name === 'R') {
    return false;
  }
  for (const condition of workflowConditions[name]) {
    if (
      !condition.key ||
      condition.comparator === '<' && part[condition.index] < condition.value ||
      condition.comparator === '>' && part[condition.index] > condition.value
    ) {
      return runWorkflow(part, condition.nextWorkflowName);
    }
  }
}

function getNumber(numbers: number[]): number {
  return 4000*4000*4000*(numbers[0] - 1) + 4000*4000*(numbers[1] - 1) + 4000*(numbers[2] - 1) + numbers[3] - 1;
}

function getIndex(key: string): number {
  switch (key) {
    case 'x': return 0;
    case 'm': return 1;
    case 'a': return 2;
    case 's': return 3;
  }
}

function getSortedThresholds(key: string): number[] {
  return Array.from(thresholds[key]).sort((a, b) => a - b);
}
