const socket = io();

socket.io.on("error", (error) => {
	console.log(error);
});

const APP_API = {
	callSync: (fn) => { //ipcRenderer.sendSync(fn),
		const request = new XMLHttpRequest();
		request.open("POST", `/${fn}`, false);
		request.send(null);

		/*
		if (request.status === 200) {
		  console.log(request.responseText);
		}*/
		return JSON.parse(request.responseText);
	},
	call: (fna, args, fnb, cb) => {
		//ipcRenderer.send(fna, args);
		socket.emit(fna, JSON.stringify(args));
		let listener = (_args) => {
			//ipcRenderer.removeListener(fnb, listener);
			socket.off(fnb, listener);
			cb({}, JSON.parse(_args));
		};
		socket.on(fnb, listener);
		//ipcRenderer.on(fnb, listener);

	},
	removeAllListeners: (n) => socket.off(), //ipcRenderer.removeAllListeners(n),
	send: (a, b) => socket.emit(a, JSON.stringify(b)), //ipcRenderer.send(a, b),
	on: (a, b) => socket.on(a, (message) => { b({}, JSON.parse(message)); }) //ipcRenderer.on(a, b)
}

window.api = APP_API;