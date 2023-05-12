// dataPieces: visualizador de piezas basadas en datos en HTML Canvas.
// implementación para Ojos Al Gasto, de Politica Colectiva
// por @darredondort

// Input datos: un array de valores numéricos (pieceValues), un array de etiquetas texturales (typeLabels). 
let localidad = "San Luis Potosí";
let uso = "gastó";
let año = "2021";

// Categorías COG
const typeLabels = ["Servicios personales", "Materiales y suministros", "Servicios generales", "Inversiones financieras y otras provisiones", "Deuda pública", "Participaciones y aportaciones", "Bienes muebles, inmuebles e intangibles", "Transferencias, asignaciones, subsidios y otras ayudas", "Inversión pública"];
const pieceValues = [28.99, 1.16, 4.25, 37.73, 0.46, 6.95, 0.39, 19.87, 2.36];

const colors = ["#FFCDFD", "#8AB8C7", "#EB74A4", "#FE8550", "#608D9C", "#A43367", "#FDBB38", "#1D776E", "#8AB8C7"];

let offscreenBack;
let offscreenCanvas;

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
let updatePieces;

let gridValue = 100;
let pieceCurrCount = pieceValues[step];
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

  offscreenBack = createGraphics(480, 420);
  offscreenCanvas = createGraphics(width, height);

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


  updatePieces = function () {
    clear();
    step = 0;
    pieceStep = 0;
  
    for (const [i, piece] of pieces.entries()) {
      if (step < typeLabels.length) {
  
        if (pieceValues[step] < 1) {
          pieceCurrCount = ceil(pieceValues[step]);
        } else {
          pieceCurrCount = round(pieceValues[step]);
        }
  
       
        if (step < colors.length) {
          currCol = colors[step];
          pieceCol = color(currCol);
          piece.label = typeLabels[step];
          piece.value = pieceCurrCount;
  
          pieceCol.setAlpha(1);
          piece.setCol(pieceCol, highAlpha);
          piece.draw();
  
          let currDistX = abs(mouseX - piece.x - piece.width / 2);
          let currDistY = abs(mouseY - piece.y - piece.height / 2);
          if (currDistX <= piece.width / 2 && currDistY <= piece.height / 2) {
            valueLabel.style("color", piece.col);
            valueLabel.html(`$${piece.value}`);
            typeLabel.html(piece.label);
          }
        }
        
        pieceSum += pieceCurrCount;
        console.log("pieceSum: ", pieceSum);
        if (pieceStep < pieceCurrCount) {
          pieceStep++;
        } else {
          pieceStep = 1;
          step++;
        }
  
      } 
    }
  }
  
  updatePieces();


  valueLabel.style("color", "#000000");
  valueLabel.html("$100");
  typeLabel.html("Selecciona una categoría");
}


function draw() {

}

function mousePressed() {
  updatePieces();
}

function keyPressed(uso, localidad) {
  if (key === ' ') { // Check if the spacebar key is pressed
    saveSummary();
  }
}

function saveSummary() {
  let sumMargin = 26;
  let scaleFactor = 0.75;
  let titleSize = 22;

  offscreenBack.clear();
  offscreenCanvas.clear();

  offscreenBack.background(255);

  loadFont('./fonts/Gotham Black.otf', boldFont =>
  loadFont('./fonts/Gotham Medium.ttf', medFont =>

  loadImage('./img/fondo-billete-ilustrado-BW-01.png', img => {
    offscreenBack.image(img, sumMargin, sumMargin*2.5, width*scaleFactor, height*scaleFactor);
    offscreenBack.background(255,100);
    offscreenCanvas.image(canvas, 0, 0); 
    offscreenBack.image(offscreenCanvas, sumMargin, sumMargin*2.5, width*scaleFactor, height*scaleFactor);

    // textos título
    offscreenBack.textAlign(LEFT, CENTER);
    offscreenBack.textFont(boldFont);
    offscreenBack.fill(0);
    offscreenBack.textSize(titleSize);
    offscreenBack.textLeading(titleSize);
    offscreenBack.text(`${localidad} \nen un billete.`, width, sumMargin*2);
    offscreenBack.textFont(medFont);
    offscreenBack.textSize(titleSize/2);
    offscreenBack.text(`Así ${uso} su presupuesto en 2021:`, width, sumMargin*4);
    
    // leyenda colores y valores
    let legSep = 30;
    let legSize = 9;
    for (let i = 0; i < typeLabels.length; i++) {
      offscreenBack.fill(colors[i]);
      offscreenBack.noStroke();
      offscreenBack.rectMode(CENTER);
      // offscreenBack.rect(width, sumMargin*5 + legSep*i, 14, 14);

      offscreenBack.fill(colors[i]);
      offscreenBack.textFont(boldFont);
      offscreenBack.textSize(legSize*1.25);
      offscreenBack.textAlign(LEFT, BOTTOM);
      offscreenBack.text(`$${pieceValues[i]}`, width, sumMargin*5 + legSep*i + legSize/2);

      offscreenBack.fill(0);
      offscreenBack.textFont(medFont);
      offscreenBack.textSize(legSize);
      offscreenBack.textAlign(LEFT, BOTTOM);
      offscreenBack.text(typeLabels[i], width, sumMargin*5 + legSep*i + legSize*1.40);
    }

    loadImage('./img/polcol-logo-negro-500px-01.png', logoPolCol => {
      offscreenBack.image(logoPolCol, sumMargin, sumMargin, 100, 21);
    // guardar png
    saveCanvas(offscreenBack, `Billete ${localidad} ${año}`, 'png'); // Save the offscreen canvas as a .png file with the given name
    })
  })));
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