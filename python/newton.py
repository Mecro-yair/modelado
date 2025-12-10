import sympy as sp
import numpy as np

def newton_simbolico(xs, ys):
    x = sp.symbols('x')
    n = len(xs)

    # Tabla de diferencias divididas
    tabla = np.zeros((n, n))
    tabla[:, 0] = ys
    # f[xi+xi+1,...,xi+k]=(f[x+1,...,xi+k]-f[xi,...,xi+k-1])/(xi+k-xi)
    for j in range(1, n):
        for i in range(n-j):
            tabla[i, j] = (tabla[i+1, j-1] - tabla[i, j-1]) / (xs[i+j] - xs[i])

    # Construir polinomio de Newton
    P = tabla[0, 0]
    producto = 1

    # Pn(x)=f[x0]+f[x0,x1](x-x0)+f[x0,x1,x2](x-x0)(x-x1)+...
    for i in range(1, n):
        producto *= (x - xs[i-1])
        P += tabla[0, i] * producto

    return x, sp.expand(P)

x_puntos = np.array([1.0, 0.0, -3.0])
y_puntos = np.array([2.0, 4.0, -2.0])

x, P = newton_simbolico(x_puntos, y_puntos)

print("Polinomio de Newton:")
print(P)

print("\nP(3) =", P.subs(x, 3))