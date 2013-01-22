function sortObj(arr){
	// Setup Arrays
	var sortedKeys = new Array();
	var sortedObj = {};

	// Separate keys and sort them
	for (var i in arr){
		sortedKeys.push(i);
	}
	sortedKeys.sort();

	// Reconstruct sorted obj based on keys
	for (var i in sortedKeys){
		sortedObj[sortedKeys[i]] = arr[sortedKeys[i]];
	}
	return sortedObj;
}

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

String.prototype.removeCharAt = function (index) {
	return this.substr(0, index) + this.substr(index +1);
}

String.prototype.replaceAt=function(index, char) {
      return this.substr(0, index) + char + this.substr(index+char.length);
}

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}