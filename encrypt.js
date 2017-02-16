let email = 'northychen@gmail.com';
let key =   '-= northychen.com =-';

let out = email.split('').map((c, i) => String.fromCharCode((key.charCodeAt(i) ^ email.charCodeAt(i)) + 32)).join('');
let rec = key.split('').map((c, i) => String.fromCharCode((key.charCodeAt(i) ^ (out.charCodeAt(i) - 32)))).join('');

console.log(out);
console.log(rec);
