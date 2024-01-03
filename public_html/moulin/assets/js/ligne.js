

function init() {
    socket = io("http://totifle.ch:25565/moulin")
    socket.on("info", (message) => {
        let separeMessage = message.split(":")
        if (separeMessage[0] == "id") {
            document.getElementById("optionsCreer").style.display = "none"
            document.getElementById("votreId").innerText += separeMessage[1]
            document.getElementById("creationId").style.display = "block"
        }
        else if (separeMessage[0] == "fausseId") {
            document.getElementById(idFausse).innerText = "Cette partie n'existe pas."
        }
    })
}

function creerLigne() {
    socket.emit("setup", `creationId:${dureeJoueur}:${couleurJoueur}`)
    console.log("envoi requête")
}

function rejoindre() {
    socket.emit("setup", "idConnexion:" + document.getElementById("noPartie").value)
}

document.addEventListener('DOMContentLoaded', function() {
    init()
 }, false)
