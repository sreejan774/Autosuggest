/* Trie Data Structure */

let Node = function() {
	this.keys = new Map();
	this.end = false;
	this.setEnd = function() {
		this.end = true;
	};
	this.isEnd = function() {
		return this.end;
	};
};

let Trie = function() {

	this.root = new Node();

	this.insert = function(input, node = this.root) {
		if (input.length == 0) {
			node.setEnd();
			return;
		} else if (!node.keys.has(input[0])) {
			node.keys.set(input[0], new Node());
			return this.insert(input.substr(1), node.keys.get(input[0]));
		} else {
			return this.insert(input.substr(1), node.keys.get(input[0]));
		};
	};

	this.isWord = function(word) {
		let node = this.root;
		while (word.length > 1) {
			if (!node.keys.has(word[0])) {
				return false;
			} else {
				node = node.keys.get(word[0]);
				word = word.substr(1);
			};
		};
		return (node.keys.has(word) && node.keys.get(word).isEnd()) ?
      true : false;
	};

	this.print = function() {
		let words = new Array();
		let search = function(node, string) {
			if (node.keys.size != 0)
      {
				for (let letter of node.keys.keys())
        {
					search(node.keys.get(letter), string.concat(letter));
				};
				if (node.isEnd())
        {
					words.push(string);
				};
			}
      else
      {
				string.length > 0 ? words.push(string) : undefined;
				return;
			};
		};
		search(this.root, new String(""));
		return words.length > 0 ? words : mo;
	};

  this.autoComplete = function(str){
    if(str.length == 0){
      return;
    }
    let words = new Array();

    let printSubTrie = function(node, string) {
			if (node.keys.size != 0){
				for (let letter of node.keys.keys()){
					printSubTrie(node.keys.get(letter), string.concat(letter));
				};
				if (node.isEnd()){
					words.push(string);
				};
			}
      else{
				string.length > 0 ? words.push(string) : undefined;
				return;
			};
		};

    let i = 0;
    var s = "";
    let k;
    let node = this.root;
    while(i<str.length){
      k = str[i];
      s=s+k;
      if(node.keys.has(k)){
        node= node.keys.get(k);
      }
      else{
          return ;
      }
      i++;
    }
    printSubTrie(node , s);
    return(words)
  };
};

let arr = [];
var T = new Trie();
let array = document.querySelectorAll(".listContent");
for(let i = 0;i< array.length ; i++){
  let obj = {
    name: array[i].childNodes[1].innerText,
    number: array[i].childNodes[3].innerText,
    email: array[i].childNodes[7].innerText
  }
  arr.push(obj.name);
  T.insert(obj.name);
}


var clearBox = function(){
  let length = document.querySelector("#suggestion-box").children.length;
  for(let i = 0 ; i< length ; i++){
    var myobj = document.querySelector("#suggestion-box p");
    myobj.remove();
  }
}




var searchInput = document.querySelector(".search-input");

searchInput.addEventListener("keyup",function(){
  var str = searchInput.value;
  clearBox();
  //console.log(str);
  var suggestions = T.autoComplete(str);
  for(var k = 0;k<suggestions.length;k++){
    // console.log(suggestions[k]);
    var para = document.createElement("p");
    para.setAttribute('class', 'suggestion');
    var node = document.createTextNode(suggestions[k]);
    para.appendChild(node);
    var element = document.getElementById("suggestion-box");
    element.appendChild(para);
  }
});

var closeButton = document.querySelector(".searchResult button");
closeButton.addEventListener("click",function(){
  var searchResult = document.querySelector(".searchResult");
  searchResult.remove();
});
