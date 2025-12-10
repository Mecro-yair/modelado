# METODO DE SIMPSON
import math
import numpy as np

def f(x):
    return x**3 / (1.0 + math.sqrt(x))

a, b = 2.0, 5.0
n = 6
h = (b - a) / n

# Nodos y valores
xs = np.array([a + i*h for i in range(n+1)])
fs = np.array([f(x) for x in xs])

# Simpson 1/3 compuesto
def simpson_1_3_compuesto(f, a, b, n):
    if n % 2 == 1:
        raise ValueError("n debe ser par para Simpson 1/3")
    h = (b - a) / n
    xs = [a + i*h for i in range(n+1)]
    ys = [f(x) for x in xs]
    S = ys[0] + ys[-1] + 4*sum(ys[i] for i in range(1, n, 2)) + 2*sum(ys[i] for i in range(2, n-1, 2))
    return (h/3) * S

S = simpson_1_3_compuesto(f, a, b, n)

# Referencia fina
def simpson_comp_ref(f, a, b, N=20000):
    if N % 2 == 1:
        N += 1
    h = (b - a) / N
    xs = np.linspace(a, b, N+1)
    ys = np.array([f(x) for x in xs])
    S = ys[0] + ys[-1] + 4*ys[1:-1:2].sum() + 2*ys[2:-1:2].sum()
    return S * h / 3.0

ref = simpson_comp_ref(f, a, b, 20000)

print("h =", h)
print("x_i:", xs)
print("f(x_i):", fs)
print("Simpson n=6 S =", S)
print("Referencia (Simpson N=20000):", ref)
print("Diferencia (ref - S) =", ref - S)