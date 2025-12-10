import numpy as np

def minimos_cuadrados_grado2(xs, ys):
    n = len(xs)
    Sx   = np.sum(xs)
    Sx2  = np.sum(xs**2)
    Sx3  = np.sum(xs**3)
    Sx4  = np.sum(xs**4)
    Sy   = np.sum(ys)
    Sxy  = np.sum(xs * ys)
    Sx2y = np.sum((xs**2) * ys)

    A = np.array([
        [Sx4, Sx3, Sx2],
        [Sx3, Sx2, Sx ],
        [Sx2, Sx , n  ]
    ])

    B = np.array([Sx2y, Sxy, Sy])

    a, b, c = np.linalg.solve(A, B)

    return a, b, c

def evaluar_parabola(x, a, b, c):
    return a*x**2 + b*x + c

# Datos
x_puntos = np.array([10.0, 20.0, 30.0, 40.0])
y_puntos = np.array([6.0, 25.0, 60.0, 110.0])

a, b, c = minimos_cuadrados_grado2(x_puntos, y_puntos)

print("Parábola ajustada:")
print(f"y = {a}x^2 + {b}x + {c}")

print("Valor en x = 25:", evaluar_parabola(25, a, b, c))