// JavaScript source code
var assetBrands = [];
var assetTypes = [];
var assetModels = [];
function CreateDropdowns() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost/Inventory/api/definition?getComputerModels',
        dataType: 'json',
        success: function (data) {
            var newDate = new Date();

            $.each(data, function () {
                window.alert(value.brandName);
            });


        }
    });
}


//$(document.body).on('click', '.Entree, .Alacarte, .Side', function () {
  //  express = false;
    //$('.PlaceOrderSelectors').show();
//});