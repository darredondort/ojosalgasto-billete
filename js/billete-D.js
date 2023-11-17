// dataPieces: visualizador de piezas basadas en datos en HTML Canvas.
// implementación para Ojos Al Gasto, de Politica Colectiva
// por @darredondort

// Input data: an array of numerical values (pieceCounts), an array of textual labels (typeLabels).
let localidad = "San Luis Potosí";
let uso = "gastó";
let año = "2021";
let clasificador = "Clasificador por Objeto del Gasto";
let fuente =
  "Fuente: Datos obtenidos de la Cuenta Pública Oficial del Gobierno";

const typeLabels = [
  "Servicios personales",
  "Materiales y suministros",
  "Servicios generales",
  "Inversiones financieras y otras provisiones",
  "Deuda pública",
  "Participaciones y aportaciones",
  "Bienes muebles, inmuebles e intangibles",
  "Transferencias, asignaciones, subsidios y otras ayudas",
  "Inversión pública",
];
const pieceCounts = [28.99, 1.16, 4.25, 37.73, 0.46, 6.95, 0.39, 19.87, 2.36];

const colors = [
  "#FE8550",
  "#376473",
  "#B6E4F4",
  "#EB74A4",
  "#7FBCAC",
  "#A33367",
  "#FFD24F",
  "#1D776E",
  "#00B9FF",
];

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
    let h = (pieceCounts[i] / 100) * height; // convert percentages to pixels
    let y = height - totalHeight - h; // calculate y position from the bottom
    totalHeight += h;
    bars.push(
      new Bar(0, y, width, h, colors[i % colors.length], typeLabels[i])
    );
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
    if (
      mouseX >= bar.x &&
      mouseX <= bar.x + bar.width &&
      mouseY >= bar.y &&
      mouseY <= bar.y + bar.height
    ) {
      valueLabel.style("color", bar.color);
      valueLabel.html(`$${bar.value}`);
      typeLabel.html(bar.label);
    }
  }
}

function keyPressed(uso, localidad) {
  if (key === " ") {
    // Check if the spacebar key is pressed
    saveSummary();
  }
}

function saveSummary() {
  let sumMargin = 26;
  let scaleFactor = 0.75;
  let titleSize = 22;

  // Set pixelDensity when creating the graphics
  let offscreenBack = createGraphics(480, 420, {
    pixelDensity: displayDensity(),
  });
  let offscreenCanvas = createGraphics(207, 449, {
    pixelDensity: displayDensity(),
  });

  offscreenBack.clear();
  offscreenCanvas.clear();
  offscreenBack.background(255);

  loadFont("./fonts/Gotham Black.otf", (boldFont) => {
    loadFont("./fonts/Gotham Medium.ttf", (medFont) => {
      loadImage("./img/fondo-billete-ilustrado-BW-01.png", (img) => {
        offscreenBack.image(
          img,
          sumMargin,
          sumMargin * 2.5,
          width * scaleFactor,
          height * scaleFactor
        );
        offscreenBack.background(255, 100);
        // Set the tint for 50% opacity
        offscreenCanvas.tint(255, 127); // 127 out of 255 for alpha (50% opacity)

        offscreenCanvas.image(canvas, 0, 0);

        // Reset the tint to full opacity
        offscreenCanvas.noTint();
        offscreenBack.image(
          offscreenCanvas,
          sumMargin,
          sumMargin * 2.5,
          width * scaleFactor,
          height * scaleFactor
        );

        // textos título
        offscreenBack.textAlign(LEFT, CENTER);
        offscreenBack.textFont(boldFont);
        offscreenBack.fill(0);
        offscreenBack.textSize(titleSize);
        offscreenBack.textLeading(titleSize);
        offscreenBack.text(
          `${localidad} \nen un billete.`,
          width,
          sumMargin * 2
        );
        offscreenBack.textFont(medFont);
        offscreenBack.textSize(titleSize / 2);
        offscreenBack.text(
          `Así ${uso} su presupuesto en 2021:`,
          width,
          sumMargin * 4
        );
        offscreenBack.textSize(titleSize / 3.5);

        let clasificadorTitle = clasificador.toUpperCase();
        // offscreenBack.text(clasificadorTitle, width, offscreenBack.height - sumMargin );
        offscreenBack.text(
          `${clasificadorTitle} \n ${fuente}`,
          width,
          offscreenBack.height - sumMargin / 1.5
        );

        // leyenda colores y valores
        let legSep = 30;
        let legSize = 9;
        for (let i = 0; i < typeLabels.length; i++) {
          let barCol = color(colors[i]);
          barCol.setAlpha(100);
          offscreenBack.fill(barCol);
          offscreenBack.noStroke();
          offscreenBack.rectMode(CENTER);
          // offscreenBack.rect(width, sumMargin*5 + legSep*i, 14, 14);

          offscreenBack.fill(colors[i]);
          offscreenBack.textFont(boldFont);
          offscreenBack.textSize(legSize * 1.25);
          offscreenBack.textAlign(LEFT, BOTTOM);
          offscreenBack.text(
            `$${pieceCounts[i]}`,
            width,
            sumMargin * 5 + legSep * i + legSize / 2
          );

          offscreenBack.fill(0);
          offscreenBack.textFont(medFont);
          offscreenBack.textSize(legSize);
          offscreenBack.textAlign(LEFT, BOTTOM);
          offscreenBack.text(
            typeLabels[i],
            width,
            sumMargin * 5 + legSep * i + legSize * 1.4
          );
        }

        loadImage("./img/sello-pc-negro.png", (logoPolCol) => {
          offscreenBack.image(
            logoPolCol,
            offscreenBack.width - sumMargin * 2.5,
            sumMargin / 2,
            36,
            36
          );

          loadImage("./img/pc_assets_logoOjos-hor.png", (logoOjos) => {
            offscreenBack.image(logoOjos, sumMargin, sumMargin / 2, 144, 41.48);
            // guardar png
            saveCanvas(offscreenBack, `Billete ${localidad} ${año}`, "png");
          });
        });
      });
    });
  });
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
