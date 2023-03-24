// dataPieces: visualizador de segmentos basados en datos
// implementación para Ojos Al Gasto, de Politica Colectiva
// por @darredondort

// Input datos: 1 array de valores numéricos (segHighCounts), 1 array de etiquetas texturales (typeLabels). 

// Categorías específicas billete:
const typeLabels = ["Salud", "Obra pública", "Educación", "Nómina", "Comunicación social"];
const segHighCounts = [10.77, 7.21, 39.20, 13.88, 0.15]

// Categorías COG
// const typeLabels = ["Servicios Personales", "Materiales y Suministros", "Servicios Generales", "Transferencia, asignaciones, subsidios y otras ayudas", "Bienes muebles, inmuebles e intangibles", "Inversión", "Inversiones financieras y otras previsiones", "Participaciones y aportaciones", "Deuda pública"];
// const segHighCounts = [28.99, 1.16, 4.25, 37.73, 0.46, 6.95, 0.39, 19.87, 2.36];

const colors = ["#F7D793", "#EF593F", "#175349", "#50A2BF", "#EE77A7", "#01BAFF", "#00E4AE", "#FE8550", "#FF02FE"];
// const colors = ["#F2BA36", "#EF593F", "#175349", "#50A2BF", "#EF593F", "#F2BA36", "#175349", "#50A2BF"];
let step = 0;
let timer = 0;
let timerInt = 2; // intervalo de segundos entre un cambio de vista y otro
let fps = 60; // intervalo de segundos entre un cambio de vista y otro

let highCol;
let highAlpha = 200;
let lowAlpha = 40;

let canvas;
let typeLabel;
let nextGrid;

let gridValue = 100;
let segHighCount = segHighCounts[0];
let segLowCount = gridValue - segHighCount;

const segWidth = 49;
const segHeight = 14;
const segPadding = 5;

let segments = [];
let posX = [];
let posY = [];

function setup() {
  canvas = createCanvas(207, 449);
  canvas.parent("grid-holder");

  typeLabel = select("#label-billete");
  // typeLabel.style("color",colors[step]);

  valueLabel = select("#value-billete");
  valueLabel.style("color",colors[step]);
  // console.log(valueLabel);

  highCol = color(colors[0]);

  // Crear una retícula con nuevas instancias de segmentos de 24 filas x 4 columnas.
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 4; j++) {
      let x = 0;
      let y = 0;
      // valores hard coded para anclar proporciones
      let targetX = j * 52;
      let targetY = i * 18;
      posX.push(targetX);
      posY.push(targetY);
      segments.push(new Segment(targetX, targetY, segWidth, segHeight, segHighCounts[step], typeLabels[step]));
    }
  }

  nextGrid = function() {
    if (step < typeLabels.length - 1) {
      step++
      // segHighCount = round(segHighCounts[step]);
      segHighCount = ceil(segHighCounts[step]);
      highCol = color(colors[step]);
      valueLabel.style("color",colors[step]);
      typeLabel.style("opacity",1);

    } else {
      step = 0;
      highCol = color(colors[step]);
      valueLabel.style("color",colors[step]);
      typeLabel.style("opacity",1);
    }
    segLowCount = gridValue - segHighCount;
  }
}

function draw() {
  for (const [i, segment] of segments.entries()) {
    let segmentCol = color("#FFC7DB");
    segmentCol.setAlpha(0.1)
    segment.setCol(segmentCol, lowAlpha);
    segment.draw();
    let labelStrokeCol = color(255, 200, 0);
    segment.setLabelStroke(10, labelStrokeCol, 200);

    if (i > segLowCount - 1) {
      segments[i].setCol(highCol, highAlpha);
      segments[i].draw();
    }
  }
  valueLabel.html(`$${segHighCounts[step]}`);
  typeLabel.html(typeLabels[step]);

  // cambiar vista y datos de retícula cada timerInt segundos, calculados por frameRate actual de p5.js (pasos en bucle)
  // if (timer < round(timerInt*frameRate())) {
  if (timer < round(timerInt*fps)) {
    timer++;
  } else {
    nextGrid();
    timer = 0;
  }
  // console.log(timer);
}

// cambiar vista y datos de retícula con clic (pasos en bucle)
// function mousePressed() {
//   nextGrid()
// }

class Segment {
  constructor(x, y, newWidth, newHeight, value, label) {
    this.x = x;
    this.y = y;
    this.width = newWidth;
    this.height = newHeight;
    this.value = value;
    this.label = label;
    this.px = x;
    this.py = y;
    this.col = color(0, 255, 0);
    this.alpha = 255;
    this.strokeCol = 0;
    this.strokeAlpha = 0;
    this.strokeWeight = 1;
    this.labelCol = 0;
    this.labelAlpha = 255;
    this.labelStrokeCol = 255;
    this.labelStrokeAlpha = 255;
    this.labelStrokeWeight = 1;
    this.speed = 5;
  }
  

  moveTo(x, y, speed) {
    let target = createVector(x, y);
    let position = createVector(this.x, this.y);
    let direction = target.sub(position);
    let distance = direction.mag();
    this.speed = speed;

    if (distance > 1) {
      direction.normalize();
      direction.mult(this.speed);
      position.add(direction);
      this.x = position.x;
      this.y = position.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  update() {
    this.moveTo(this.px, this.py);
  }

  draw() {
    fill(this.col, this.alpha);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }

  setCol(newCol, newAlpha) {
    this.col = newCol;
    this.alpha = newAlpha;
    this.col.setAlpha(this.alpha);
  }

  setStroke(newWeight, newCol, newAlpha) {
    this.strokeWeight = newWeight;
    this.strokeCol = newCol;
    this.strokeCol.setAlpha(newAlpha);

    stroke(this.strokeWeight);
    stroke(this.strokeWeight);
    stroke(this.strokeWeight);
  }

  displayLabels(label) {
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(this.labelCol, this.labelAlpha);
    stroke(this.labelStrokeCol, this.labelStrokeAlpha);
    strokeWeight(this.labelStrokeWeight);
    text(label, this.x, this.y);
  }

  setLabelStroke(newlabelStrokeWeight, newlabelStrokeCol, newlabelStrokeAlpha) {
    this.labelStrokeCol = newlabelStrokeCol;
    this.labelStrokeAlpha = newlabelStrokeAlpha;
    this.labelStrokeWeight = newlabelStrokeWeight;
  }
}