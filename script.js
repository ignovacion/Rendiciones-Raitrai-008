document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;
    document.getElementById("seccionVoucher").style.display = tipo === "voucher" ? "block" : "none";
    document.getElementById("seccionGastos").style.display = tipo === "gastos" ? "block" : "none";
});

// Función para leer NFC
async function leerNFC(campoDestino) {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            nfcReader.onreading = (event) => {
                const nfcMessage = event.message.records[0];
                const nfcData = new TextDecoder().decode(nfcMessage.data);
                document.getElementById(campoDestino).value = nfcData;
            };
        } catch (error) {
            alert("Error al leer NFC: " + error);
        }
    } else {
        alert("Tu navegador no soporta NFC.");
    }
}

// Botones de Escanear NFC
document.getElementById("firmarResponsable").addEventListener("click", () => {
    leerNFC("responsable");
});

document.getElementById("firmarCoordinador").addEventListener("click", () => {
    leerNFC("coordinador");
});

// Extraer texto de imagen con Tesseract.js
document.getElementById("extraerTexto").addEventListener("click", () => {
    const inputImagen = document.getElementById("imagenGasto");
    const archivo = inputImagen.files[0];

    if (!archivo) {
        alert("Por favor, selecciona una imagen.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        Tesseract.recognize(
            e.target.result,
            'spa',
            { logger: info => console.log(info) }
        ).then(({ data: { text } }) => {
            const valorDetectado = text.match(/\d+(\.\d{2})?/);
            const asuntoDetectado = text.split("\n")[0] || "Gasto identificado";
            document.getElementById("asuntoGasto").value = asuntoDetectado;
            document.getElementById("valorGasto").value = valorDetectado ? valorDetectado[0] : "";
            alert("Texto extraído y campos completados.");
        }).catch(error => {
            alert("No se pudo procesar la imagen.");
            console.error(error);
        });
    };
    reader.readAsDataURL(archivo);
});

// Envío del formulario
document.getElementById("formulario").addEventListener("submit", (event) => {
    event.preventDefault();
    document.body.innerHTML = `
        <h1 style="text-align: center; color: #4CAF50;">Los datos rendidos se han enviado con éxito</h1>
        <p style="text-align: center; color: #333;">Preparando el formulario para una nueva rendición...</p>
    `;
    setTimeout(() => window.location.reload(), 3000);
});
