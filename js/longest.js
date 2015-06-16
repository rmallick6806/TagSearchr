var cars = ["saab", "poooooooooooo"];

function longestLength(arrays) {
	var wordLength = 0;
	var word;
	for (var i = 0; i < arrays.length; i++) {
		if(wordLength < arrays[i].length){
			wordLength = arrays[i].length;
			word = arrays[i];
		}
		else {
			//
		}
	};
	console.log(word);
};

longestLength(cars)