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

const parts: Part[] = [];
const workflowConditions: { [name: string]: Condition[] } = {};

readLines('parts.txt').forEach((line: string) => {
  line = line.substring(1, line.length - 1);
  const lineParts = line.split(',');
  const part = new Part();
  lineParts.forEach((partStr) => {
    const [key, value] = partStr.split('=');
    part[key] = parseInt(value);
  })
  parts.push(part)
});

// say(parts)

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
  });
  workflowConditions[workflowName] = conditions;
});

parts.forEach((part) => {
  sum += runWorkflow(part, 'in');
})

// say(workflowConditions);
say(sum);

function runWorkflow(part: Part, name: string): number {
  if (name === 'A') {
    say('accept', part);
    return part.x + part.m + part.a + part.s;
  }
  if (name === 'R') {
    return 0;
  }
  for (const condition of workflowConditions[name]) {
    // say(condition);
    if (!condition.key) {
      return runWorkflow(part, condition.nextWorkflowName);
    }
    if (eval(`part.${condition.key} ${condition.comparator} ${condition.value}`)) {
      return runWorkflow(part, condition.nextWorkflowName);
    }
  }
}
