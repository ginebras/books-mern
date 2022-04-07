'use strict'

var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var { MongoClient }=require("mongodb");

var swaggerJSDOC=require("swagger-jsdoc");
var swaggerUI=require("swagger-ui-express");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

var database;

var options={
	definition:{
		openapi:"3.0.0",
		info:{
			title:"Proyecto de api para NodeJs y Mongodb",
			version:"1.0.0"
		},
		servers:[
			{
				url:"http://localhost:8080"
			}
		]
	},
	apis:["./mongodb.js"]
}

var swaggerSpec=swaggerJSDOC(options);
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerSpec));

/**
 * @swagger
 * /api:
 *  get:
 *   summary: This is used to check if get method works
 *   description: This is used to check if get method works
 *   responses:
 *    200:
 *     description: To check if get method works
 */

app.get("/api",(req,res)=>{
	res.status(200).send({mensaje:"Bienvenido a la API de mongodb"});
})

/**
 * @swagger
 * 
 * components:
 *  schema:
 *   Book:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *     title:
 *      type: string
 * 
 */ 

/**
 * @swagger
 * /api/books:
 *  get:
 *   summary: To get all books documents
 *   description: To get all books in mongodb
 *   responses:
 *    200:
 *     description: An optimal response
 *     content:
 *      application/json:
 *       schema: 
 *        type: array
 *        items:
 *         $ref: "#components/schema/Book"
 *    500:
 *     description: An error with the server
 */

app.get("/api/books",(req,res)=>{
	database.collection("libros").find({}).toArray((error,result)=>{
		if(error) res.status(500).send({error:error});
		res.status(200).send({libros:result});
	})
})

/**
 * @swagger
 * /api/books/{id}:
 *  get:
 *   summary: This is a method which returns a book by his id
 *   description: This is a method which returns a book by his id
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: Numeric ID required
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: An optimal response with a book
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: "#components/schema/Book"
 *    500:
 *     description: An error with the server holy crap     
 */ 

app.get("/api/books/:id",(req,res)=>{
	database.collection("libros").find({id:req.params.id}).toArray((error,result)=>{
		if(error) res.status(500).send({error:error});
		res.status(200).send({libro:result});
	})
})

/**
 * @swagger
 * /api/books/addBook:
 *  post:
 *   summary: To insert data to mongodb
 *   description: To insert data to mongodb
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: "#components/schema/Book"
 *   responses:
 *    200:
 *     description: An optimal response, added succefully
 */ 

app.post("/api/books/addBook",(req,resp)=>{
	database.collection("libros").countDocuments()
	.then((amountDocuments)=>{
		var libro={
			id:(amountDocuments+1).toString(),
			title:req.body.title
		}

		database.collection("libros").insertOne(libro,(error,result)=>{
			if(error) resp.status(500).send({error:error});
			resp.status(200).send({result:result,libro:libro});
		})
	})
	.catch(error => console.log(error));
})

/**
 * @swagger
 * /api/books/{id}:
 *  put:
 *   summary: To update data to mongodb
 *   description: To update data to mongodb
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: Numeric ID required
 *      schema:
 *       type: integer
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: "#components/schema/Book"
 *   responses:
 *    200:
 *     description: An optimal response with an updated book
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: "#components/schema/Book"
 * 
 */ 

app.put("/api/books/:id",(req,res)=>{
	var query=req.params.id;
	var book={
		id:req.params.id,
		title:req.body.title
	}

	database.collection("libros").updateOne({id:query},{$set:book},(error,result)=>{
		if(error) res.status(500).send({error:error});
		res.status(200).send({UpdatedBook:book,reultado:result});
	})
})

/**
 * @swagger
 * /api/books/{id}:
 *  delete:
 *   summary: is used to delete data to mongodb
 *   description: to delete data
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: Numeric ID required
 *       schema:
 *        type: integer
 *   responses:
 *    200:
 *     description: An optimal response with deleted data
 */ 

app.delete("/api/books/:id",(req,res)=>{
	var query=req.params.id;

	database.collection("libros").deleteOne({id:query},(error,result)=>{
		if(error) res.status(500).send({error:error});
		res.status(200).send({mensaje:result});
	})
})

app.listen(8080,()=>{
	MongoClient.connect("mongodb://localhost:27017/libros",{useNewUrlParser:true},(error,result)=>{
		if (error) throw error;
		database=result.db("libros");
		console.log("Conexion a base datos realizada");


	})
})
	


