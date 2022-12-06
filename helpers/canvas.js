/* eslint-disable no-unused-vars */
const {loadImage, createCanvas, registerFont, DOMMatrix, CanvasRenderingContext2D, Canvas} = require("canvas");
const {readFileSync, writeFileSync, createWriteStream} = require("fs");
const pSBC = require("./pSBC.js");
const { Buffer } = require("buffer");
const {
	XMLSerializer
} = require("xmldom");

registerFont("./assets/TitanOne-Regular.ttf", { family: "Titan One" });
registerFont("./assets/Nunito-Regular.ttf", { family: "Nunito" });
registerFont("./assets/VarelaRound-Regular.ttf", { family: "Varela Round" });
registerFont("./assets/Oxygen-Bold.ttf", { family: "Oxygen" });
registerFont("./assets/NotoSansJP-Medium.otf", { family: "Noto Sans JP" });
registerFont("./assets/Quicksand-VariableFont_wght.ttf", { family: "Quicksand" });
registerFont("./assets/Ubuntu-Bold.ttf", { family: "Ubuntu Bold" });
function rgbToHex(r, g, b) {
	return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

const cropCanvas = (sourceCanvas,left,top,width,height) => {
	let destCanvas = createCanvas();
	destCanvas.width = width;
	destCanvas.height = height;
	destCanvas.getContext("2d").drawImage(
		sourceCanvas,
		left,top,width,height,  // source rect with content to crop
		0,0,width,height);      // newCanvas, same size as source rect
	return destCanvas;
};

function roundedRectangle(ctx, x, y, width, height, radius) {
	function drawEllipse(x, y, radiusX, radiusY) {
		ctx.beginPath();
		ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.fillRect(x, y + radius, width, height - (2 * radius));
	ctx.fillRect(x + radius, y, width - (2 * radius), height);
	drawEllipse(x+radius, y+radius, radius, radius, 0, 0, 2 * Math.PI);
	drawEllipse(x+width-radius, y+radius, radius, radius, 0, 0, 2 * Math.PI);
	drawEllipse(x+radius, y+height-radius, radius, radius, 0, 0, 2 * Math.PI);
	drawEllipse(x+width-radius, y+height-radius, radius, radius, 0, 0, 2 * Math.PI);
}

function createShadowedRectangle(ctx, x, y, width, height, offX, offY, color, shadowColor, radius, inset, gradient) {
	if (inset) offX *= -1, offY *=-1;
	ctx.fillStyle = shadowColor;
	roundedRectangle(ctx, x+offX, y+offY, width, height, radius);
	ctx.fillStyle = gradient?gradient:color;
	roundedRectangle(ctx, x, y, width, height, radius);
}

function createBorderedRectangle(ctx, x, y, width, height, borderWidth, borderColor, radius, widths) {
	ctx.fillStyle = borderColor;
	//if (widths) return roundedRectangle(ctx, x-widths.left, y-widths.top, width+widths.top+widths+widths.bottom, height+widths.left+widths.right, radius);
	roundedRectangle(ctx, x-borderWidth, y-(borderWidth), width+(borderWidth*2), height+(borderWidth*3), radius);
}


async function createCanvasFromImage(pathOrUrl, margins=[0, 0]) {
	const image  = await loadImage(pathOrUrl);
	let marginX = (margins[0]||0), marginY = (margins[1]||0);
	const canvas = createCanvas(image.width+marginX, image.height+marginY);
	const ctx = canvas.getContext("2d");
	ctx.drawImage(image, marginX/2, marginY/2, image.width, image.height);
	return {canvas, ctx};
}

async function addImageToCanvas(cvs, pathOrUrl) {
	const image = await loadImage(pathOrUrl);
	const ctx = cvs.getContext("2d");
	ctx.drawImage(image, 0, 0, image.width, image.height);
	return {canvas:cvs, ctx};
}

async function addImagesToCanvas(cvs, paths) {
	paths.forEach(async path=>path?await addImageToCanvas(cvs, path):null);
	return cvs;

}

function svgToImage(svg) {
	if (!svg) return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
	return "data:image/svg+xml;base64,"+Buffer.from(new XMLSerializer().serializeToString(svg.documentElement)).toString("base64");
}

function curvedRectangleTemp(ctx, x, y, width, height, radius) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
}

function inverseArc(ctx, bx, by, width, height, radiusb, radiust) {  
	ctx.arc(bx + width - radiusb, by - radiusb, radiusb, 0, 0.5 * Math.PI);
	ctx.arc(bx + radiusb, by - radiusb, radiusb, 0.5 * Math.PI, Math.PI);
	ctx.moveTo(bx + width, by - radiusb);
	ctx.lineTo(bx + width, by - height);
	ctx.arc(bx + width - radiust, by - height, radiust, 0, 0.5 * Math.PI);
	ctx.lineTo(bx + radiust, by - height + radiust);
	ctx.arc(bx + radiust, by - height, radiust, 0.5 * Math.PI, Math.PI);
	ctx.lineTo(bx, by - radiusb);
}

async function imageToBlook(imageUrl) {
	const im = await loadImage(imageUrl);
	const cvs = createCanvas(300, 300);
	const ctx = cvs.getContext("2d");
	curvedRectangleTemp(ctx, 0, 0, 300, 300, 42);
	ctx.clip();
	ctx.drawImage(im, 0, 0, 300, 300);
	ctx.restore();
	ctx.beginPath();
	inverseArc(ctx, 0, 300, 300, 78, 36, 31);
	ctx.fillStyle = "#00000055";
	ctx.fill();
	return cvs;
}

function saveCanvasToImage(canvas, f="image/png") {
	createWriteStream("./image.png").write(canvas.toBuffer(f));
}


module.exports = {
	createCanvasFromImage,
	saveCanvasToImage,
	roundedRectangle,
	createBorderedRectangle,
	cropCanvas,
	createShadowedRectangle,
	rgbToHex,
	addImageToCanvas,
	svgToImage,
	addImagesToCanvas,
	imageToBlook
};
