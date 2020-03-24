function ajaxGet(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Error when connect to " + url);
    });
    req.send(null);
}


function return_result(url_send) {
    ajaxGet(url_send, function (answer) {
        let my_country = JSON.parse(answer);
        show_statistics(my_country);
    });
}


function show_statistics(my_country) {
    if (nav_bar_open) {
        open_hide_nav();
    }

    if (window.innerWidth <= reponsive_width) {
        document.getElementById("results").style.height = "47vh";
    }
    else {
        document.getElementById("results").style.height = "70vh";
    }
    
    let label_results = document.getElementsByClassName("label_result");
    for(let i = 0; i < label_results.length; i++) {
        label_results[i].style.visibility = "visible";
    }

    for (let key in my_country) {
        if (document.getElementById(key) != null) {
            document.getElementById(key).innerHTML = my_country[key];
        }
    }
}


function find_country(country) {
    if (typeof(country) == 'undefined') {
        var country = document.getElementById("country_input").value;
    }
    return_result("https://corona.lmao.ninja/countries/"+country);
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
    if (window.innerWidth > reponsive_width) {
        return;
    }
    let nav_bar = document.getElementById("list_countries");
    let old_class, new_class;
    if (nav_bar_open) {
        old_class = "countries_show";
        new_class = "countries_hide";
    }
    else {
        old_class = "countries_hide";
        new_class = "countries_show";
    }

    if (nav_bar.classList.contains(old_class)){
        nav_bar.classList.remove(old_class);
    }
    nav_bar.classList.add(new_class);
    nav_bar_open = !nav_bar_open;
}


function main() {
    ajaxGet("https://corona.lmao.ninja/countries", function (reponse) {
        var all_countries = JSON.parse(reponse);
        let list_countries = document.getElementById("list_countries");
        let i = 0;
        while (i < all_countries.length) {
            let new_country = document.createElement("li");
            new_country.className = "country";
            let info_puce = "<span class='info_country country_part'>"+all_countries[i]["country"]+"</span><span class='info_cases country_part'>"+all_countries[i]["cases"]+"</span><span class='info_deaths country_part'>"+all_countries[i]["deaths"]+"</span><span class='info_recovered country_part'>"+all_countries[i]["recovered"]+"</span>";
            new_country.innerHTML =  info_puce;
            list_countries.appendChild(new_country);
            for (let key in all_countries[i]) {
                if (total[key] != null) {
                    total[key] += all_countries[i][key];
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
var total = {
    "cases": 0,
    "recovered": 0,
    "deaths": 0,
    "active": 0,
    "critical": 0,
    "todayDeaths": 0,
    "todayCases": 0,
    "casesPerOneMillion": 0
};
var reponsive_width = 850;
