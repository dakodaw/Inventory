var pageCounter = 1;
var BrandDropPlace = document.getElementById("assetBrands");
var TypeDropPlace = document.getElementById("assetTypes");
var ModelDropPlace = document.getElementById("assetModels");
var btn = document.getElementById("btn");
var brandList;
var typeList = new Array();
var assetModelList;

//Get the Brands
window.addEventListener("load", function() {
	var ourRequest;
	if(window.XMLHttpRequest){
		ourRequest = new XMLHttpRequest();
	}
	else if (window.ActiveXObject){
		ourRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}
    ourRequest.open('GET', 'http://dwillden-3420/Inventory/api/definition?getTypes=true');
    ourRequest.onload = function() {
        try{
			var ourData = JSON.parse(ourRequest.responseText);
			loadAssetTypes(ourData);
		}
		catch (e){
			window.alert("Unable to retrieve Data");
		}
    };
    ourRequest.send();
});
//Get the Types
window.addEventListener("load", function() {
	var ourRequest;
	if(window.XMLHttpRequest){
		ourRequest = new XMLHttpRequest();
	}
	else if (window.ActiveXObject){
		ourRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}
    ourRequest.open('GET', 'http://dwillden-3420/Inventory/api/definition?getBrands=true');
    ourRequest.onload = function() {
        try{
			var ourData = JSON.parse(ourRequest.responseText);
			loadBrands(ourData);
		}
		catch (e){
			window.alert("Unable to retrieve Data");
		}
    };
    ourRequest.send();
});
//Get the Asset Models
window.addEventListener("load", function() {
	var ourRequest;
	if(window.XMLHttpRequest){
		ourRequest = new XMLHttpRequest();
	}
	else if (window.ActiveXObject){
		ourRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}
    ourRequest.open('GET', 'http://dwillden-3420/Inventory/api/definition?getComputerModels');
    ourRequest.onload = function() {
        try{
			var ourData = JSON.parse(ourRequest.responseText);
			loadAssetModelTypes(ourData, "all");
		}
		catch (e){
			window.alert("Unable to retrieve Data");
		}
    };
    ourRequest.send();
});





//FUNCTIONS
	//
	
function loadBrands(data) {
    var htmlString = "<select id='BrandDropDown' class='maindropdown'>";
		htmlString += "<option value='all' class='maindrops'>All</option>";

    for (i = 0; i < data.length; i++) {
        htmlString += "<option value='" + data[i].Id + "' class='maindrops'>" + data[i].Name + "</option> ";
    }
	htmlString += "</select>";

    BrandDropPlace.insertAdjacentHTML('beforeend', htmlString);
}

function loadAssetTypes(data) {
    var htmlString = "<select id='TypeDropDown' class='maindropdown'>";
	htmlString += "<option value='all'class='maindrops'>All</option>";

    for (i = 0; i < data.length; i++) {
        htmlString += "<option value='" + data[i].Id + "' class='maindrops'>" + data[i].Name + "</option> ";
        
    }
	htmlString += "</select>";

    TypeDropPlace.insertAdjacentHTML('beforeend', htmlString);
}


function loadAssetModelTypes(data, assetType) {
    var htmlString = "<select id='AssetModelDropDown' class='maindropdown'>";
		htmlString += "<option value='all'class='maindrops'>All</option>";

    for (i = 0; i < data.length; i++) {
        if(assetType == "all"){
			htmlString += "<option value='" + data[i].BrandId + "' class='maindrops'>" + data[i].Name + "</option> ";
			var oneType = [data[i].BrandId, data[i].BrandName, data[i].Id, data[i].IsActive, data[i].Name, data[i].TypeId, data[i].TypeName];
			typeList.push(oneType);
		}
		
    }
	htmlString += "</select>";

    ModelDropPlace.insertAdjacentHTML('beforeend', htmlString);
}


//Trying to change values in dropdown based on value in 
BrandDropPlace.addEventListener('change', function () {
    window.alert("Changed");

});

window.addEventListener("select", function() {
	var ourRequest;
	if(window.XMLHttpRequest){
		ourRequest = new XMLHttpRequest();
	}
	else if (window.ActiveXObject){
		ourRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}
    ourRequest.open('GET', 'http://dwillden-3420/Inventory/api/definition?getComputerModels');
    ourRequest.onload = function() {
        try{
			var ourData = JSON.parse(ourRequest.responseText);
			loadAssetModelTypes(ourData, "all");
		}
		catch (e){
			window.alert("Unable to retrieve Data");
		}
    };
    ourRequest.send();
});




//Event Listener Dropdown
//function choice1(select){
    //alert(select.options[select.selectedIndex].text);
//}

