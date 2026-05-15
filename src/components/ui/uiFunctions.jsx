function shouldRemove(char) {
    return char !== "*" ? true : Math.random() > 0.5;
}

function doubleAsterisk(char) {
    return char === "*" && Math.random() > 0.5 ? "**" : char;
}

function randomAsterisk(char) {
    return Math.random() > 0.5 ? "*" : char;
}

function maskAtInterval(interval, char, index) {
    return index === 0 || (index + 1) % interval === 0 ? char : "*";
}

function unmaskAtIndex(value, startIndex) {
    let valueLength = value.length;
    let sliced = value.slice(-startIndex);
    // let maskedNumber = sliced.padStart(maskedLength, "*");
    //Doesnt work well since padStart pads out a string till it reachs that target length
    //so in tha case of a 6 digit number getting reduced by 4, you would not have any ** caus the remainder would be 2 and you already are at 4 digits
    return sliced.padStart(value.length, "*");
    //This just takes the length and pads the slice with * till its at its orignal length
}

export { shouldRemove, doubleAsterisk, randomAsterisk, maskAtInterval, unmaskAtIndex };
