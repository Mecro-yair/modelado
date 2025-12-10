def f(x,y):
    return x*y+x**3

x0= float(input("Digite el X0 : "))
y0= float(input("Digite el Y0 : "))
h= float(input("Digite el H : "))

K1= f(x0,y0)
K2 = f(x0+(h/2),y0+((h/2)*K1))
K3 = f(x0+(h/2),y0+((h/2)*K2))
K4 = f(x0 + h , y0+h*K3)

Ysiguiente =  y0 + (h/6)*(K1+2*K2+2*K3+K4)
#Ysiguiente_ = y0 + h*K2
print(Ysiguiente)
#print(Ysiguiente)
print("K1","|","K2","|", "K3", "|", "K4")
print(K1," ",K2," ", K3, " ", K4)