import numpy as np
import sympy as sp

def lagrange_simbolico(x_puntos, y_puntos):
    x = sp.symbols('x')
    n = len(x_puntos)
    P = 0

    for i in range(n):
        Li = 1
        for j in range(n):
            if j != i:
                Li *= (x - x_puntos[j]) / (x_puntos[i] - x_puntos[j])
        P += y_puntos[i] * Li

    P_simplificado = sp.expand(P)
    return x, P_simplificado

x_puntos = np.array([0.0, 2.0, 4.0])
y_puntos = np.array([2.0, 6.0, 20.0])

x, P = lagrange_simbolico(x_puntos, y_puntos)

print("Polinomio:")
print(P)

puntoEvaluar = 3.0
valor = P.subs(x, puntoEvaluar)

print(f"\nP({puntoEvaluar}) = {valor}")