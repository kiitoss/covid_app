function ajaxGet(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}

function renvoie_resultats(url_send) {
    ajaxGet(url_send, function (reponse) {
        var elements = JSON.parse(reponse);
        affiche_elements(elements);
    });
}

function affiche_elements(elem) {
    showing_part = document.getElementById("results");
    showing_part.innerHTML = "";
    for (let key in elem) {
        let new_div = document.createElement("div");
        new_div.textContent = key+": "+elem[key];
        showing_part.appendChild(new_div);
    }

}

function find_country() {
    let country = document.getElementById("country").value;
    resultats = renvoie_resultats("https://corona.lmao.ninja/countries/"+country);
}