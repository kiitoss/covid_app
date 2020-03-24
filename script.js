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
    if (nav_bar_open) {
        open_hide_nav();
    }

    if (window.innerHeight <= reponsive_width) {
        document.getElementById("results").style.height = "47vh";
    }
    else {
        document.getElementById("results").style.height = "70vh";
    }
    
    let label_results = document.getElementsByClassName("label_result");
    for(let i = 0; i < label_results.length; i++) {
        label_results[i].style.visibility = "visible";
      }

    for (let key in elem) {
        if (document.getElementById(key) != null) {
            document.getElementById(key).innerHTML = elem[key];
        }
    }

}

function find_country(country) {
    if (typeof(country) == 'undefined') {
        var country = document.getElementById("country_input").value;
    }
    resultats = renvoie_resultats("https://corona.lmao.ninja/countries/"+country);
}


function nav_manager(e) {
    if (e.target.classList.contains("country_part")) {
        find_country(e.target.parentNode.firstChild.innerHTML);
    }
    else if (e.target == document.getElementById("list_countries")) {
        return;
    }
    else if ((e.target == document.getElementById("btn_nav")) || (nav_bar_open == true)) {
        open_hide_nav();
    }
}

function open_hide_nav() {
    if (window.innerHeight > reponsive_width) {
        return;
    }
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
        let list_puces = document.getElementById("list_countries");
        let i = 0;
        while (i < elements.length) {
            let puce = document.createElement("li");
            puce.className = "country";
            let info_puce = "<span class='info_country country_part'>"+elements[i]["country"]+"</span><span class='info_cases country_part'>"+elements[i]["cases"]+"</span><span class='info_deaths country_part'>"+elements[i]["deaths"]+"</span><span class='info_recovered country_part'>"+elements[i]["recovered"]+"</span>";
            puce.innerHTML =  info_puce;
            list_puces.appendChild(puce);
            for (let key in elements[i]) {
                if (total[key] != null) {
                    total[key] += elements[i][key];
                }
            }
            i++;
        }
        
        for (let key in total) {
            if (document.getElementById("itw_"+key) != null) {
                document.getElementById("itw_"+key).innerHTML = total[key];
            }
        }
    });
}

window.onload=function() {
    main();
}

var nav_bar_open = false;
var total_stats = [0, 0, 0, 0, 0, 0, 0, 0];
var total = {"cases": 0, "recovered": 0, "deaths": 0, "active": 0, "critical": 0, "todayDeaths": 0, "todayCases": 0, "casesPerOneMillion": 0};
var reponsive_width = 850;
