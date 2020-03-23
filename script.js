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
        new_div.setAttribute("class", "result")
        new_div.textContent = key+": "+elem[key];
        showing_part.appendChild(new_div);
    }

}

function find_country(country) {
    if (typeof(country) == 'undefined') {
        var country = document.getElementById("country_input").value;
    }
    resultats = renvoie_resultats("https://corona.lmao.ninja/countries/"+country);
}


function nav_manager(e) {
    if (e.target.classList.contains("country")) {
        console.log(e.target.innerHTML);
        find_country(e.target.innerHTML);
    }
    else if (e.target == document.getElementById("list_countries")) {
        return;
    }
    else if ((e.target == document.getElementById("btn_nav")) || (nav_bar_open == true)) {
        open_hide_nav();
    }
}

function open_hide_nav() {
    let list_categories = document.getElementById("list_countries");
    let old_class, new_class;
    if (nav_bar_open) {
        old_class = "countries_show";
        new_class = "countries_hide";
    }
    else {
        old_class = "countries_hide";
        new_class = "countries_show";
    }

    if (list_categories.classList.contains(old_class)){
        list_categories.classList.remove(old_class);
    }
    list_categories.classList.add(new_class);
    nav_bar_open = !nav_bar_open;
}

function main() {
    ajaxGet("https://corona.lmao.ninja/countries", function (reponse) {
        var elements = JSON.parse(reponse);
        console.log(elements);
        let list_puces = document.getElementById("list_countries");
        let i = 0;
        while (i < elements.length) {
            let puce = document.createElement("li");
            puce.setAttribute("class", "country")
            puce.textContent = elements[i]["country"];
            list_puces.appendChild(puce);
            i++;
        }
    });
}

window.onload=function() {
    main();
}

var nav_bar_open = false;