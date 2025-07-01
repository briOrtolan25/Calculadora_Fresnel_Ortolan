// Array para guardar historial
  const carousel = document.querySelector('#fondoCarousel');
  if (carousel) {
    const bsCarousel = new bootstrap.Carousel(carousel, {
      interval: 5000, // cambia cada 5 segundos
      ride: 'carousel'
    });
  }
const historial = [];


function parseInput(id) {
  const val = document.getElementById(id).value.trim().replace(',', '.');
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
}

function truncateTo2Decimals(num) {
  return Math.floor(num * 100) / 100;
}

document.getElementById("obstaculoCheck").addEventListener("change", function () {
  document.getElementById("obstaculoContainer").style.display = this.checked ? "block" : "none";
});

function mostrarHistorial() {
  const divHistorial = document.querySelector("#historial #historial") || document.getElementById("historial");
  if (!divHistorial) return;

  if (historial.length === 0) {
    divHistorial.innerHTML = "<i>No hay cálculos realizados aún.</i>";
    return;
  }
  let html = "<h5>Historial de cálculos</h5><ul class='list-group'>";
  historial.forEach((item) => {
    html += `<li class="list-group-item bg-dark text-light">
      <b>${item.fecha}</b> - Distancia: <b>${item.distancia} km</b>, Frecuencia: <b>${item.frecuencia} GHz</b>, Resultado Fresnel: <b>${item.resultado} m</b>
    </li>`;
  });
  html += "</ul>";
  divHistorial.innerHTML = html;
}

function calcular() {
  const d = parseInput("distancia");
  const f = parseInput("frecuencia");
  const resultado = document.getElementById("resultado");
  const barraZona = document.getElementById("barraZona");
  const barraRecomendada = document.getElementById("barraRecomendada");
  const zonaCompletaVal = document.getElementById("zonaCompletaVal");

  resultado.innerText = "";
  barraZona.style.display = "none";
  barraRecomendada.style.width = "0%";
  zonaCompletaVal.innerText = "0";

  if (!d || d <= 0) {
    resultado.innerText = "❌ Ingrese una distancia válida mayor a 0.";
    return;
  }



  resultado.innerText += "📌 Recomendación: mantener libre al menos el 60% de la zona de Fresnel.\n\n";

  if (!f || f <= 0) {
    resultado.innerText += "📡 No se ingresó frecuencia. Mostrando tabla:\n\n";
    for (let freq = 1; freq <= 10; freq++) {
      const F1 = 17.31 * Math.sqrt(d / (4 * freq));
      resultado.innerText += `Frecuencia: ${freq} GHz → Fresnel: ${truncateTo2Decimals(F1)} m\n`;
    }
    return;
  }

  const F1 = 17.31 * Math.sqrt(d / (4 * f));
  const limite40 = F1 * 0.4;
  const limite60 = F1 * 0.6;

  resultado.innerText += `📍 Fresnel para ${d} km y ${f} GHz:\n`;
  resultado.innerText += `📏 Zona completa: ${truncateTo2Decimals(F1)} m\n`;
  resultado.innerText += `✅ Zona recomendada libre (40%-60%): entre ${truncateTo2Decimals(limite40)} m y ${truncateTo2Decimals(limite60)} m\n\n`;

  zonaCompletaVal.innerText = truncateTo2Decimals(F1);
  barraRecomendada.style.width = "60%";
  barraZona.style.display = "block";

  if (document.getElementById("obstaculoCheck").checked) {
    const h = parseInput("alturaObstaculo");
    if (!h || h <= 0) {
      resultado.innerText += "⚠ Altura del obstáculo inválida.\n";
    } else {
      if (h >= limite60) {
        resultado.innerText += `🚫 Obstáculo de ${truncateTo2Decimals(h)} m BLOQUEA la zona (60% = ${truncateTo2Decimals(limite60)} m)\n`;
      } else {
        resultado.innerText += `✅ Obstáculo de ${truncateTo2Decimals(h)} m NO bloquea la zona (60% = ${truncateTo2Decimals(limite60)} m)\n`;
      }
    }
  }

  // Guardar en historial
  const ahora = new Date();
  const fechaStr = ahora.toLocaleString('es-AR', { hour12: false });
  historial.unshift({
    fecha: fechaStr,
    distancia: d,
    frecuencia: f,
    resultado: truncateTo2Decimals(F1),
  });

  mostrarHistorial();
}

