var express=require("express");
var app =express();

var books=[
	{title:"Programacion con java",id:1},
	{title:"Programacion con c++",id:2},
	{title:"Programacion con python",id:3},
]

//MIDLEWARES
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.listen(3700,()=>{
    console.log("Servidor ok");
})