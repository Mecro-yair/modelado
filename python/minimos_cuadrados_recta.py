import numpy as np

def minimos_cuadrados_recta(xs, ys):
    n = len(xs)
    Sx  = np.sum(xs)
    Sy  = np.sum(ys)
    Sxx = np.sum(xs**2)
    Sxy = np.sum(xs * ys)

    a = (n*Sxy - Sx*Sy) / (n*Sxx - Sx**2)
    b = (Sy - a*Sx) / n
    return a, b

def evaluar_recta(x, a, b):
    return a*x + b

# Puntos
x_puntos = np.array([0.0, 1.0, 2.0, 3.0])
y_puntos = np.array([1.0, 2.0, 2.0, 4.0])

a, b = minimos_cuadrados_recta(x_puntos, y_puntos)

print(f"Recta ajustada: y = {a}x + {b}")
print("Valor en x = 3: ", evaluar_recta(3, a, b))