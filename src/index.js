require('./main.css');

var Elm = require('./Main.elm');

var root = document.getElementById('root');

var app = Elm.Main.embed(root, getStoredModel(true));

app.ports.scrollToElement.subscribe(function(id){
    requestAnimationFrame(function() {
        if(!id){
            return;
        }
        var target = document.getElementById(id);
        if(!target){
            return;
        }
        target.scrollIntoView(true);
    });
});

function getStoredModel(returnUndefined) {
    var stored = window.localStorage.getItem("storeModel");
    if((!stored || stored === "null") && returnUndefined){
        return null;
    }
    if(stored){
        return  JSON.parse(stored) || {};
    }
    return {};
}

function docEqual(d1, d2){
    return d1.packageName === d2.packageName
        && d1.packageVersion === d2.packageVersion;
}

app.ports.saveLocal.subscribe(function(obj){
    var storedModel = getStoredModel();
    var docs = storedModel.docs || [];
    var found = docs.find(function(d){
        return docEqual(d, obj.doc);
    });
    if(!found){
        window.localStorage.setItem("storeModel",
            JSON.stringify({
                docs: docs.concat(obj.doc),
                searchIndex: obj.searchIndex
            })
        );
    }
});

app.ports.removeLocal.subscribe(function(obj) {
    var storedModel = getStoredModel();
    var docs = storedModel.docs || [];
    window.localStorage.setItem("storeModel",
        JSON.stringify({
            docs: docs.filter(function(d){
                return !docEqual(d, obj.doc);
            }),
            searchIndex: obj.searchIndex
        })
    );
});
