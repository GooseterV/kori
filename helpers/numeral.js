function log(n, base) {
	return Math.log(n) / Math.log(base);
}

function convert(n, b) {
	let q = [];
	let r = [];
	q[0] = n;
	for (let i = 0; q[i]>0; i++) {
		r[i] = q[i]%b;
		q[i+1] = Math.floor(q[i]/b);
	}
	return r.reverse();
}

class Num {

	constructor(value, base, mappings) {
		this.value = value;
		this.base = base;
		this.mappings = mappings;
		this.total = 0;
		this.exp = log(this.value, this.base);
		this.isEvenBase = Number.isInteger(this.exp);
	}

}

class MayanNumeral extends Num {
	static mappings = {
		0: 0,
		1: 1,
		2: 5,
		3: 20,
	};

	constructor(value) {
		super(value, 20, MayanNumeral.mappings);
		this.stack = value.toString(20).split("").map(x=>parseInt(x,20)).map(x=>this.construct(x));
		this.digits  = value.toString(20).split("").map(x=>parseInt(x,20));
	}

	construct(value) {
		if (value === 0) return [0];
		if (value < 1) return null;
		if (value < 5) return Array(value).fill(1);
		if (value === 5) return [2];
		if (value < 20) return (Array(Math.floor(value/5)).fill(5).concat(Array(value%5).fill(1))).reverse();
	}

	calc(stack = this.stack) {
		let total = 0;
		for (let i = 0; i<stack.length; i++) {
			total += stack[i].map(x => this.mappings[x]).reduce((a, b) => a + b) * (this.base**i);
		}
		return total;
	}

	export() {
		return this.digits.map(n =>
			String.fromCharCode(0xD834, 0xDEE0 + n)
		).join("");
	}
}

class BabylonianNumeral extends Num {
	static mappings = {};
	static chars = {
		0: "␣",
		1: "𒐕",
		2: "𒐖",
		3: "𒐗",
		4: "𒐘",
		5: "𒐙",
		6: "𒐚",
		7: "𒐛",
		8: "𒐜",
		9: "𒐝",
		10: "𒌋",
		20: "《",
		30: "𒌍",
		40: "𒐏",
		50: "𒐐",	
	};

	constructor(value) {
		super(value, 60, BabylonianNumeral.mappings);
		this.stack = convert(value, 60).map(x=>this.construct(x));
		this.digits = convert(value, 60);
	}

	construct(value) {
		if (value === 0) return [0];
		if (value < 10) return [value];
		if (value === 50) return [50];
		if (value === 40) return [40];
		if (value === 30) return [30];
		if (value === 20) return [20];
		return [parseInt(value.toString()[0]), parseInt(value.toString()[1])];
	}

	calc() {
		let stack = [].concat(this.stack);
		stack.reverse();
		let total = 0;
		for (let i = 0; i<stack.length; i++) {
			total += (parseInt(stack[i].join("")) * (this.base**i));
		}
		return total;
	}

}
// works up to 3999
class RomanNumeral extends Num{
	static mappings = {
		"I":1,
		"V":5,
		"X":10,
		"L":50,
		"C":100,
		"D":500,
		"M":1000

	};
	static inverseMappings = {
		1:"I",
		4:"IV",
		5:"V",
		9:"IX",
		10:"X",
		40:"XL",
		50:"L",
		90:"XC",
		100:"C",
		400:"CD",
		500:"D",
		900:"CM",
		1000:"M",
	};
	static fromString = (str="") => {
		if (!/^[I,V,X,L,C,D,M]+$/.test(str)) return Error("Invalid Roman Numeral");
		let t = 0;
		str.split("").map((x, i, a)=>{
			if (i+1 > a.length) return;
			if (
				RomanNumeral.mappings[x]<RomanNumeral.mappings[a[i+1]]
			) t -= RomanNumeral.mappings[x];
			else t += RomanNumeral.mappings[x];
		});
		return t;
	};
	constructor(value) {
		super(value, 10, RomanNumeral.mappings);
		this.roman = this.construct(value);
	}
	construct(n) {
		let roman = "";
		Object.entries(RomanNumeral.inverseMappings).forEach(x => {
			roman += x[1].repeat(n / x[0]);  n %= x[0]; 
		});
		return roman.replace(/I{5}/g, "V")
			.replace(/V{2}/g, "X")
			.replace(/X{5}/g, "L")
			.replace(/L{2}/g, "C")
			.replace(/C{5}/g, "D")
			.replace(/D{2}/g, "M")
			.replace(/DC{4}/g, "CM")
			.replace(/C{4}/g, "CD")
			.replace(/LX{4}/g, "XC")
			.replace(/X{4}/g, "XL")
			.replace(/VI{4}/g, "IX")
			.replace(/I{4}/g, "IV");
	}
}

module.exports = {
	Num,
	MayanNumeral,
	BabylonianNumeral,
	RomanNumeral
};