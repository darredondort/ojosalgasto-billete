// dataPieces: visualizador de piezas basadas en datos en HTML Canvas.
// implementación para Ojos Al Gasto, de Politica Colectiva
// por @darredondort

// Input datos: un array de valores numéricos (pieceCounts), un array de etiquetas texturales (typeLabels). 
// Categorías COG
const typeLabels = ["Servicios personales", "Materiales y suministros", "Servicios generales", "Inversiones financieras y otras provisiones", "Deuda pública", "Participaciones y aportaciones", "Bienes muebles, inmuebles e intangibles", "Transferencias, asignaciones, subsidios y otras ayudas", "Inversión pública"];
const pieceCounts = [28.99, 1.16, 4.25, 37.73, 0.46, 6.95, 0.39, 19.87, 2.36];

const colors = ["#FFCDFD", "#CCFBFF", "#EB74A4", "#FE8550", "#376473", "#A43367", "#FDBB38", "#1D776E", "#8AB8C7"];


let pieceStep = 0;
let pieceSum = 0;

let step = 0;

// let highCol;
let highAlpha = 200;
// let lowAlpha = 40;

let currCol;
let pieceCol;

let canvas;
let typeLabel;
let nextGrid;

let gridValue = 100;
let pieceCurrCount = pieceCounts[step];
let pieceLowCount = gridValue - pieceCurrCount;

const pieceWidth = 49;
const pieceHeight = 14;
const piecePadding = 5;

let pieces = [];
let posX = [];
let posY = [];

function setup() {
  canvas = createCanvas(207, 449);
  canvas.parent("grid-holder");

  typeLabel = select("#label-billete");

  valueLabel = select("#value-billete");
  valueLabel.style("color", colors[step]);

  highCol = color(colors[0]);

  currCol = colors[step];
  pieceCol = color(currCol);

  // Crear una retícula con nuevas instancias de piezas de 25 filas x 4 columnas.
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 4; j++) {
      let x = 0;
      let y = 0;
      // valores hard coded para anclar proporciones
      let targetX = j * 52;
      let targetY = i * 18;
      posX.push(targetX);
      posY.push(targetY);
      pieces.push(new DataPiece(targetX, targetY, pieceWidth, pieceHeight, "#383838", typeLabels[step]));
    }
  }

  if (step < typeLabels.length) {


    for (const [i, piece] of pieces.entries()) {
      if (pieceCounts[step] < 1) {
        pieceCurrCount = ceil(pieceCounts[step]);
      } else {
        pieceCurrCount = round(pieceCounts[step]);
      }


      console.log("pieceStep: ", pieceStep);
      console.log("pieceCurrCount: ", pieceCurrCount);
      console.log("curr typeLabels: ", typeLabels[step]);


      if (pieceStep < pieceCurrCount) {
        
        pieceStep++;

      } else {
        pieceStep = 1;
        step++;
      }

      currCol = colors[step];
      pieceCol = color(currCol);
      piece.label = typeLabels[step];
      piece.value = pieceCurrCount;

      pieceCol.setAlpha(1)
      piece.setCol(pieceCol, highAlpha);
      piece.draw();
    }


  } else {
    pieceStep = 0;
    step = 0;
  }
  pieceSum += pieceCurrCount;
  console.log("pieceSum: ", pieceSum);


  valueLabel.style("color", "#000000");
  valueLabel.html("$100");
  typeLabel.html("Selecciona una categoría");
}

function draw() {
  for (let piece of pieces) {
    let currDist = dist(mouseX, mouseY, piece.x, piece.y);

    if (mouseIsPressed) {
      if (currDist <= piece.width / 2 || currDist <= piece.height / 2) {
        console.log("curr piece.label", piece.label);

        valueLabel.style("color", piece.col);
        valueLabel.html(`$${piece.value}`);
        typeLabel.html(piece.label);
      }
    }
  }

}


class DataPiece {
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