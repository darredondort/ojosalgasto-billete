// dataPieces: visualizador de piezas basadas en datos en HTML Canvas.
// implementación para Ojos Al Gasto, de Politica Colectiva
// por @darredondort

// Input data: an array of numerical values (pieceCounts), an array of textual labels (typeLabels).
let localidad = "San Luis Potosí";
let uso = "gastó";
let año = "2021";
let clasificador = "Clasificador por Objeto del Gasto";
let fuente = "Fuente: Datos obtenidos de la Cuenta Pública Oficial del Gobierno";

const typeLabels = ["Servicios personales", "Materiales y suministros", "Servicios generales", "Inversiones financieras y otras provisiones", "Deuda pública", "Participaciones y aportaciones", "Bienes muebles, inmuebles e intangibles", "Transferencias, asignaciones, subsidios y otras ayudas", "Inversión pública"];
const pieceCounts = [28.99, 1.16, 4.25, 37.73, 0.46, 6.95, 0.39, 19.87, 2.36];

const colors = ["#FE8550", "#376473", "#B6E4F4", "#EB74A4", "#7FBCAC", "#A33367", "#FFD24F", "#1D776E", "#00B9FF"];

let bars = [];

let valueLabel, typeLabel, typeCol;

let offscreenBack;
let offscreenCanvas;

function setup() {
  canvas = createCanvas(207, 449);
  canvas.parent("grid-holder");

  offscreenBack = createGraphics(480, 420);
  offscreenCanvas = createGraphics(width, height);

  valueLabel = select("#value-billete");
  typeLabel = select("#label-billete");

  let totalHeight = 0;

  for (let i = typeLabels.length - 1; i >= 0; i--) {
    let h = pieceCounts[i] / 100 * height;  // convert percentages to pixels
    let y = height - totalHeight - h;  // calculate y position from the bottom
    totalHeight += h;
    bars.push(new Bar(0, y, width, h, colors[i % colors.length], typeLabels[i]));
  }

  valueLabel.style("color", "#000000");
  valueLabel.html("$100");
  typeLabel.html("Selecciona una categoría");
}

function draw() {
  background(255);
  for (let bar of bars) {
    bar.draw();
  }
}

function mousePressed() {
  for (let bar of bars) {
    if (mouseX >= bar.x && mouseX <= bar.x + bar.width && mouseY >= bar.y && mouseY <= bar.y + bar.height) {
      
      valueLabel.style("color", bar.color);
      valueLabel.html(`$${bar.value}`);
      typeLabel.html(bar.label);
    }
  }
}


class Bar {
  constructor(x, y, width, height, color, label) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.label = label;
    this.value = pieceCounts[typeLabels.indexOf(label)];
  }

  draw() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }
}
