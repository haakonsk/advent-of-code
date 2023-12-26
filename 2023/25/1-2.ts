import { beep, readLinesSplit, say } from '../../utils';

// TODO: Build up groups, merge them when connected by at least four connections

console.time();

type ConnectionGroup = string[];
const connections: { [key: string]: boolean } = {};

readLinesSplit('input.txt', ': ').forEach(([componentName, connectedComponentsStr]: [string, string]) => {
  const connectedComponents = connectedComponentsStr.split(' ');
  connectedComponents.forEach((name) => {
    connections[getConnectionKey(componentName, name)] = true;
  });
});

getConnectionGroups();

function getConnectionGroups(): ConnectionGroup[] {
  const allConnectionGroups: ConnectionGroup[] = [];

  Object.entries(connections).filter(([, isConnected]) => isConnected).forEach(([connectionKey]) => {
    const [component1Name, component2Name] = connectionKey.split(',');
    // say('all groups', allGroups.toString());
    if (allConnectionGroups.length === 0) {
      // say('first group')
      allConnectionGroups.push(newConnectionGroup(connectionKey));
      return;
    }
    const groupsWithConnection = getGroupsWithConnection(allConnectionGroups, connectionKey);
    // say('groups with component', component.name, groupsWithConnection.length);
    if (groupsWithConnection.length === 0) {
      // say('new group')
      allConnectionGroups.push(newConnectionGroup(connectionKey));
      return;
    }
    if (groupsWithConnection.length === 1) {
      // Add to existing group
      // say('existing group');
      [component1Name, component2Name].forEach((name) => {
        const group = groupsWithConnection[0];
        if (!isInGroup(group, name)) {
          group.push(name);
        }
      });
      return;
    }
    // More than 1 group with component
    // Merge groups
    // say('merge')
    const newGroup: ConnectionGroup = [component1Name, component2Name];
    groupsWithConnection.forEach((group) => {
      group.forEach((name) => {
        newGroup.push(name);
      })
      const index = allConnectionGroups.findIndex((g) => g.toString() === group.toString());
      // say('delete', allGroups[index].toString())
      allConnectionGroups.splice(index, 1);
    });
    allConnectionGroups.push(newGroup);
  });

  return allConnectionGroups;
}

function getGroupsWithConnection(allGroups: ConnectionGroup[], connectionKey: string): ConnectionGroup[] {
  return allGroups.filter((group) => existsInGroup(connectionKey, group));
}

function existsInGroup(connectionKey: string, group: ConnectionGroup): boolean {
  return connectionKey.split(',').some((componentName) => group.includes(componentName));
}

function newConnectionGroup(connectionKey: string): ConnectionGroup {
  return connectionKey.split(',');
}

function isInGroup(group: ConnectionGroup, name: string): boolean {
  return group.includes(name);
}

function getConnectionKey(name1: string, name2: string): string {
  return [name1, name2].sort((a, b) => a.localeCompare(b) ).join(',');
}
