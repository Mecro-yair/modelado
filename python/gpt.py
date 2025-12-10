import matplotlib.pyplot as plt

# Original vertices
A = (-3,4)
B = (-5,2)
C = (-3,0)
D = (-1,2)
E = (1,2)

# Rotation 180° around E: P' = (2*E - P)
def rot180(P, E):
    return (2*E[0] - P[0], 2*E[1] - P[1])

A_p = rot180(A,E)
B_p = rot180(B,E)
C_p = rot180(C,E)
D_p = rot180(D,E)

# Lists for plotting
orig_x = [A[0], B[0], C[0], D[0], A[0]]
orig_y = [A[1], B[1], C[1], D[1], A[1]]

new_x = [A_p[0], B_p[0], C_p[0], D_p[0], A_p[0]]
new_y = [A_p[1], B_p[1], C_p[1], D_p[1], A_p[1]]

plt.figure(figsize=(7,7))

# plot original
plt.plot(orig_x, orig_y, marker='o', linestyle='--')

# plot rotated
plt.plot(new_x, new_y, marker='o', linestyle='-')

# annotate original
plt.annotate(f"A{A}", A)
plt.annotate(f"B{B}", B)
plt.annotate(f"C{C}", C)
plt.annotate(f"D{D}", D)

# annotate rotated
plt.annotate(f"A'{A_p}", A_p)
plt.annotate(f"B'{B_p}", B_p)
plt.annotate(f"C'{C_p}", C_p)
plt.annotate(f"D'{D_p}", D_p)

# center of rotation
plt.scatter([E[0]], [E[1]], marker='x')
plt.annotate(f"E{E}", E)

plt.axhline(0)
plt.axvline(0)
plt.gca().set_aspect('equal', 'box')
plt.grid(True)
plt.title("Rotación 180° alrededor de E(1,2)")
plt.xlabel("x")
plt.ylabel("y")
plt.show()