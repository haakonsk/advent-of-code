import { readLines, say } from '../../utils';

let sum = 0;

class Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

class Condition {
  key: string | undefined;
  comparator: string | undefined;
  value: number | undefined;
  nextWorkflowName: string | undefined;
}

const thresholds: { [key: string]: number[] } = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] };
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
    condition.key = conditionStr[0];
    condition.comparator = conditionStr[1];
    condition.value = parseInt(conditionStr.substring(2));
    condition.nextWorkflowName = name;
    conditions.push(condition);
    const thresholdValue = parseInt(conditionStr.substring(2));
    thresholds[condition.key].push(thresholdValue - 1);
    thresholds[condition.key].push(thresholdValue);
    thresholds[condition.key].push(thresholdValue + 1);
  });
  workflowConditions[workflowName] = conditions;
});

say(thresholds);

let prevAccepted = false;
let count = 0;
let prevAcceptedCount = 0;
for (const x of thresholds.x.sort((a, b) => a - b)) {
  for (const m of thresholds.m.sort((a, b) => a - b)) {
    for (const a of thresholds.a.sort((a, b) => a - b)) {
      for (const s of thresholds.s.sort((a, b) => a - b)) {
        count = 4000 * 4000 * 4000 * (x - 1) + 4000 * 4000 * (m - 1) + 4000 * (a - 1) + s - 1;
        const part = new Part();
        part.x = x;
        part.m = m;
        part.a = a;
        part.s = s;
        const accepted = runWorkflow(part, 'in');
        if (accepted) {
          if (prevAccepted) {
            const diff = count - prevAcceptedCount;
            say(sum, '+', diff, '(', prevAcceptedCount, ')')
            sum += diff;
          }
          prevAcceptedCount = count;
        }
        prevAccepted = accepted;
      }
    }
  }
}

say(sum);
say(167409079868000, 'should be');

function runWorkflow(part: Part, name: string): boolean {
  if (name === 'A') {
    say('accept', part);
    return true;
  }
  if (name === 'R') {
    say('reject', part);
    return false;
  }
  for (const condition of workflowConditions[name]) {
    if (!condition.key) {
      return runWorkflow(part, condition.nextWorkflowName);
    }
    if (eval(`part.${condition.key} ${condition.comparator} ${condition.value}`)) {
      return runWorkflow(part, condition.nextWorkflowName);
    }
  }
}
