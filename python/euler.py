# euler_exercises.py

import math
import pandas as pd

def euler_method(f, x0, y0, h, steps):
    xs=[x0]
    ys=[y0]
    x,y=x0,y0

    for i in range(steps):
        y=y+h*f(x, y)
        x=x+h
        xs.append(round(x, 12))
        ys.append(y)

    return xs, ys

# --- E1: y' = y, y(0)=1, h=0.1, 2 pasos ---
f_e1=lambda x, y:y
x0_e1,y0_e1,h_e1,steps_e1=0.0, 1.0, 0.1, 2

xs_e1, ys_e1=euler_method(f_e1, x0_e1, y0_e1, h_e1, steps_e1)
exact_e1=[math.exp(x) for x in xs_e1]

df_e1=pd.DataFrame({'x': xs_e1, 'y_euler': ys_e1, 'y_exact': exact_e1})
df_e1['error']=df_e1['y_exact'] - df_e1['y_euler']

# --- E2: y' = -2y + x, y(0)=0, h=0.1, 3 pasos ---
f_e2=lambda x, y: -2*y + x
x0_e2,y0_e2,h_e2,steps_e2=0.0, 0.0, 0.1, 3

xs_e2,ys_e2=euler_method(f_e2, x0_e2, y0_e2, h_e2, steps_e2)

# solución exacta: y = x/2 - 1/4 + (1/4) e^{-2x}
exact_e2=[x/2.0-0.25+0.25*math.exp(-2*x) for x in xs_e2]

df_e2=pd.DataFrame({'x': xs_e2, 'y_euler': ys_e2, 'y_exact': exact_e2})
df_e2['error']=df_e2['y_exact']-df_e2['y_euler']

# --- E3: y' = x^2 + 1, y(0)=0, h=0.2, 3 pasos ---
f_e3=lambda x,y:x**2+1
x0_e3,y0_e3,h_e3,steps_e3=0.0, 0.0, 0.2, 3

xs_e3,ys_e3=euler_method(f_e3, x0_e3, y0_e3, h_e3, steps_e3)

# exacta: y = x^3/3 + x
exact_e3=[x**3/3.0 + x for x in xs_e3]

df_e3=pd.DataFrame({'x': xs_e3, 'y_euler': ys_e3, 'y_exact': exact_e3})
df_e3['error']=df_e3['y_exact'] - df_e3['y_euler']

# Mostrar resultados
pd.set_option('display.float_format', '{:.8f}'.format)
print("\nEuler E1: y' = y, y(0)=1, h=0.1, 2 pasos")
print(df_e1.to_string(index=False))
print("\nEuler E2: y' = -2y + x, y(0)=0, h=0.1, 3 pasos")
print(df_e2.to_string(index=False))
print("\nEuler E3: y' = x^2 + 1, y(0)=0, h=0.2, 3 pasos")
print(df_e3.to_string(index=False))