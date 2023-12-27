import re
from scipy.optimize import fsolve
from decimal import Decimal

# Considering just three random lines from the input, it should be possible to find the solution.
# The x-position of the thrown hail is:
#   x = px + t * vx
# where px is the initial x-position of any hailstone and vx is its velocity in the x-direction. Similarly for y and z:
#   y = py + t * vy
#   z = pz + t * vz
# Each hailstone should at some point in time be at the same place as the thrown hailstone, e.g.:
#   px1 + t1 * vx1 = px + t1 * vx
# where px is the unknown starting position of the thrown hailstone on the x-axis, and vx is its unknown velocity in the
# x-direction. From three random hailstone paths, which should all crash with the thrown hailstone, we can write nine
# non-linear equations with nine unknowns:
#
# px1 + t1 * vx1 = px + t1 * vx
# px2 + t2 * vx2 = px + t2 * vx
# px3 + t3 * vx3 = px + t3 * vx
# py1 + t1 * vy1 = py + t1 * vy
# py2 + t2 * vy2 = py + t2 * vy
# py3 + t3 * vy3 = py + t3 * vy
# pz1 + t1 * vz1 = pz + t1 * vz
# pz2 + t2 * vz2 = pz + t2 * vz
# pz3 + t3 * vz3 = pz + t3 * vz
#
# This can be reduced to 4 equations with 4 unknowns, which seems to be easier to solve using scipy:
# py2 * (vx2 - vx) + (px - px2) * vy2 - (py1 + (px - px1) * (vy1 - vy) / (vx1 - vx)) * (vx2 - vx) - (px - px2) * vy
# py3 * (vx3 - vx) + (px - px3) * vy3 - (py1 + (px - px1) * (vy1 - vy) / (vx1 - vx)) * (vx3 - vx) - (px - px3) * vy
# pz2 * (vx2 - vx) + (px - px2) * vz2 - (pz1 + (px - px1) * (vz1 - vz) / (vx1 - vx)) * (vx2 - vx) - (px - px2) * vz
# pz3 * (vx3 - vx) + (px - px3) * vz3 - (pz1 + (px - px1) * (vz1 - vz) / (vx1 - vx)) * (vx3 - vx) - (px - px3) * vz
#
# fsolve in scipy doesn't always give a solution, and sometimes the solution is wrong, so we have to verify each
# potential solution.

prev_line = None
prev_prev_line = None


def get_numbers_from_line(line):
    pattern = r"(-?\d+), (-?\d+), (-?\d+) @ (-?\d+), (-?\d+), (-?\d+)"
    match = re.match(pattern, line)
    return [int(match.group(i)) for i in range(1, 7)]


def equations(x):
    [px1, py1, pz1, vx1, vy1, vz1] = get_numbers_from_line(line)
    [px2, py2, pz2, vx2, vy2, vz2] = get_numbers_from_line(prev_line)
    [px3, py3, pz3, vx3, vy3, vz3] = get_numbers_from_line(prev_prev_line)

    f1 = py2 * (vx2 - x[1]) + (x[0] - px2) * vy2 - (py1 + (x[0] - px1) * (vy1 - x[2]) / (vx1 - x[1])) * (vx2 - x[1]) - (x[0] - px2) * x[2]
    f2 = py3 * (vx3 - x[1]) + (x[0] - px3) * vy3 - (py1 + (x[0] - px1) * (vy1 - x[2]) / (vx1 - x[1])) * (vx3 - x[1]) - (x[0] - px3) * x[2]
    f3 = pz2 * (vx2 - x[1]) + (x[0] - px2) * vz2 - (pz1 + (x[0] - px1) * (vz1 - x[3]) / (vx1 - x[1])) * (vx2 - x[1]) - (x[0] - px2) * x[3]
    f4 = pz3 * (vx3 - x[1]) + (x[0] - px3) * vz3 - (pz1 + (x[0] - px1) * (vz1 - x[3]) / (vx1 - x[1])) * (vx3 - x[1]) - (x[0] - px3) * x[3]

    return [f1, f2, f3, f4]


def verify_solution(solution):
    try:
        [f1, f2, f3, f4] = equations(solution)
    except ZeroDivisionError:
        return False

    return f1 == 0 and f2 == 0 and f3 == 0 and f4 == 0


file = open("input.txt", "r")
lines = file.readlines()
file.close()

initial_guess = [
    300_000_000_000_000,  # px, middle of test area
    0,                    # vx
    0,                    # vy
    0,                    # vz
]

for line in lines:
    if prev_prev_line:
        [px, vx, vy, vz] = [round(Decimal(str(value))) for value in fsolve(equations, initial_guess)]
        if verify_solution([px, vx, vy, vz]):
            [px1, py1, pz1, vx1, vy1, vz1] = get_numbers_from_line(line)
            t1 = (px - px1) / (vx1 - vx)
            py = py1 + t1 * (vy1 - vy)
            pz = pz1 + t1 * (vz1 - vz)
            print('solution:', int(px + py + pz))
            break
    prev_prev_line = prev_line
    prev_line = line
