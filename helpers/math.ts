function factorial(n:number):number{
	if (n === 0) {
		return 1;
	}
	return n * factorial(n - 1);
}

function log(n:number, base:number){
	return Math.log(n) / Math.log(base);
}

class ChainableNumber {
	static E = Math.E;
	static PI = Math.PI;
	static PHI = (1 + Math.sqrt(5)) / 2;
	static EPSILON = Number.EPSILON;

	static fromExponential(n:string="0e0") {
		let [m, e] = n.split("e");
		return new ChainableNumber(parseFloat(m) * Math.pow(10, parseInt(e)));
	}

	#value:number;
	constructor(value:number) {
		this.#value = value;
	}


	plus(n:number) {
		this.#value += n;
		return this;
	}

	minus(n:number) {
		this.#value -= n;
		return this;
	}

	multiply(n:number) {
		this.#value *= n;
		return this;
	}

	divide(n:number) {
		this.#value /= n;
		return this;
	}

	mod(n:number) {
		this.#value %= n;
		return this;
	}

	equals() {
		return this.#value;
	}

	toString() {
		return this.#value.toString();
	}

	factorial() {
		this.#value = factorial(this.#value);
		return this;
	}

	log(base:number) {
		this.#value = log(this.#value, base);
		return this;
	}

	pow(n:number) {
		this.#value = Math.pow(this.#value, n);
		return this;
	}

	root(n:number) {
		return this.pow(1/n);
	}

	sqrt() {
		return this.root(2);
	}

	cbrt() {
		return this.root(3);
	}

	sin() {
		this.#value = Math.sin(this.#value);
		return this;
	}

	cos() {
		this.#value = Math.cos(this.#value);
		return this;
	}

	tan() {
		this.#value = Math.tan(this.#value);
		return this;
	}

	asin() {
		this.#value = Math.asin(this.#value);
		return this;
	}

	acos() {
		this.#value = Math.acos(this.#value);
		return this;
	}

	atan() {
		this.#value = Math.atan(this.#value);
		return this;
	}

	sec() {
		this.#value = 1 / Math.cos(this.#value);
		return this;
	}

	csc() {
		this.#value = 1 / Math.sin(this.#value);
		return this;
	}

	cot() {
		this.#value = 1 / Math.tan(this.#value);
		return this;
	}

	asec() {
		this.#value = Math.acos(1 / this.#value);
		return this;
	}

	acsc() {
		this.#value = Math.asin(1 / this.#value);
		return this;
	}

	acot() {
		this.#value = Math.atan(1 / this.#value);
		return this;
	}

	floor() {
		this.#value = Math.floor(this.#value);
		return this;
	}

	ceil() {
		this.#value = Math.ceil(this.#value);
		return this;
	}

	round() {
		this.#value = Math.round(this.#value);
		return this;
	}

	abs() {
		this.#value = Math.abs(this.#value);
		return this;
	}

	sign() {
		this.#value = Math.sign(this.#value);
		return this;
	}

	trunc() {
		this.#value = Math.trunc(this.#value);
		return this;
	}

	toInt() {
		this.#value = parseInt(this.#value.toString());
		return this;
	}

	toFloat() {
		this.#value = parseFloat(this.#value.toString());
		return this;
	}

	toExponential(n:number) {
		return this.#value.toExponential(n);
	}

	toFixed(n:number) {
		return this.#value.toFixed(n);
	}

	bounded(min:number, max:number) {
		this.#value = Math.min(Math.max(this.#value, min), max);
		return this;
	}

	lerp(min:number, max:number) {
		this.#value = min + (max - min) * this.#value;
		return this;
	}

	toNumber() {
		return this.#value;
	}
	
	isNaN() {
		return isNaN(this.#value);
	}

	isFinite() {
		return isFinite(this.#value);
	}

	isInfinite() {
		return !isFinite(this.#value);
	}

	isInteger() {
		return Number.isInteger(this.#value);
	}

	isSafeInteger() {
		return Number.isSafeInteger(this.#value);
	}

	isFloat() {
		return !Number.isInteger(this.#value);
	}

	isOdd() {
		return this.#value % 2 === 1;
	}

	isEven() {
		return this.#value % 2 === 0;
	}

	factors() {
		if (this.#value === 0) return [0];
		if (this.#value === 1) return [1];
		if (this.#value === -1) return [-1];
		if (this.isFloat()) return [];
		if (this.isInfinite()) return [Infinity];
		if (this.isNaN()) return [NaN];
		
		let factors:number[] = [];

		let n = Math.abs(this.#value);
		for (let i = 1; i <= n; i++) {
			if (n % i === 0) factors.push(i);
		}
		return factors;
	}

	isPrime() {
		return this.factors().length===2;
	}

	primeFactors() {
		if (this.#value === 0) return [0];
		if (this.#value === 1) return [1];
		if (this.#value === -1) return [-1];
		if (this.isFloat()) return [];
		if (this.isInfinite()) return [Infinity];
		if (this.isNaN()) return [NaN];
		
		let factors:number[] = [];

		let n = Math.abs(this.#value);
		for (let i = 2; i <= n; i++) {
			while (n % i === 0) {
				factors.push(i);
				n /= i;
			}
		}
		return factors;
	}

	toRadical() {
		return new Radical(1, this.#value);
	}

}

class Radical {
	#coefficient:number;
	#radicand:number;
	#radicandRoot:number=2;
	constructor(coefficient:number, radicand:number, radicandRoot:number=2) {
		this.#coefficient = coefficient;
		this.#radicand = radicand;
		this.#radicandRoot = radicandRoot;
	}

	toString() {
		return `${this.#coefficient}(${this.#radicandRoot}√${this.#radicand})`;
	}

	approximate() {
		return new ChainableNumber(this.#coefficient * Math.pow(this.#radicand, 1 / this.#radicandRoot));
	}

	coefficient() {
		return this.#coefficient;
	}

	radicand() {
		return this.#radicand;
	}

	root() {
		return this.#radicandRoot;
	}

}


module.exports = {
	ChainableNumber,
	Radical,
	factorial,
	log,
	E: Math.E,
	PI: Math.PI,
	PHI: (1 + Math.sqrt(5)) / 2,
};