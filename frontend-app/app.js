let name ="ali" ;

const age = 33;

console.log (name);

console.log (age);

let num1= 99;
let str="str";


let a=10;
let b=3;

console.log (a+b);
console.log (a-b);
console.log (a*b);

let name1="ahmad";
let name2="sami"

console.log (name1+a);
console.log(name1+" "+name2);


let num=3;

if (num>25){
    console.log("hello")
}else {
    console.log("lower than 25")
}

function add(x,y){
    return x+y ;
}

console.log(add(10,5));



const num2=[1,2,3,4,5,6,7,'ali','ahmad'];

console.log(num2);


const dic={
    "name":"ali",
    "age": 33,
    "skills": "css"
}


console.log(dic.skills);
//كود لمجموعه طلاب وحساب علاماتلهم

const students=[
    {name4:"ahmad",grade:80},
    {name4:"slma",grade:90},
    {name4:"rami",grade:79}

];
const checkresult=(grade)=>{
    if (grade>50){
        console.log("ناجح");
    }else{
        console.log("راسب");
    }
};


students.map((students)=>{
    const result=checkresult(students.grade)
    console.log(students.name4 + " : "+ result)
});
