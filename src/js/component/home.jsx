import React, { useEffect, useState } from "react";

const Home = () => {
	const [tarea, setTarea] = useState("");
	const [lista, setLista] = useState([]);


	const agregarTarea = () => {
		if (tarea.trim() !== "") {
			const tareaNueva = [...lista, {
				label: tarea,
				done: false
			}]
			fetch('https://playground.4geeks.com/apis/fake/todos/user/romanmonfort', {
				method: "PUT",
				body: JSON.stringify(tareaNueva),
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(resp => {
					console.log(resp.ok); // Será true (verdad) si la respuesta es exitosa.
					console.log(resp.status); // el código de estado = 200 o código = 400 etc.
					console.log(resp.text()); // Intentará devolver el resultado exacto como cadena (string)
					if (resp.ok) { getList() }
					else if (resp.status == 404) { createUser() }
					return resp.json(); // (regresa una promesa) will try to parse the result as json as return a promise that you can .then for results
				})
				.then(data => {
					//Aquí es donde debe comenzar tu código después de que finalice la búsqueda
					console.log(data); //esto imprimirá en la consola el objeto exacto recibido del servidor
				})//inutil en la funcion en este momento
				.catch(error => {
					//manejo de errores
					console.log(error);
				});


			setTarea("")
		} else {
			alert("Ingrese algo")
		}
	};






	const Enter = (e) => {
		if (e.key === "Enter") {
			agregarTarea();
		}

	}

	const Eliminar = async (tareaid) => {
		try {
			if (lista.length == 1) { Delete() } else {
				const nuevaLista = lista.filter((tarea) => tarea.id !== tareaid);
				const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/romanmonfort', {
					method: "PUT",
					body: JSON.stringify(nuevaLista),
					headers: {
						"Content-Type": "application/json"
					}
				});
				if (response.ok) {
					getList()
				} else if (response.status == 400) { alert("Se mandaron mal los datos") }

			}
		} catch (error) {
			console.log(error)
		}
	};

	const createUser = async () => {
		try {
			const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/romanmonfort', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify([])
			});
			if (response.ok) { getList() }
		} catch (error) {
			console.log(error)
		}
	}

	const Delete = async () => {
		try {
			const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/romanmonfort', {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				}
			});
			if (response.ok) { createUser() }
		} catch (error) {
			console.log(error)
		}
	}

	function getList() {
		fetch('https://playground.4geeks.com/apis/fake/todos/user/romanmonfort')
			.then(resp => {
				console.log(resp.ok); // Será true (verdad) si la respuesta es exitosa.
				console.log(resp.status); // el código de estado = 200 o código = 400 etc.
				return resp.json(); // (regresa una promesa) intentará analizar el resultado como JSON y devolverá una promesa que puedes .then para obtener resultados
			})
			.then(data => {
				// Aquí es donde debe comenzar tu código después de que finalice la búsqueda
				setLista(data); // Esto imprimirá en la consola el objeto exacto recibido del servidor
			})
			.catch(error => {
				// Manejo de errores
				console.log(error);
			});


	}

	useEffect(() => {
		getList()

	}, [])




	return (
		<div className="container-fluid">
			<div className="row justify-content-center align-items-center" >
				<div className="col-md-4">
					<div className="text-center card h-100">
						<p>todos</p>


						<ul className="list-group mt-3 " >
							<li className="list-group-item">
								<input
									className="ms-5 border-none"
									type="text"
									onChange={(e) => setTarea(e.target.value)}
									value={tarea}
									onKeyDownCapture={Enter}
									placeholder="Pone algo "
								/>
							</li>

							{lista && lista.map((tarea, index) => (
								<li key={tarea.id} className=" list-group-item d-flex justify-content-between align-items-center">
									<p>{tarea.label}</p>
									<i className="fa-solid fa-x" style={{ color: '#ff0000' }} onClick={() => Eliminar(tarea.id)}></i>
								</li>
							))}
						</ul>

						<div className="card-footer" >
							<small className="text-body-secondary">Hay {lista.length} actividades por hacer</small>
							<button className="ms-5 btn btn-danger" onClick={() => Delete()}>Borrar todo</button>
						</div>
					</div>
				</div>
			</div>
		</div>


	);
};

export default Home;
