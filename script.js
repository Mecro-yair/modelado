let pyodide = null;

// Inicializar Pyodide y cargar módulos Python
async function initPyodide() {
  try {
    pyodide = await loadPyodide();
    await pyodide.loadPackage(["numpy", "sympy"]);
    console.log('✓ NumPy y SymPy cargados');
    
    // Cargar archivos Python
    const pythonFiles = [
      'lagrange',
      'newton',
      'minimos_cuadrados_recta',
      'minimos_cuadrados_grado2',
      'trapecio',
      'simpson',
      'euler',
      'taylor',
      'runge_kutta'
    ];
    
    for (const file of pythonFiles) {
      try {
        const response = await fetch(`python/${file}.py`);
        const code = await response.text();
        pyodide.runPython(code);
        console.log(`✓ Módulo ${file}.py cargado`);
      } catch (error) {
        console.error(`✗ Error cargando ${file}.py:`, error);
      }
    }
    
    document.getElementById('loading').style.display = 'none';
    document.getElementById('newton').classList.add('active');
    console.log('✓ Pyodide inicializado correctamente');
    
  } catch (error) {
    document.getElementById('loading').innerHTML = 
      '<div style="color: #e53e3e;">Error al cargar Python: ' + error.message + '</div>';
    console.error('Error en initPyodide:', error);
  }
}

// Cambiar entre tabs
function showTab(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  event.target.classList.add('active');
}

// Mostrar salida
function showOutput(id, text, isError = false) {
  const el = document.getElementById(id);
  el.textContent = text;
  if (isError) {
    el.style.color = '#e53e3e';
  } else {
    el.style.color = '#2d3748';
  }
}

// Crear gráfica con Plotly
function plotGraph(divId, xData, yData, xEval, yEval, curveX, curveY, title) {
  const trace1 = {
    x: xData,
    y: yData,
    mode: 'markers',
    type: 'scatter',
    name: 'Puntos',
    marker: {
      size: 10,
      color: '#2c5282',
      line: {
        color: '#1a365d',
        width: 2
      }
    }
  };

  const trace2 = {
    x: curveX,
    y: curveY,
    mode: 'lines',
    type: 'scatter',
    name: 'Curva',
    line: {
      color: '#e53e3e',
      width: 3,
      shape: 'spline'
    }
  };

  const trace3 = {
    x: [xEval],
    y: [yEval],
    mode: 'markers',
    type: 'scatter',
    name: 'Evaluación',
    marker: {
      size: 12,
      color: '#48bb78',
      symbol: 'diamond',
      line: {
        color: '#2f855a',
        width: 2
      }
    }
  };

  const layout = {
    title: {
      text: title,
      font: {
        size: 16,
        color: '#2c5282',
        family: 'Inter'
      }
    },
    xaxis: {
      title: 'X',
      gridcolor: '#e2e8f0',
      showgrid: true
    },
    yaxis: {
      title: 'Y',
      gridcolor: '#e2e8f0',
      showgrid: true
    },
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff',
    margin: { t: 50, r: 30, b: 50, l: 50 },
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255, 255, 255, 0.8)',
      bordercolor: '#e2e8f0',
      borderwidth: 1
    }
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  Plotly.newPlot(divId, [trace1, trace2, trace3], layout, config);
}

// ===============================================
// MÉTODOS NUMÉRICOS
// ===============================================

// LAGRANGE
async function runLagrange() {
  const xs = document.getElementById('lag_x').value;
  const ys = document.getElementById('lag_y').value;
  const xEval = document.getElementById('lag_eval').value;
  
  try {
    const result = pyodide.runPython(`
import numpy as np
x_puntos = np.array([${xs}])
y_puntos = np.array([${ys}])
puntoEvaluar = ${xEval}

x, P = lagrange_simbolico(x_puntos, y_puntos)
valor = P.subs(x, puntoEvaluar)

# Generar curva para graficar
x_curve = np.linspace(min(x_puntos) - 1, max(x_puntos) + 1, 100)
y_curve = [float(P.subs(x, xi)) for xi in x_curve]

output = "Polinomio de Lagrange:\\n"
output += f"{P}\\n\\n"
output += f"Evaluación en x = {puntoEvaluar}:\\n"
output += f"P({puntoEvaluar}) = {float(valor):.6f}"

# Retornar como diccionario
import json
json.dumps({
    'output': output,
    'x_data': x_puntos.tolist(),
    'y_data': y_puntos.tolist(),
    'x_curve': x_curve.tolist(),
    'y_curve': y_curve,
    'x_eval': float(puntoEvaluar),
    'y_eval': float(valor)
})
    `);
    
    const data = JSON.parse(result);
    showOutput('out_lagrange', data.output);
    
    // Graficar
    plotGraph(
      'graph_lagrange',
      data.x_data,
      data.y_data,
      data.x_eval,
      data.y_eval,
      data.x_curve,
      data.y_curve,
      'Interpolación de Lagrange'
    );
    
  } catch (e) {
    showOutput('out_lagrange', "❌ Error: " + e.message, true);
    console.error('Error en Lagrange:', e);
  }
}

// NEWTON
async function runNewton() {
  const xs = document.getElementById('new_x').value;
  const ys = document.getElementById('new_y').value;
  const xEval = document.getElementById('new_eval').value;
  
  try {
    const result = pyodide.runPython(`
import numpy as np
xs = np.array([${xs}])
ys = np.array([${ys}])
x_test = ${xEval}

x, P = newton_simbolico(xs, ys)
y_test = P.subs(x, x_test)

# Generar curva para graficar
x_curve = np.linspace(min(xs) - 1, max(xs) + 1, 100)
y_curve = [float(P.subs(x, xi)) for xi in x_curve]

output = "Polinomio de Newton:\\n"
output += f"{P}\\n\\n"
output += f"Evaluación en x = {x_test}:\\n"
output += f"P({x_test}) = {float(y_test):.6f}"

import json
json.dumps({
    'output': output,
    'x_data': xs.tolist(),
    'y_data': ys.tolist(),
    'x_curve': x_curve.tolist(),
    'y_curve': y_curve,
    'x_eval': float(x_test),
    'y_eval': float(y_test)
})
    `);
    
    const data = JSON.parse(result);
    showOutput('out_newton', data.output);
    
    // Graficar
    plotGraph(
      'graph_newton',
      data.x_data,
      data.y_data,
      data.x_eval,
      data.y_eval,
      data.x_curve,
      data.y_curve,
      'Diferencias Divididas de Newton'
    );
    
  } catch (e) {
    showOutput('out_newton', "❌ Error: " + e.message, true);
    console.error('Error en Newton:', e);
  }
}

// MÍNIMOS CUADRADOS
async function runMinimos() {
  const xs = document.getElementById('min_x').value;
  const ys = document.getElementById('min_y').value;
  const grado = document.getElementById('min_grado').value;
  const xEval = document.getElementById('min_eval').value;
  
  try {
    let pythonCode = `
import numpy as np
x_puntos = np.array([${xs}])
y_puntos = np.array([${ys}])
`;

    if (grado === '1') {
      pythonCode += `
a, b = minimos_cuadrados_recta(x_puntos, y_puntos)
valor = evaluar_recta(${xEval}, a, b)

# Generar curva
x_curve = np.linspace(min(x_puntos) - 2, max(x_puntos) + 2, 100)
y_curve = [evaluar_recta(xi, a, b) for xi in x_curve]

output = "Recta ajustada:\\n"
output += f"y = {a:.6f}x + {b:.6f}\\n\\n"
output += f"Evaluación en x = {${xEval}}:\\n"
output += f"y({${xEval}}) = {valor:.6f}"
`;
    } else {
      pythonCode += `
a, b, c = minimos_cuadrados_grado2(x_puntos, y_puntos)
valor = evaluar_parabola(${xEval}, a, b, c)

# Generar curva
x_curve = np.linspace(min(x_puntos) - 2, max(x_puntos) + 2, 100)
y_curve = [evaluar_parabola(xi, a, b, c) for xi in x_curve]

output = "Parábola ajustada:\\n"
output += f"y = {a:.6f}x² + {b:.6f}x + {c:.6f}\\n\\n"
output += f"Evaluación en x = {${xEval}}:\\n"
output += f"y({${xEval}}) = {valor:.6f}"
`;
    }

    pythonCode += `
import json
json.dumps({
    'output': output,
    'x_data': x_puntos.tolist(),
    'y_data': y_puntos.tolist(),
    'x_curve': x_curve.tolist(),
    'y_curve': y_curve,
    'x_eval': float(${xEval}),
    'y_eval': float(valor)
})
`;

    const result = pyodide.runPython(pythonCode);
    const data = JSON.parse(result);
    showOutput('out_minimos', data.output);
    
    // Graficar
    plotGraph(
      'graph_minimos',
      data.x_data,
      data.y_data,
      data.x_eval,
      data.y_eval,
      data.x_curve,
      data.y_curve,
      'Ajuste por Mínimos Cuadrados'
    );
    
  } catch (e) {
    showOutput('out_minimos', "❌ Error: " + e.message, true);
    console.error('Error en Mínimos Cuadrados:', e);
  }
}

// TRAPECIO
async function runTrapecio() {
  const a = document.getElementById('trap_a').value;
  const b = document.getElementById('trap_b').value;
  const n = document.getElementById('trap_n').value;
  const funcStr = document.getElementById('trap_func').value;
  
  try {
    const result = pyodide.runPython(`
import numpy as np
import math

def f(x):
    return ${funcStr}

a, b = ${a}, ${b}
n = ${n}
h = (b - a) / n

xs = np.array([a + i*h for i in range(n+1)])
fs = np.array([f(x) for x in xs])

T = h * (0.5*(fs[0] + fs[-1]) + fs[1:-1].sum())

# Generar curva continua
x_curve = np.linspace(a, b, 200)
y_curve = [f(x) for x in x_curve]

# Calcular referencia
xx_ref = np.linspace(a, b, 10001)
ref = np.trapz([f(x) for x in xx_ref], xx_ref)

output = f"Método del Trapecio\\n"
output += f"h = {h:.6f}\\n"
output += f"n = {n}\\n\\n"
output += f"Trapecio compuesto T = {T:.8f}\\n"
output += f"Referencia ≈ {ref:.8f}\\n"
output += f"Diferencia (ref - T) = {ref - T:.8e}\\n"

import json
json.dumps({
    'output': output,
    'x_data': xs.tolist(),
    'y_data': fs.tolist(),
    'x_curve': x_curve.tolist(),
    'y_curve': y_curve,
    'a': float(a),
    'b': float(b),
    'integral': float(T)
})
    `);
    
    const data = JSON.parse(result);
    showOutput('out_trapecio', data.output);
    
    // Graficar con área sombreada
    const trace1 = {
      x: data.x_curve,
      y: data.y_curve,
      mode: 'lines',
      name: 'f(x)',
      line: { color: '#e53e3e', width: 3 }
    };

    const trace2 = {
      x: data.x_data,
      y: data.y_data,
      mode: 'markers+lines',
      name: 'Trapecios',
      marker: { size: 6, color: '#2c5282' },
      line: { color: '#4299e1', width: 1, dash: 'dot' }
    };

    const layout = {
      title: 'Método del Trapecio',
      xaxis: { title: 'x', gridcolor: '#e2e8f0' },
      yaxis: { title: 'f(x)', gridcolor: '#e2e8f0' },
      plot_bgcolor: '#ffffff',
      paper_bgcolor: '#ffffff'
    };

    Plotly.newPlot('graph_trapecio', [trace1, trace2], layout, { responsive: true, displayModeBar: false });
    
  } catch (e) {
    showOutput('out_trapecio', "❌ Error: " + e.message, true);
    console.error('Error en Trapecio:', e);
  }
}

// SIMPSON
async function runSimpson() {
  const a = document.getElementById('simp_a').value;
  const b = document.getElementById('simp_b').value;
  const n = document.getElementById('simp_n').value;
  const funcStr = document.getElementById('simp_func').value;
  
  try {
    const result = pyodide.runPython(`
import numpy as np
import math

def f(x):
    return ${funcStr}

def simpson_1_3_compuesto(f, a, b, n):
    if n % 2 == 1:
        raise ValueError("n debe ser par para Simpson 1/3")
    h = (b - a) / n
    xs = [a + i*h for i in range(n+1)]
    ys = [f(x) for x in xs]
    S = ys[0] + ys[-1] + 4*sum(ys[i] for i in range(1, n, 2)) + 2*sum(ys[i] for i in range(2, n-1, 2))
    return (h/3) * S

a, b = ${a}, ${b}
n = ${n}
h = (b - a) / n

xs = np.array([a + i*h for i in range(n+1)])
fs = np.array([f(x) for x in xs])

S = simpson_1_3_compuesto(f, a, b, n)

# Generar curva continua
x_curve = np.linspace(a, b, 200)
y_curve = [f(x) for x in x_curve]

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

output = f"Método de Simpson 1/3\\n"
output += f"h = {h:.6f}\\n"
output += f"n = {n} (par)\\n\\n"
output += f"Simpson n={n} S = {S:.8f}\\n"
output += f"Referencia (N=20000) = {ref:.8f}\\n"
output += f"Diferencia (ref - S) = {ref - S:.8e}\\n"

import json
json.dumps({
    'output': output,
    'x_data': xs.tolist(),
    'y_data': fs.tolist(),
    'x_curve': x_curve.tolist(),
    'y_curve': y_curve,
    'a': float(a),
    'b': float(b),
    'integral': float(S)
})
    `);
    
    const data = JSON.parse(result);
    showOutput('out_simpson', data.output);
    
    // Graficar
    const trace1 = {
      x: data.x_curve,
      y: data.y_curve,
      mode: 'lines',
      name: 'f(x)',
      line: { color: '#e53e3e', width: 3 }
    };

    const trace2 = {
      x: data.x_data,
      y: data.y_data,
      mode: 'markers+lines',
      name: 'Parábolas',
      marker: { size: 6, color: '#2c5282' },
      line: { color: '#4299e1', width: 1, dash: 'dot' }
    };

    const layout = {
      title: 'Método de Simpson 1/3',
      xaxis: { title: 'x', gridcolor: '#e2e8f0' },
      yaxis: { title: 'f(x)', gridcolor: '#e2e8f0' },
      plot_bgcolor: '#ffffff',
      paper_bgcolor: '#ffffff'
    };

    Plotly.newPlot('graph_simpson', [trace1, trace2], layout, { responsive: true, displayModeBar: false });
    
  } catch (e) {
    showOutput('out_simpson', "❌ Error: " + e.message, true);
    console.error('Error en Simpson:', e);
  }
}

// EULER
async function runEuler() {
  const funcStr = document.getElementById('euler_func').value;
  const x0 = document.getElementById('euler_x0').value;
  const y0 = document.getElementById('euler_y0').value;
  const h = document.getElementById('euler_h').value;
  const steps = document.getElementById('euler_steps').value;
  
  try {
    const result = pyodide.runPython(`
import numpy as np
import math

def f(x, y):
    return ${funcStr}

def euler_method(f, x0, y0, h, steps):
    xs = [x0]
    ys = [y0]
    x, y = x0, y0
    for i in range(steps):
        y = y + h * f(x, y)
        x = x + h
        xs.append(round(x, 12))
        ys.append(y)
    return xs, ys

xs, ys = euler_method(f, ${x0}, ${y0}, ${h}, ${steps})

output = "Método de Euler\\n"
output += f"x0 = {${x0}}, y0 = {${y0}}\\n"
output += f"h = {${h}}, pasos = {${steps}}\\n\\n"
for i, (x, y) in enumerate(zip(xs, ys)):
    output += f"Paso {i}: x = {x:.6f}, y = {y:.8f}\\n"

import json
json.dumps({
    'output': output,
    'xs': xs,
    'ys': ys
})
    `);
    
    const data = JSON.parse(result);
    showOutput('out_euler', data.output);
    
    // Graficar
    const trace = {
      x: data.xs,
      y: data.ys,
      mode: 'lines+markers',
      name: 'Euler',
      marker: { size: 8, color: '#2c5282' },
      line: { color: '#e53e3e', width: 2 }
    };

    const layout = {
      title: 'Método de Euler',
      xaxis: { title: 'x', gridcolor: '#e2e8f0' },
      yaxis: { title: 'y', gridcolor: '#e2e8f0' },
      plot_bgcolor: '#ffffff',
      paper_bgcolor: '#ffffff'
    };

    Plotly.newPlot('graph_euler', [trace], layout, { responsive: true, displayModeBar: false });
    
  } catch (e) {
    showOutput('out_euler', "❌ Error: " + e.message, true);
    console.error('Error en Euler:', e);
  }
}

// TAYLOR
async function runTaylor() {
  const funcStr = document.getElementById('taylor_func').value;
  const yppStr = document.getElementById('taylor_ypp').value;
  const x0 = document.getElementById('taylor_x0').value;
  const y0 = document.getElementById('taylor_y0').value;
  const h = document.getElementById('taylor_h').value;
  const steps = document.getElementById('taylor_steps').value;
  
  try {
    const result = pyodide.runPython(`
import numpy as np
import math

def f(x, y):
    return ${funcStr}

def ypp_func(x, y, yp):
    return ${yppStr}

def taylor2_method(f, ypp_func, x0, y0, h, steps):
    xs = [x0]
    ys = [y0]
    x, y = x0, y0
    for i in range(steps):
        yprime = f(x, y)
        ypp = ypp_func(x, y, yprime)
        y = y + h * yprime + (h**2 / 2.0) * ypp
        x = x + h
        xs.append(round(x, 12))
        ys.append(y)
    return xs, ys

xs, ys = taylor2_method(f, ypp_func, ${x0}, ${y0}, ${h}, ${steps})

output = "Método de Taylor (orden 2)\\n"
output += f"x0 = {${x0}}, y0 = {${y0}}\\n"
output += f"h = {${h}}, pasos = {${steps}}\\n\\n"
for i, (x, y) in enumerate(zip(xs, ys)):
    output += f"Paso {i}: x = {x:.6f}, y = {y:.8f}\\n"

import json
json.dumps({
    'output': output,
    'xs': xs,
    'ys': ys
})
    `);
    
    const data = JSON.parse(result);
    showOutput('out_taylor', data.output);
    
    // Graficar
    const trace = {
      x: data.xs,
      y: data.ys,
      mode: 'lines+markers',
      name: 'Taylor',
      marker: { size: 8, color: '#2c5282' },
      line: { color: '#e53e3e', width: 2 }
    };

    const layout = {
      title: 'Método de Taylor (Orden 2)',
      xaxis: { title: 'x', gridcolor: '#e2e8f0' },
      yaxis: { title: 'y', gridcolor: '#e2e8f0' },
      plot_bgcolor: '#ffffff',
      paper_bgcolor: '#ffffff'
    };

    Plotly.newPlot('graph_taylor', [trace], layout, { responsive: true, displayModeBar: false });
    
  } catch (e) {
    showOutput('out_taylor', "❌ Error: " + e.message, true);
    console.error('Error en Taylor:', e);
  }
}

// RUNGE-KUTTA
async function runRungeKutta() {
  const funcStr = document.getElementById('rk_func').value;
  const x0 = document.getElementById('rk_x0').value;
  const y0 = document.getElementById('rk_y0').value;
  const h = document.getElementById('rk_h').value;
  
  try {
    const result = pyodide.runPython(`
import numpy as np
import math

def f(x, y):
    return ${funcStr}

x0, y0, h = ${x0}, ${y0}, ${h}

K1 = f(x0, y0)
K2 = f(x0 + (h/2), y0 + ((h/2) * K1))
K3 = f(x0 + (h/2), y0 + ((h/2) * K2))
K4 = f(x0 + h, y0 + h * K3)

Ysiguiente = y0 + (h/6) * (K1 + 2*K2 + 2*K3 + K4)

output = "Método de Runge-Kutta (RK4)\\n"
output += f"x0 = {x0}, y0 = {y0}, h = {h}\\n\\n"
output += f"K1 = {K1:.8f}\\n"
output += f"K2 = {K2:.8f}\\n"
output += f"K3 = {K3:.8f}\\n"
output += f"K4 = {K4:.8f}\\n\\n"
output += f"Y siguiente = {Ysiguiente:.8f}\\n"

import json
json.dumps({
    'output': output,
    'xs': [x0, x0 + h],
    'ys': [y0, Ysiguiente],
    'K1': K1,
    'K2': K2,
    'K3': K3,
    'K4': K4
})
    `);
    
    const data = JSON.parse(result);
    showOutput('out_rk', data.output);
    
    // Graficar
    const trace = {
      x: data.xs,
      y: data.ys,
      mode: 'lines+markers',
      name: 'RK4',
      marker: { size: 10, color: '#2c5282' },
      line: { color: '#e53e3e', width: 3 }
    };

    const layout = {
      title: 'Método de Runge-Kutta RK4',
      xaxis: { title: 'x', gridcolor: '#e2e8f0' },
      yaxis: { title: 'y', gridcolor: '#e2e8f0' },
      plot_bgcolor: '#ffffff',
      paper_bgcolor: '#ffffff'
    };

    Plotly.newPlot('graph_rk', [trace], layout, { responsive: true, displayModeBar: false });
    
  } catch (e) {
    showOutput('out_rk', "❌ Error: " + e.message, true);
    console.error('Error en Runge-Kutta:', e);
  }
}

// Inicializar cuando cargue la página
initPyodide();