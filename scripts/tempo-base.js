var nav = document.getElementsByTagName("nav")[0];
var sections = document.getElementsByTagName("section");
var colors = document.getElementById("colors").getElementsByClassName("swatch");
var icons = document.getElementById("icons").getElementsByTagName("img");

var posNav = function() {
    if (document.body.scrollTop > 70) {
        if (nav.className != "fixed") {
            nav.className = "fixed";
        }
    } else {
        nav.className = "";
    }
}

var parallaxBg = function() {
    document.getElementById("intro").style.backgroundSize = 25 - document.body.scrollTop / 100 + "px";
}

var highlightNav = function() {
    /*menu highlight*/
    for (var i = 0; i < sections.length; i++) {
        var bounds = sections[i].getBoundingClientRect();
        if (Math.ceil(bounds.bottom) > window.innerHeight / 2) {
            if (document.getElementsByClassName("active").length) {
                document.getElementsByClassName("active")[0].classList.remove("active");
            }
            document.getElementById("menu").getElementsByTagName("a")[i].classList.add("active");
            break;
        }
    }
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'json/bdr_ds_data.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function init() {
    loadJSON(function(response) {
        // Parse JSON string into object
        var bdr_ds_data = JSON.parse(response);
        initColors(bdr_ds_data.colors);
        initIcons(bdr_ds_data.icons);
        // Other page init
        posNav();
        initColorToClipboard();
        initDownloadable();
    });
}

function initColors(json) {
    var temp = document.getElementById("color-temp");
    var item = temp.content.querySelector("li");
    for (var i = 0; i < json.groups.length; i++) {
        for (var j = 0; j < json.groups[i].colors.length; j++) {
            var a = document.importNode(item, true);
            a.getElementsByClassName("swatch")[0].style.backgroundColor = json.groups[i].colors[j].hex;
            a.getElementsByTagName("figcaption")[0].textContent = json.groups[i].colors[j].name;
            a.getElementsByTagName("figcaption")[1].textContent = json.groups[i].colors[j].hex;
            a.getElementsByTagName("figcaption")[2].textContent = json.groups[i].colors[j].rgb;
            document.getElementById(json.groups[i].name).appendChild(a);
        }
    }
}


function initIcons(json) {
    var temp = document.getElementById("icon-temp");
    var item = temp.content.querySelector("li");
    for (var i = 0; i < json.groups.length; i++) {
        for (var j = 0; j < json.groups[i].icons.length; j++) {
            var a = document.importNode(item, true);
            a.getElementsByTagName("img")[0].setAttribute("src", json.groups[i].icons[j].url);
            a.getElementsByTagName("figcaption")[0].textContent = json.groups[i].icons[j].name;
            document.getElementById(json.groups[i].name).appendChild(a);
        }
    }
}

var initDownloadable = function() {
    for (var i = 0; i < icons.length; i++) {
        icons[i].onclick = function() {
            window.open(this.getAttribute("src"));
        }
    }
}

var initColorToClipboard = function() {
    for (var i = 0; i < colors.length; i++) {
        colors[i].onclick = function() {
            navigator.clipboard.writeText(this.style.backgroundColor);
        }
    }
}

window.onload = function() {
    init();
}

window.onscroll = function() {
    posNav();
    highlightNav();
    parallaxBg();
}