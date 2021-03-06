var pusher = new Pusher('48aa33fe9a6470da8fd8', {
    cluster: 'us2',
    forceTLS: true
});

var channel = pusher.subscribe('admin');
channel.bind('agregar-visita', function (contexto) {
    let visitasA = contexto.visitaA;
    let visitasB = contexto.visitaB;
    let visitasC = contexto.visitaC;
    let visitas = contexto.visitas;

    let contadorA = document.querySelector('.admin__tabla-a');
    contadorA.innerHTML = visitasA;
    let contadorB = document.querySelector('.admin__tabla-b');
    contadorB.innerHTML = visitasB;
    let contadorC = document.querySelector('.admin__tabla-c');
    contadorC.innerHTML = visitasC;

    let tabla = document.querySelector('.visitas__tabla');
    tabla.innerHTML = '';
    tabla.innerHTML += " <tr><th>Página</th><th>Fecha</th><th>Hora</th></tr>";
    visitas.forEach(visita => {
        tabla.innerHTML += "<tr><td>"+visita.pagina+"</td><td>"+visita.fecha+"</td><td>"+visita.hora+"</td></tr>";
    });
});