from typing import List
import networkx as nx

# The connections from input.txt form one group of connected components. However, it's possible to remove just three
# connections, so that we get two distinct groups of components. The solution is then calculated by multiplying the
# sizes of the two groups of components.
# We start with some "random" cycles. Some cycles will contain components from just one of the two groups, while others
# will contain components from both groups. Only cycles that are within one group can possibly yield the correct
# solution. For a given cycle, we don't know which of the two situations is the case. We then add components to each
# cycle. Assuming the cycle is contained in just one of the groups, we make sure to only add components that we know are
# in the same group (components that have at least two connection within the group). But if, e.g. the initial cycle is
# too small, we won't be able to find all the components in the group.
# By starting with a lot of different cycles, we can assume that the most common group sizes will be the correct ones
# (and that was indeed the case).


class Component:
    def __init__(self, name: str):
        self.name = name
        self.connected_components = set()


def main():
    graph, all_components = build_graph_and_components()
    beep_character = "\x07"
    print('Most likely solution:', find_most_likely_solution(graph, all_components), beep_character)


def build_graph_and_components() -> [nx.Graph, dict]:
    all_components = {}
    all_connections = []
    for line in get_input_lines():
        [component_name, connected_components_str] = line.strip().split(': ')
        connected_components = connected_components_str.split(' ')
        component = all_components.setdefault(component_name, Component(component_name))

        for name in connected_components:
            connected_component = all_components.setdefault(name, Component(name))
            all_connections.append([component_name, name])
            component.connected_components.add(connected_component)
            connected_component.connected_components.add(component)

    graph = nx.Graph()
    graph.add_edges_from(all_connections)
    return graph, all_components


def find_most_likely_solution(graph: nx.Graph, all_components: dict) -> str:
    possible_solutions = {}
    most_likely_solution = ''
    for cycle in nx.cycle_basis(graph):
        while True:
            was_added = False
            for component in all_components.values():
                if add_to_group_if_can_be_connected(cycle, component):
                    was_added = True
            if not was_added:
                break
        num_components_in_group = len(cycle)
        possible_solution = num_components_in_group * (len(all_components) - num_components_in_group)
        possible_solutions[possible_solution] = possible_solutions.get(possible_solution, 0) + 1
        most_likely_solution, num_times = sorted(possible_solutions.items(), key=lambda x: x[1], reverse=True)[0]
        print(most_likely_solution, num_times)
    return most_likely_solution


def is_connected_to_at_least_two_components_in_group(group: List[str], candidate_component: Component) -> bool:
    num_connections_to_group = 0
    for component in candidate_component.connected_components:
        if component.name in group:
            num_connections_to_group += 1
            if num_connections_to_group == 2:
                return True
    return False


def add_to_group_if_can_be_connected(group: List[str], component: Component) -> bool:
    if is_connected_to_at_least_two_components_in_group(group, component):
        if component.name not in group:
            group.append(component.name)
            return True
    return False


def get_input_lines() -> List[str]:
    lines: List[str]
    with open("input.txt", "r") as file:
        lines = file.readlines()
    return lines


main()
