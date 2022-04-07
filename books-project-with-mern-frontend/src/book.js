import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

class Books extends React.Component{
	constructor(props){
		super(props)
		this.state={	
			books:[],
			singleBook:{
				name:"",
				id:0
			},
			isUpdated:false
		};

		this.getLibros=this.getLibros.bind(this);
		this.handleChange=this.handleChange.bind(this);
		this.handleAddBook=this.handleAddBook.bind(this);
		this.getBook=this.getBook.bind(this);
		this.handleUpdate=this.handleUpdate.bind(this);
		this.handleDelete=this.handleDelete.bind(this);
	}

	getLibros(){
		fetch("http://localhost:8080/api/books")
			.then(res=> res.json())
			.then(result=>{
				this.setState({
					books:result.libros,
					isUpdated:false
				})
			})
			.catch(console.log)
	}

	handleChange(e){
		this.setState({
			singleBook:{
				title:e.target.value,
				id:this.state.singleBook.id
			},
		})
	}

	handleAddBook(){
		fetch("http://localhost:8080/api/books/addBook",{
			method:"POST",
			headers:{
				"content-type":"application/json"
			},
			body:JSON.stringify(this.state.singleBook)
		})
		.then(this.setState({
			singleBook:{
				title:""
			},
			isUpdated:false
		}))
	}

	getBook(e,id){
		fetch("http://localhost:8080/api/books/"+id)
			.then(res=> res.json())
			.then(result=>{
				this.setState({
					singleBook:{
						title:result.libro[0].title,
						id:result.libro[0].id
					},
					isUpdated:true
				})
			})
	}

	handleUpdate(){
		fetch("http://localhost:8080/api/books/"+this.state.singleBook.id,{
			method:"PUT",
			headers:{
				"content-type":"application/json"
			},
			body:JSON.stringify(this.state.singleBook)
		})
		.then(this.getLibros())
	}

	handleDelete(e,id){
		fetch("http://localhost:8080/api/books/"+id,{
			method:"DELETE"
		}).then(this.getLibros())
	}

	render() {
		return(
			<div className="container">
				<span className="title-bat">
					<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
				 		Añadir libro
					</button>
					<button type="button" onClick={this.getLibros} className="btn btn-info"> Obtener libros </button>
				</span>
				
				<table className="table table-straped">
					<thead> 
						<tr>
							<th> # </th>
							<th> Nombre </th>
							<th> Acciones </th>
						</tr>
					</thead>
					<tbody>
						{this.state.books.map(book=>(
							<tr key={book.id}>
								<td> {book.id} </td>
								<td> {book.title} </td>
								<td> 
									<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={(e)=>this.getBook(e,book.id)}>
				 						Editar libro
									</button>
									<button type="button" className="btn btn-primary" onClick={(e)=>this.handleDelete(e,book.id)}>
				 						Eliminar libro
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				  <div className="modal-dialog">
				    <div className="modal-content">
				      <div className="modal-header">
				        <h5 className="modal-title" id="exampleModalLabel">Añadir libro</h5>
				        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				      </div>
				      <div className="modal-body">
				      	<label htmlFor="titleBook">Nombre del libro:   </label>
				        <input type="text" id="titleBook" value={this.state.singleBook.title} onChange={this.handleChange}/> 
				      </div>
				      <div className="modal-footer">
				        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
				        <button type="button" className="btn btn-primary" onClick={this.state.isUpdated?this.handleUpdate:this.handleAddBook}>Guardar libro</button>
				      </div>
				    </div>
				  </div>
				</div>
			</div>
		)
	}
}

export default Books

