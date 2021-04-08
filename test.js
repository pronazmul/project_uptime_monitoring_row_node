const createRandomString = (stringLength)=>{
    let length = stringLength
    const possibleChar = 'abcdefghijklmnopqrstuvwxyz0123456789'

    let output = ''
    for(i=0; i<= length; i++){
        const randomChar = possibleChar.charAt(Math.floor(Math.random()*possibleChar.length));
        output += randomChar
    }
    return output
}
console.log(createRandomString(10))