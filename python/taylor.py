# PROGRAMACION T1,T2,T3 METODO TAYLOR

import math
import pandas as pd

def taylor2_method(f, ypp_func, x0, y0, h, steps):
    xs=[x0]
    ys=[y0]
    x,y=x0,y0

    for i in range(steps):
        yprime=f(x, y)
        # y'' calculada por la función proporcionada
        ypp=ypp_func(x, y, yprime)
        y=y+h*yprime+(h**2/2.0)*ypp
        x=x+h
        xs.append(round(x,12))
        ys.append(y)

    return xs, ys


# --- T1: y' = y, y'' = y, y(0)=1, h=0.1, 2 pasos ---
f_t1=lambda x, y:y
ypp_t1=lambda x, y, yp:y  # y'' = y
x0_t1, y0_t1, h_t1, steps_t1 = 0.0, 1.0, 0.1, 2

xs_t1,ys_t1=taylor2_method(f_t1, ypp_t1, x0_t1, y0_t1, h_t1, steps_t1)
exact_t1=[math.exp(x) for x in xs_t1]

df_t1=pd.DataFrame({'x': xs_t1, 'y_taylor2': ys_t1, 'y_exact': exact_t1})
df_t1['error']=df_t1['y_exact']-df_t1['y_taylor2']

# --- T2: y' = x + y, y'' = 1 + x + y, y(0)=1, h=0.1, 2 pasos ---
f_t2=lambda x, y: x + y
ypp_t2=lambda x, y, yp: 1 + x + y
x0_t2,y0_t2,h_t2,steps_t2 = 0.0, 1.0, 0.1, 2

xs_t2, ys_t2=taylor2_method(f_t2, ypp_t2, x0_t2, y0_t2, h_t2, steps_t2)
df_t2=pd.DataFrame({'x': xs_t2, 'y_taylor2': ys_t2})

# --- T3: y' = sin(x) + y, y'' = cos(x) + sin(x) + y, y(0)=0, h=0.2, 2 pasos ---
f_t3=lambda x, y: math.sin(x)+y
ypp_t3=lambda x, y, yp: math.cos(x)+math.sin(x)+y
x0_t3,y0_t3,h_t3,steps_t3=0.0, 0.0, 0.2, 2

xs_t3, ys_t3=taylor2_method(f_t3, ypp_t3, x0_t3, y0_t3, h_t3, steps_t3)
df_t3=pd.DataFrame({'x': xs_t3, 'y_taylor2': ys_t3})

# Mostrar resultados
pd.set_option('display.float_format', '{:.8f}'.format)
print("\nTaylor T1: y' = y, y(0)=1, h=0.1, 2 pasos")
print(df_t1.to_string(index=False))
print("\nTaylor T2: y' = x + y, y(0)=1, h=0.1, 2 pasos")
print(df_t2.to_string(index=False))
print("\nTaylor T3: y' = sin(x) + y, y(0)=0, h=0.2, 2 pasos")
print(df_t3.to_string(index=False))