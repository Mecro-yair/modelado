# MÉTODO DEL TRAPECIO
import math
import numpy as np

def f(x):
    return x**2

# Intervalo y número de subintervalos
a, b = 0, 2
n = 100
h = (b - a) / n

# Nodos y valores
xs = np.array([a + i*h for i in range(n+1)])
fs = np.array([f(x) for x in xs])

# Trapecio compuesto
T = h * (0.5*(fs[0] + fs[-1]) + fs[1:-1].sum())

# Cálculo de referencia de la integral con malla muy fina
xx_ref = np.linspace(a, b, 2000001)
ref = np.trapz([f(x) for x in xx_ref], xx_ref)

# Estimación numérica de f''(x)
xx = np.linspace(a, b, 1001)
ff = np.array([f(x) for x in xx])
dx = xx[1] - xx[0]
f2 = np.zeros_like(ff)
f2[1:-1] = (ff[2:] - 2*ff[1:-1] + ff[:-2]) / dx**2
f2[0] = f2[1]
f2[-1] = f2[-2]
M2 = np.max(np.abs(f2))

# Cota del error del trapecio compuesto
error_bound = (b - a) / 12 * h**2 * M2

# Resultados
print("h =", h)
print("Nodos x_i:", xs)
print("f(x_i):", fs)
print("Trapecio compuesto T =", T)
print("Referencia ref ≈", ref)
print("Diferencia (ref - T) =", ref - T)
print("Estimación max |f''| ≈", M2)
print("Cota error trapecio <= ", error_bound)