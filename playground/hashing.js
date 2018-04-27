const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');

const data={
    id:10
};
const token=jwt.sign(data,'123abc');
console.log(`Token: ${token}`);

const decoded=jwt.verify(token,'123abc');
console.log('Decoded :', decoded);



// const message='i am user 1';
// const hash=SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`The Hash: ${hash}`);

// const data={
//     id:4
// };

// const token={
//     data,
//     hash:SHA256(JSON.stringify(data)+ 'somesecret').toString()
// };

// // token.data.id=5;
// // token.hash=SHA256(JSON.stringify(token.data)).toString();
// const resultHash=SHA256(JSON.stringify(token.data)+ 'somesecret').toString();

// if(resultHash===token.hash){
//     console.log('data was not changed!');
// } else{
//     console.log('data was changed')
// }



