let tour = 0
let current_joueur = 'b'
let autre_joueur = 'n'
let id = null
let plateau = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
let current_pion = null

//liste les cases atteignables à partir d'une certaine case
let zone0 = [1, 9]
let zone1 = [0, 2, 4]
let zone2 = [1, 14]
let zone3 = [4, 10]
let zone4 = [1, 3, 5, 7]
let zone5 = [4, 13]
let zone6 = [7, 11]
let zone7 = [4, 6, 8]
let zone8 = [7, 12]
let zone9 = [0, 10, 21]
let zone10 = [3, 9, 11, 18]
let zone11 = [6, 10, 15]
let zone12 = [8, 13, 17]
let zone13 = [5, 12, 14, 20]
let zone14 = [2, 13, 23]
let zone15 = [11, 16]
let zone16 = [15, 17, 19]
let zone17 = [12, 16]
let zone18 = [10, 19]
let zone19 = [16, 18, 20, 22]
let zone20 = [13, 19]
let zone21 = [9, 22]
let zone22 = [19, 21, 23]
let zone23 = [14, 22]

//liste les cases qui doivent être occupées pour avoir un moulin
let moulins = [[0,1,2], [3, 4, 5], [6, 7, 8], [9, 10, 11], [12, 13, 14], [15, 16, 17], [18, 19, 20], [21, 22, 23], [0, 9, 21], [3, 10, 18], [6, 11, 15], [1, 4, 7], [16, 19, 22], [8, 12, 17], [5, 13, 20], [2, 14, 23]]
//se réfère à moulins, indique s'il y a un moulin sur la plateau à la liste des positions se trouvant au même indexe dans moulins
let moulinsPlateau = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
let typeMoulin = null
//indique le nombre de pions blancs et noirs qui ont déjà été éliminés
let nbBElimine = 0
let nbNElimine = 0

let pionsPossibles
let supprimeDansMoulin = false

let mouvementSansPrise = 0

let dureeJoueur = null
let tempsb = 0
let tempsn = 0
let couleurJoueur = null
let gardeChrono = false

let incrementeTour = false


function creer() {
    document.getElementById("optionsJouer").style.display = "none"
    document.getElementById("optionsCreer").style.display = "block" 
}

function duree(n) {
    document.getElementById("duree5").style.border = "none"
    document.getElementById("duree10").style.border = "none"
    document.getElementById("duree0").style.border = "none"
    document.getElementById(`duree${n}`).style.border = "2px solid #FF686B"
    dureeJoueur = n
}

function couleur(c) {
    document.getElementById("couleurb").style.border = "none"
    document.getElementById("couleurn").style.border = "none"
    document.getElementById("couleura").style.border = "none"
    document.getElementById(`couleur${c}`).style.border = "2px solid #FF686B"
    couleurJoueur = c
}

function creerAppareil() {
    if (!(dureeJoueur == null) && !(couleurJoueur == null)) {
        document.getElementById("optionsCreer").style.display = "none"
        document.getElementById("incompletude").style.display = "none"
        document.getElementById("jeuTotal").style.display = "block"

        if (!(dureeJoueur == 0)) {

            tempsb = dureeJoueur * 60
            tempsn = dureeJoueur * 60
            document.getElementById("tempsb").innerText = `${dureeJoueur.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:00`
            document.getElementById("tempsn").innerText = `${dureeJoueur.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:00`
            document.getElementById("tempsb").style.display = "block"
            document.getElementById("tempsn").style.display = "block"
        }

    } else {
        document.getElementById("incompletude").style.display = "block"
    }
}

function tourJoue() {

    tour ++

    if (tour % 2 == 1) {
        current_joueur = 'b'
        autre_joueur = 'n'
        if (!(dureeJoueur == 0)) {
            timer(tempsb)    
        }

    } else if (tour % 2 == 0) {
        current_joueur = 'n'
        autre_joueur = 'b'
        if (!(dureeJoueur == 0)) {
            timer(tempsn)
        }
    }   
}

function joue(caseNumber) {

    if (tour == 1) {
        document.getElementById("indication").innerText = ""
    }

    //mise en place du jeu
    if (tour < 18 && typeMoulin == null) {
        if (current_joueur == 'b') {
            mouvement(`pb${(tour+1)/2}`, `case${caseNumber}`)
            plateau[caseNumber] = `pb${(tour+1)/2}`
            incrementeTour = true
            
        } else {
            mouvement(`pn${tour/2}`, `case${caseNumber}`)
            plateau[caseNumber] = `pn${tour/2}`
            incrementeTour = true
            
        }

    //dernier placement de pion
    } else if (tour == 18 && typeMoulin == null) {
        mouvement("pn9", `case${caseNumber}`)
        plateau[caseNumber] = "pn9"
        incrementeTour = true
        

        controleMouvementPossible()

    //déplacement des pions (avec 3 pions)    
    } else if (nbBElimine == 6 && current_joueur == 'b') {
        deplacement(caseNumber)
        incrementeTour = true
        
    
    } else if (nbNElimine == 6 && current_joueur == 'n') {
        deplacement(caseNumber)
        incrementeTour = true
        
    
    //50 mouvements sans prise
    } else if (mouvementSansPrise == 50) {
        finDePartie("nul")

    //déplacement dans les autres cas 
    } else {
        
        if (eval(`zone${plateau.indexOf(current_pion)}`).includes(caseNumber)) {
            deplacement(caseNumber)
            incrementeTour = true
            mouvementSansPrise ++

            controleMouvementPossible()
        }    
    }

    //contrôle de moulin
    if (tour > 4) {
        let possibilite = null
        let pion1 = null
        let pion2 = null
        let pion3 = null
        for (let i=0; i<moulins.length; i++) {
            possibilite = moulins[i]
            pion1 = plateau[possibilite[0]]
            pion2 = plateau[possibilite[1]]
            pion3 = plateau[possibilite[2]]

            //contrôle que le pion soit de type b ou n (deuxième caractère de la chaîne de caractère)
            if (!(pion1== null) && !(pion2 == null) && !(pion3 == null) 
                && pion1[1] == pion2[1] && pion2[1] == pion3[1]) {
                
                //contrôle que le moulin vient d'être formé
                if (moulinsPlateau[i] == null) {
                    document.getElementById("indication").innerText = "MOULIN !"
                    typeMoulin = pion1[1]
                    moulinsPlateau[i] = pion1[1]
                    mouvementSansPrise = 0
                    
                    //crée la liste des pions intouchables et ceux qu'il est possible d'éliminer
                    let pionsIntouchables = listeIntouchable()
                    pionsPossibles = listePossible(pionsIntouchables)

                    //si tous les pions adverses sont dans un moulin, tous peuvent être éliminés
                    if (pionsPossibles.length == 0) {
                        pionsPossibles = listePossible([])
                        supprimeDansMoulin = true
                    }

                    //anime les pions qu'il est possible d'éliminer
                    for (let i = 0; i < pionsPossibles.length; i++) {
                        document.getElementById(pionsPossibles[i]).classList.add("animationSelection")
                    }        
                
                //si le moulin existait déjà, il est à nouveau mis dans la liste moulinsPlateau
                } else {
                    moulinsPlateau[i] = pion1[1]
                }
            
            //s'il n'y a pas de moulins à cet emplacement, la position dans mise à null dans moulinsPlateau        
            } else {
                moulinsPlateau[i] = null
            }
        }

    }

    if (typeMoulin == null && incrementeTour == true) {
        tourJoue()
    }

    incrementeTour = false
}
    


function selectionne(pionId) {

    //contrôle s'il y a eu moulin et élimine le pion sélectionné
    if (typeMoulin == "b" || typeMoulin == "n") {

        //contrôle que le pion peut être éliminé
        if (pionsPossibles.includes(pionId)) {
            elimine(pionId)

            //si le pion éliminé faisait partie d'un moulin, suppression de ce moulin dans moulinsPlateau
            if (supprimeDansMoulin) {
                let positionPion = plateau.indexOf(pionId)
                let dansMoulin = []
                
                //cherche dans quel(s) moulin(s) il se trouve
                for (i = 0; i < moulins.length; i++) {
                    if (moulins[i].includes(positionPion)) {
                        dansMoulin.push(i)
                    }
                }

                for (i = 0; i < dansMoulin.length; i++) {
                    moulinsPlateau[dansMoulin[i]] = null
                }

                supprimeDansMoulin = false
            }
        
            //désanime les pions qu'il est possible d'éliminer
            for (let i = 0; i < pionsPossibles.length; i++) {
                document.getElementById(pionsPossibles[i]).classList.remove("animationSelection")
            }
            
            //mise à zéro des variables globales
            plateau[plateau.indexOf(pionId)] = null
            pionsPossibles = []
            typeMoulin = null
            tourJoue()

            //contrôle que le joueur suivant puisse encore se déplacer
            controleMouvementPossible()
        }

    
    //déplacement des pions au cours du jeu
    } else if (tour > 18) {

        supprimeAnimation()

        //impossible de sélectionner un pion adverse
        if (current_joueur == 'b' && pionId.startsWith("pb")) {
            document.getElementById(pionId).classList.add("animationSelection")
            current_pion = pionId
        
        } else if (current_joueur == 'n' && pionId.startsWith("pn")) {
            document.getElementById(pionId).classList.add("animationSelection")
            current_pion = pionId
        }   
        
        pionSelectionne = true

    }

    //fin de partie
    if (nbBElimine > 6 || nbNElimine > 6) {
        finDePartie(autre_joueur)
    }
    
}


function mouvement(pion, place) {
    let pionBouge = document.getElementById(pion)
    pionBouge.style.position ="absolute";
    let but = document.getElementById(place)
    let posBut = but.coords.split(",")
    let xBut = Number(posBut[0])
    let yBut = Number(posBut[1])
    let plateau = document.getElementById("grille")
    let xPlateau = plateau.offsetLeft
    let yPlateau = plateau.offsetTop
    pionBouge.style.top = (yPlateau + yBut - 29) + "px"
    pionBouge.style.left = (xPlateau + xBut) + "px"
}



function elimine(pion) {
    if (pion[1] == "b") {
        nbBElimine += 1
        document.getElementById(pion).style.display = "none"
        document.getElementById(`pbElimine${nbBElimine}`).style.visibility = "visible"
        document.getElementById("indication").innerText = ""
    } else {
        nbNElimine += 1
        document.getElementById(pion).style.display = "none"
        document.getElementById(`pnElimine${nbNElimine}`).style.visibility = "visible"
        document.getElementById("indication").innerText = ""
    }
}


function listeIntouchable(){
    //crée la liste des pions adverses qui sont dans un moulin
    let intouchable = []
    let positionsIntouchables = null
    for (let i = 0; i < moulins.length; i++) {

        //ne considère que les pions adverses
        if (!(moulinsPlateau[i] == typeMoulin) && !(moulinsPlateau[i] == null)) {
            positionsIntouchables = moulins[i]
            for (let j = 0; j < 3; j++) {
                intouchable.push(plateau[positionsIntouchables[j]])
            }
        }
    }
    
    return intouchable
}


function listePossible(intouchable) {
    //liste des pions qu'il est possible d'éliminer
    let adverse
    let pionPossible
    let possibles = []
    
    if (typeMoulin == "b") {
        adverse = "n"
    } else {adverse = "b"}

    for (let i = 1; i <= 9; i++ ) {
        pionPossible = "p" + adverse + i
        if (!(intouchable.includes(pionPossible)) && plateau.includes(pionPossible)) {
            possibles.push(pionPossible)
        }
    }

    return possibles
}


function deplacement(caseNumber) {
    mouvement(current_pion, `case${caseNumber}`)
    document.getElementById(current_pion).classList.remove("animationSelection")
    //déplace le pion dans la liste plateau
    plateau[plateau.indexOf(current_pion)] = null
    plateau[caseNumber] = current_pion
    current_pion = null
}

function supprimeAnimation() {
    for (let i = 1; i < 10; i++) {
        document.getElementById("pb" + i).classList.remove("animationSelection")
        document.getElementById("pn" + i).classList.remove("animationSelection")}
}

function finDePartie(gagnant) {

    document.getElementById("grille").style.display = "none"
    for (let i = 1; i <= 9; i++) {
        document.getElementById(`pb${i}`).style.display = "none"
        document.getElementById(`pn${i}`).style.display = "none"
    }
    
    for (let i = 1; i <= 7; i++) {
        document.getElementById(`pnElimine${i}`).style.display = "none"
        document.getElementById(`pbElimine${i}`).style.display = "none"
    }

    document.getElementById("tempsb").style.display = "none"
    document.getElementById("tempsn").style.display = "none"
    document.getElementById("indication").style.marginTop= "200px"
    document.getElementById("indication").style.fontSize = "50px"

    if (gagnant == "n") {
        document.getElementById("indication").innerText = "Victoire des noirs !"

    } else if (gagnant == "b") {
        document.getElementById("indication").innerText = "Victoire des blancs !"
        
    } else {
        document.getElementById("indication").innerText = "La partie est nulle ! :("
    }
}

function casesAutorises() {
    let cePion = null
    let positionPionPlateau = []
    let deplacementsAutorises = []

    for (let i = 1; i <= 9; i++) {
        cePion = `p${current_joueur}${i}`
        if (plateau.includes(cePion)) {
            positionPionPlateau.push(plateau.indexOf(cePion))
        }
    }

    for (let i = 0; i < positionPionPlateau.length; i++) {
        let current_zone = eval(`zone${positionPionPlateau[i]}`)
        for (let j = 0; j < current_zone.length; j++) {
            let current_case = current_zone[j]
            if (plateau[current_case] == null) {
                deplacementsAutorises.push(current_case)
            }
        }
    }

    return deplacementsAutorises
}

function controleMouvementPossible() {
     //contrôle que le joueur suivant peut se déplacer
    let autorise = casesAutorises()
    if (autorise.length == 0) {
        finDePartie(autre_joueur)
    }
}

function timer(temps) {

    const current_tour = tour
    
    let chornometre = setInterval(
        function() {

            if (temps == 0) {
                clearInterval(chornometre)
                finDePartie(autre_joueur)
                return
            }


            if (current_tour == tour) {

                if (current_joueur == 'b') {
                    tempsb --
                } else {
                    tempsn --
                }

                temps --
                let minutes = Math.floor(temps / 60)
                minutes = minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
                let secondes = Math.floor(temps - minutes * 60)
                secondes = secondes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
                document.getElementById(`temps${current_joueur}`).innerText = `${minutes}:${secondes}`
            }
            
        }, 1000)
}