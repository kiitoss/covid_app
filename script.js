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


function show_hide_nav_bar(e){
    if(e.target != document.getElementById("open_hide_director")) {
        return;
    }
    if (nav_bar_open == false) {
        old_class = "nav_hide";
        new_class = "nav_show";
    }
    else {
        old_class = "nav_show li_open";
        new_class = "nav_hide";
    }

    nav_part = document.getElementsByClassName("nav_part");
    let i=0;
    while (i < nav_part.length) {
        if (nav_part[i].classList.contains(old_class) == true){
            nav_part[i].classList.remove(old_class);
        }
        nav_part[i].classList.add(new_class);
        i++;
    }
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
            puce.setAttribute("class", "nav_part nav_country")
            puce.textContent = elements[i]["country"];
            list_puces.appendChild(puce);
            i++;
        }

        let nav_country = document.getElementsByClassName("nav_country");
        i = 0;
        while (i < nav_country.length) {
            console.log(nav_country[i].innerHTML);
            nav_country[i].addEventListener("click", function(){
                if(nav_bar_open == false) {
                    return;
                }
                find_country(this.innerHTML);
            }, false);
            i++;
        }
    });
}

window.onload=function() {
    main();
}

var nav_bar_open = false;