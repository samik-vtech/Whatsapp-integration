const token = "Bearer " + "asdf";
const token1 = "asdf";


const [Bearer, tokens] = token.split(" ");
console.log(Bearer);
var tokenSplit;
if (!tokens) {
    console.log("token is not bearer")
    tokenSplit = token1;


} else {
    console.log("token is bearer");
    tokenSplit = tokens;

}

console.log(tokenSplit);