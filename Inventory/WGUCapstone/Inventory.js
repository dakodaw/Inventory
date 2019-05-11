//Global Variables
var brandId;
var typeId;
var assetModelId;
var departmentId;
var ownerId;
var locationId;
var AssignId = 0;
var AddOrUpdate = "Add";
var reportDownloadString = "";

var addAssetDiv = document.getElementById("AddAsset");
var addAssetButton = document.getElementById("AddAssetButton");
addAssetButton.addEventListener("click", PopulateNewAssetForm, true);

$(document).ready(function () {
    GetBrands(".brandsDropDown", "");
    GetTypes(".typesDropDown", "");
    GetModels('.assetModelsDropDown', 'NormalModelSelectRow', '');
    GetDepartments('.ownerDepartmentDropDown');
    GetOwners('.ownerNamesDropDown', '');
    GetLocations('#LocationDropDown', '');
    GetAssets("");
});



//FILL DROPDOWNS

//Gets the Brands from Database
function GetBrands(myClass, selectedBrand) {
    $.ajax({
        type: "GET",
        url: "../api/definition/getAssetBrands?getBrands=true",
        dataType: "json",
        success: function (data) {
            var assetBrands = [];
            $.each(data, function (index, value) {
                if (value.Id == selectedBrand) {
                    assetBrands.push('<option value="' + value.Id + '" selected>' + value.BrandName + '</option>');
                }
                else {
                    assetBrands.push('<option value="' + value.Id + '">' + value.BrandName + '</option>');
                }
            });
            if (selectedBrand == "") {
                $(myClass).html('<option value="" selected >Select Brand</option>' + assetBrands.join(""));
            }
            else {
                $(myClass).html('<option value="" >Select Brand</option>' + assetBrands.join(""));
            }
            $(myClass).chosen();
        }
    });
}

//Gets the Types from Database
function GetTypes(myClass, selectedType) {
    $.ajax({
        type: "GET",
        url: "../api/definition/getAssetTypes?getTypes=true",
        dataType: "json",
        success: function (data) {
            var assetTypes = [];
            $.each(data, function (index, value) {
                if (value.Id == selectedType) {
                    assetTypes.push('<option value="' + value.Id + '" selected >' + value.TypeName + '</option>')
                }
                else {
                    assetTypes.push('<option value="' + value.Id + '">' + value.TypeName + '</option>')
                }
            });
            if (selectedType == "") {
                $(myClass).html('<option value="" selected >Select Type</option>' + assetTypes.join(""));
            }
            else {
                $(myClass).html('<option value="">Select Type</option>' + assetTypes.join(""));
            }
            $(myClass).chosen();
        }
    });
}

//Gets the Asset Models from Database
function GetModels(myClass, rowClass, selectedModel) {
    $.ajax({
        type: "GET",
        url: "../api/definition/getAssetModels?getAssetModels=true",
        dataType: "json",
        success: function (data) {
            globalAssetModels = data;
            var assetModels = [];
            $.each(data, function (index, value) {
                if (value.Id == selectedModel) {
                    assetModels.push('<option data-brandId="' + value.BrandId + '" data-typeId="' + value.TypeId + '" value="' + value.Id + '" class="modelSelectRow ' + rowClass + '" selected>' + value.Name + '</option>')
                }
                else {
                    assetModels.push('<option data-brandId="' + value.BrandId + '" data-typeId="' + value.TypeId + '" value="' + value.Id + '" class="modelSelectRow ' + rowClass + '">' + value.Name + '</option>')
                }
            });
            if (selectedModel == "") {
                $(myClass).html('<option value="" selected >Select Asset Model</option>' + assetModels.join(""));
            }
            else {
                $(myClass).html('<option value="">Select Asset Model</option>' + assetModels.join(""));
            }
            $(myClass).chosen();
        }
    });
}

//Gets the Departments from the Database
function GetDepartments(myClass) {
    $.ajax({
        type: "GET",
        url: "../api/definition/getDepartments?getDepartments=true",
        dataType: "json",
        success: function (data) {
            var departments = [];
            $.each(data, function (index, value) {
                departments.push('<option value="' + value.Id + '">' + value.DepartmentName + '</option>');
            });
            $(myClass).html('<option value="" selected >Select Department</option>' + departments.join(""));
            $(myClass).chosen();
        }
    });
}

//Gets all the Owners from the Database
function GetOwners(myClass, selectedOwner) {
    $.ajax({
        type: "GET",
        url: "../api/definition/getOwners?getOwners=true",
        dataType: "json",
        success: function (data) {
            var owners = [];
            $.each(data, function (index, value) {
                if (value.OwnerId == selectedOwner) {
                    owners.push('<option value="' + value.OwnerId + '" selected data-ownerDepartment="' + value.DepartmentName + '">' + value.OwnerName + '</option>');
                }
                else {
                    owners.push('<option value="' + value.OwnerId + '" data-ownerDepartment="' + value.DepartmentName + '">' + value.OwnerName + '</option>');
                }
            });
            if (selectedOwner == "") {
                $(myClass).html('<option value="" selected >Select Owner</option>' + owners.join(""));
            }
            else {
                $(myClass).html('<option value="" >Select Owner</option>' + owners.join(""));
            }
            $(myClass).chosen();
        }
    });
}

//Gets all the Owners from the Database
function GetLocations(myClass, selectedLocation) {
    $.ajax({
        type: "GET",
        url: "../api/definition/getLocations?getLocations=true",
        dataType: "json",
        success: function (data) {
            var owners = [];
            $.each(data, function (index, value) {
                if (value.Id == selectedLocation) {
                    owners.push('<option value= "' + value.Id + '" selected >' + value.LocationName + '</option>');
                }
                else {
                    owners.push('<option value= "' + value.Id + '">' + value.LocationName + '</option>');
                }
            });
            if (selectedLocation == "") {
                $(myClass).html('<option value="" selected >Select Location</option>' + owners.join(""));
            }
            else {
                $(myClass).html('<option value="" >Select Location</option>' + owners.join(""));
            }
            $(myClass).chosen();
        }
    });
}

//Gets all the Assets from the Database
function GetAssets(filter) {
    $('#AddAssetButton').show();
    var assetsHeader =
        `<th>Asset</th>
                    <th>Current Owner</th>
                    <th>Type</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Device Name</th>
                    <th>Department</th>
                    <th>Bios</th>
                    <th>OS</th>
                    <th>Date Deployed</th>
                    <th>Returned Date</th>`;
    if (filter == "Disposed") {
        assetsHeader = `<th>Asset</th>
                    <th>Current Owner</th>
                    <th>Type</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Device Name</th>
                    <th>Department</th>
                    <th>Bios</th>
                    <th>OS</th>
                    <th>Date Disposed</th>`;

        $.ajax({
            type: "GET",
            url: "../api/definition/getAllAssets?getAllDisposedAssets=true",
            dataType: "json",
            success: function (data) {
                var allAssets = [];
                $.each(data, function (index, value) {
                    allAssets.push('<tr class="assetTableRow" data-rowPO="PO-' + value.AssetInfo.PO + '" data-rowBrandId="' + value.AssetInfo.BrandId + '" data-rowTypeId="' + value.AssetInfo.TypeId + '" data-rowAssetModelId="' + value.AssetInfo.AssetModelId + '" data-rowDepartmentId="'
                        + value.OwnerInfo.DepartmentId + '" data-rowOwnerId="' + value.OwnerInfo.OwnerId + '" data-rowLocationId="' + value.AssignmentInfo.LocationId + '" ><td class="clickableAssetTag" data-assignmentId="' + value.AssignmentInfo.AssignmentId + '">'
                        + value.AssetInfo.AssetId + '</td><td title="' + value.OwnerInfo.UserName + '">' + value.OwnerInfo.OwnerName + '</td><td>'
                        + value.AssetInfo.Type + '</td><td>' + value.AssetInfo.Brand + '</td><td>' + value.AssetInfo.AssetModel + '</td><td>' + value.AssignmentInfo.DeviceName + '</td><td>' + value.OwnerInfo.DepartmentName + '</td><td>' + value.AssetInfo.Bios + '</td><td>'
                        + value.AssetInfo.OS + '</td><td>' + value.AssignmentInfo.DateDeployed + '</td></tr>');
                });
                $('#assets').html(allAssets.join(""));
            }
        });
    }
    else {
        $.ajax({
            type: "GET",
            url: "../api/definition/getAllAssets?getAllAssets=true&filterType=" + filter + "",
            dataType: "json",
            success: function (data) {
                var allAssets = [];
                $.each(data, function (index, value) {
                    allAssets.push('<tr class="assetTableRow" data-rowPO="PO-' + value.AssetInfo.PO + '" data-rowBrandId="' + value.AssetInfo.BrandId + '" data-rowTypeId="' + value.AssetInfo.TypeId + '" data-rowAssetModelId="' + value.AssetInfo.AssetModelId + '" data-rowDepartmentId="'
                        + value.OwnerInfo.DepartmentId + '" data-rowOwnerId="' + value.OwnerInfo.OwnerId + '" data-rowLocationId="' + value.AssignmentInfo.LocationId + '" ><td class="clickableAssetTag" data-assignmentId="' + value.AssignmentInfo.AssignmentId + '">'
                        + value.AssetInfo.AssetId + '</td><td title="' + value.OwnerInfo.UserName + '">' + value.OwnerInfo.OwnerName + '</td><td>'
                        + value.AssetInfo.Type + '</td><td>' + value.AssetInfo.Brand + '</td><td>' + value.AssetInfo.AssetModel + '</td><td>' + value.AssignmentInfo.DeviceName + '</td><td>' + value.OwnerInfo.DepartmentName + '</td><td>' + value.AssetInfo.Bios + '</td><td>'
                        + value.AssetInfo.OS + '</td><td>' + value.AssignmentInfo.DateDeployed + '</td><td>' + ((value.AssignmentInfo.DateReturned == '01/01/1900') ? '<button data-assignmentId="' + value.AssignmentInfo.AssignmentId + '" class="CancelButtons ReturnButton">Return</button' : value.AssignmentInfo.DateReturned) + '</td></tr>');
                });
                $('#assets').html(allAssets.join(""));
            }
        });
    }


    $('#assetsHeader').html(assetsHeader);
}


//SORTING THROUGH ASSET TABLES

//Sort the Models Dropdown based off of what is selected on the brand or Type dropdowns
function SortAssetTable() {
    brandId = $("#assetBrands option:selected").val();
    typeId = $("#assetTypes option:selected").val();
    assetModelId = $("#assetModels option:selected").val();
    departmentId = $("#ownerDepartment option:selected").val();
    ownerId = $("#ownerName option:selected").val();
    locationId = $("#location option:selected").val();

    //If the Brand isn't selected, and the type also isn't selected, then show all models

    if (assetModelId == "") {
        if (brandId == "") {
            if (typeId == "") {
                if (departmentId == "") {
                    if (ownerId == "") {
                        if (locationId == "") {
                            $('.modelSelectRow').show();
                            $('.assetTableRow').show();
                            $('.assetModelsDropDown').trigger("chosen:updated");
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                if (rowLocationId == locationId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                    else {
                        //Owner Id is selected
                        if (locationId == "") {
                            console.log(ownerId);
                            $('.assetTableRow').each(function () {
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                if (rowOwnerId == ownerId) {
                                    console.log(ownerId);
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                if (rowOwnerId == ownerId && rowLocationId == locationId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                }
                else {
                    if (ownerId == "") {
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                if (rowDepartmentId == departmentId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                if (rowLocationId == locationId && rowDepartmentId == departmentId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                    else {
                        //Owner Id is selected
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                if (rowOwnerId == ownerId && rowDepartmentId == departmentId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                if (rowOwnerId == ownerId && rowLocationId == locationId && rowDepartmentId == departmentId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                }
            }
            //If the type is selected, and the brand isn't selected, show the models with the type
            else {
                if (departmentId == "") {
                    if (ownerId == "") {
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                if (rowTypeId == typeId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                if (rowLocationId == locationId && rowTypeId == typeId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                    else {
                        //Owner Id is selected
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                if (rowOwnerId == ownerId && rowTypeId == typeId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                if (rowOwnerId == ownerId && rowLocationId == locationId && rowTypeId == typeId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                }
                else {
                    if (ownerId == "") {
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                if (rowDepartmentId == departmentId && rowTypeId == typeId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                if (rowLocationId == locationId && rowDepartmentId == departmentId && rowTypeId == typeId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                    else {
                        //Owner Id is selected
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                if (rowOwnerId == ownerId && rowDepartmentId == departmentId && rowTypeId == typeId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                if (rowOwnerId == ownerId && rowLocationId == locationId && rowDepartmentId == departmentId && rowTypeId == typeId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                }
            }
        }
        else {
            if (typeId == "") {
                if (departmentId == "") {
                    if (ownerId == "") {
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                if (rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                if (rowLocationId == locationId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                    else {
                        //Owner Id is selected
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                if (rowOwnerId == ownerId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                if (rowOwnerId == ownerId && rowLocationId == locationId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                }
                else {
                    if (ownerId == "") {
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                if (rowDepartmentId == departmentId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                if (rowLocationId == locationId && rowDepartmentId == departmentId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                    else {
                        //Owner Id is selected
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                if (rowOwnerId == ownerId && rowDepartmentId == departmentId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                if (rowOwnerId == ownerId && rowLocationId == locationId && rowDepartmentId == departmentId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                }
            }
            //If the type is selected, and the brand isn't selected, show the models with the type
            else {
                if (departmentId == "") {
                    if (ownerId == "") {
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                if (rowTypeId == typeId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                if (rowLocationId == locationId && rowTypeId == typeId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                    else {
                        //Owner Id is selected
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                if (rowOwnerId == ownerId && rowTypeId == typeId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                if (rowOwnerId == ownerId && rowLocationId == locationId && rowTypeId == typeId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                }
                else {
                    if (ownerId == "") {
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                if (rowDepartmentId == departmentId && rowTypeId == typeId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                if (rowLocationId == locationId && rowDepartmentId == departmentId && rowTypeId == typeId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                    else {
                        //Owner Id is selected
                        if (locationId == "") {
                            $('.assetTableRow').each(function () {
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                if (rowOwnerId == ownerId && rowDepartmentId == departmentId && rowTypeId == typeId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                        else {
                            $('.assetTableRow').each(function () {
                                var rowBrandId = $(this).attr("data-rowBrandId");
                                var rowLocationId = $(this).attr("data-rowLocationId");
                                var rowOwnerId = $(this).attr("data-rowOwnerId");
                                var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                                var rowTypeId = $(this).attr("data-rowTypeId");
                                if (rowOwnerId == ownerId && rowLocationId == locationId && rowDepartmentId == departmentId && rowTypeId == typeId && rowBrandId == brandId) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                }
            }

        }
    }
    else {
        if (departmentId == "") {
            if (ownerId == "") {
                if (locationId == "") {
                    $('.assetTableRow').each(function () {
                        var rowAssetModelId = $(this).attr("data-rowAssetModelId");
                        if (rowAssetModelId == assetModelId) {
                            $(this).show();
                        }
                        else {
                            $(this).hide();
                        }
                    });
                }
                else {
                    $('.assetTableRow').each(function () {
                        var rowAssetModelId = $(this).attr("data-rowAssetModelId");
                        var rowLocationId = $(this).attr("data-rowLocationId");
                        if (rowLocationId == locationId && rowAssetModelId == assetModelId) {
                            $(this).show();
                        }
                        else {
                            $(this).hide();
                        }
                    });
                }
            }
            else {
                //Owner Id is selected
                if (locationId == "") {
                    $('.assetTableRow').each(function () {
                        var rowAssetModelId = $(this).attr("data-rowAssetModelId");
                        var rowOwnerId = $(this).attr("data-rowOwnerId");
                        if (rowOwnerId == ownerId && rowAssetModelId == assetModelId) {
                            $(this).show();
                        }
                        else {
                            $(this).hide();
                        }
                    });
                }
                else {
                    $('.assetTableRow').each(function () {
                        var rowAssetModelId = $(this).attr("data-rowAssetModelId");
                        var rowLocationId = $(this).attr("data-rowLocationId");
                        var rowOwnerId = $(this).attr("data-rowOwnerId");
                        if (rowOwnerId == ownerId && rowLocationId == locationId && rowAssetModelId == assetModelId) {
                            $(this).show();
                        }
                        else {
                            $(this).hide();
                        }
                    });
                }
            }
        }
        else {
            if (ownerId == "") {
                if (locationId == "") {
                    $('.assetTableRow').each(function () {
                        var rowAssetModelId = $(this).attr("data-rowAssetModelId");
                        var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                        if (rowDepartmentId == departmentId && rowAssetModelId == assetModelId) {
                            $(this).show();
                        }
                        else {
                            $(this).hide();
                        }
                    });
                }
                else {
                    $('.assetTableRow').each(function () {
                        var rowAssetModelId = $(this).attr("data-rowAssetModelId");
                        var rowLocationId = $(this).attr("data-rowLocationId");
                        var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                        if (rowLocationId == locationId && rowDepartmentId == departmentId && rowAssetModelId == assetModelId) {
                            $(this).show();
                        }
                        else {
                            $(this).hide();
                        }
                    });
                }
            }
            else {
                //Owner Id is selected
                if (locationId == "") {
                    $('.assetTableRow').each(function () {
                        var rowAssetModelId = $(this).attr("data-rowAssetModelId");
                        var rowOwnerId = $(this).attr("data-rowOwnerId");
                        var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                        if (rowOwnerId == ownerId && rowDepartmentId == departmentId && rowAssetModelId == assetModelId) {
                            $(this).show();
                        }
                        else {
                            $(this).hide();
                        }
                    });
                }
                else {
                    $('.assetTableRow').each(function () {
                        var rowAssetModelId = $(this).attr("data-rowAssetModelId");
                        var rowLocationId = $(this).attr("data-rowLocationId");
                        var rowOwnerId = $(this).attr("data-rowOwnerId");
                        var rowDepartmentId = $(this).attr("data-rowDepartmentId");
                        if (rowOwnerId == ownerId && rowLocationId == locationId && rowDepartmentId == departmentId && rowAssetModelId == assetModelId) {
                            $(this).show();
                        }
                        else {
                            $(this).hide();
                        }
                    });
                }
            }
        }
    }
}

//Change Event for Brand Dropdown
$("#assetBrands").change(SortAssetTable);
//Change Event for Types Dropdown
$("#assetTypes").change(SortAssetTable);
//Change Event for Model Dropdown
$("#assetModels").change(SortAssetTable);
//Change Event for Department Dropdown
$("#ownerDepartment").change(SortAssetTable);
//Change Event for Owner Dropdown
$("#ownerName").change(SortAssetTable);
//Change Event for Location Dropdown
$("#location").change(SortAssetTable);

//Sorting the asset model dropdown
function SortAssetModels() {
    brandId = $("#assetBrands option:selected").val();
    typeId = $("#assetTypes option:selected").val();
    //Updating the asset Model Dropdown
    if (brandId == "") {
        //Update Asset Model dropdown
        if (typeId == "") {
            $('.NormalModelSelectRow').each(function () {
                $(this).show();
            });
        }
        else {
            $('.NormalModelSelectRow').each(function (value) {
                var rowTypeId = $(this).attr("data-typeId");
                if (rowTypeId == typeId) {
                    $(this).show();
                }
                else {
                    $(this).hide();
                }
            });
        }
        $('.assetModelsDropDown').trigger("chosen:updated");
    }
    else {
        //If the Brand is selected, and the type isn't selected, show models with the brand
        if (typeId == "") {
            $('.NormalModelSelectRow').each(function () {
                var rowBrandId = $(this).attr("data-brandId");
                if (rowBrandId == brandId) {
                    $(this).show();
                }
                else {
                    $(this).hide();
                }
            });
            $('.assetModelsDropDown').trigger("chosen:updated");
        }
        else {
            //If both are selected, then show the models that apply to both
            $('.NormalModelSelectRow').each(function () {
                var rowBrandId = $(this).attr("data-brandId");
                var rowTypeId = $(this).attr("data-typeId");
                if (rowBrandId == brandId) {
                    if (rowTypeId == typeId) {
                        $(this).show();
                    }
                    else {
                        $(this).hide();
                    }
                }
                else {
                    $(this).hide();
                }
            });
            $('.assetModelsDropDown').trigger("chosen:updated");
        }
    }
}
//Change events for brand and type that affect the assetmodel dropdown
$("#assetBrands").change(SortAssetModels);
$("#assetTypes").change(SortAssetModels);

//Change Event for Search Bar
$("#SearchInput").keyup(function () {
    var textIn = $(this).val().toLowerCase();
	if (textIn[0] == 0) {
        textIn = textIn.substr(1);
    } 
    $("#assets tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(textIn) > -1);
    });
    if (textIn.split('-')[0] == 'po') {
        $("#assets tr").filter(function () {
            $(this).toggle($(this).attr('data-rowpo').toLowerCase().indexOf(textIn) > -1);
        });
    }
});




//FORM FUNCTIONS

//      ASSET FORMS
function PopulateNewAssetForm() {
    AddOrUpdate = "Added";
    addAssetDiv.innerHTML = `
                    <form id="Hover-Form" method="post">
                        <br />
                        <div id="NewAssetHeader"><h2>Add New Asset</h2></div>
                        <div class="leftForm">
                            <div class="formSpacing">
                                <label class="formLabel">Asset</label>
                                <input id="assetIdValue" name="assetId" placeholder="Asset" class="form-control formSpacing" type="text" required>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">PO</label>
                                <input id="poValue" name="po" placeholder="PO" class="form-control" type="text">
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Date Purchased</label>
                                <input name="date_purchased" type='date' class="form-control" id='date_activeValue' required />
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Asset Type</label>
                                <select id='FormTypeDropdownValue' class='maindropdown typesDropDown form-control' placeholder="Asset Type" required></select>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Asset Brand</label>
                                <select id='FormBrandDropdownValue' class='maindropdown typesDropDown form-control' required></select>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Asset Model</label>
                                <select id='FormModelDropdownValue' class='maindropdown typesDropDown form-control' required></select>
                            </div>
                            <div class="formSpacing" id="serial">
                                <label class="formLabel">Serial</label>
                                <input id="serialValue" name="serial" placeholder="Serial" class="form-control input-md" type="text">
                            </div>
                            <div class="formSpacing" id="cpu">
                                <label class="formLabel">CPU</label>
                                <input id="cpuValue" name="cpu" placeholder="CPU" class="form-control input-md" type="text">
                            </div>
                            <div class="formSpacing" id="ram">
                                <label class="formLabel">RAM</label>
                                <input id="ramValue" name="ram" placeholder="Ram" class="form-control input-md" type="text">
                            </div>
                            <div class="formSpacing" id="mac">
                                <label class="formLabel">MAC Address</label>
                                <input id="macValue" name="mac" placeholder="MAC Address" class="form-control input-md" type="text">
                            </div>
                            <div class="formSpacing" id="bios">
                                <label class="formLabel">BIOS</label>
                                <input id="biosValue" name="bios" placeholder="Bios Version" value ="" class="form-control input-md" type="text">
                            </div>
                            <div class="formSpacing" id="os">
                                <label class="formLabel">OS</label>
                                <input id="osValue" name="os" placeholder="OS" value ="" class="form-control input-md" type="text">
                            </div>
                            <div class="formSpacing" id="ink">
                                <label class="formLabel">Ink</label>
                                <input id="inkValue" name="ink" placeholder="Ink Model" class="form-control input-md" type="text">
                            </div>
                            <div class="formSpacing" id="PrinterServiceId">
                                <label class="formLabel">Printer Service ID</label>
                                <input id="printerServiceValue" name="PrinterService" placeholder="Printer Service ID" class="form-control input-md" type="text">
                            </div>
                            <div class="formSpacing" id="ip_address">
                                <label class="formLabel">IP Address</label>
                                <input id="ip_addressValue" name="ip_address" placeholder="IP Address" class="form-control input-md" type="text">
                            </div>
                            <div class="formSpacing" id="notes">
                                <label class="formLabel">Notes</label>
                                <textarea class="form-control" placeholder="Notes" value ="Notes" id="notesValue" name="notes"></textarea>
                            </div>
                            <div class="formSpacing" id="disposed_reason">
                                <label class="formLabel">Disposed Reason</label>
                                <input id="disposed_reasonValue" name="disposed_reason" placeholder="Disposed Reason" value="" class="form-control input-md" type="text">
                            </div>
                        </div>
                        <div class="rightForm">
                            <div class="formSpacing">
                                <label class="formLabel">Owner</label>
                                <select id='FormOwnerDropdownValue' class='maindropdown form-control typesDropDown' required></select>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Device Name</label>
                                <input id="device_nameValue" name="device_name" placeholder="Device Name" class="form-control" type="text" required>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Location</label>
                                <select id='FormLocationDropdownValue' class='maindropdown form-control typesDropDown'></select>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Department</label>
                                <input id="ShowDepartmentValue" name="device_name" placeholder="Department" class="form-control" type="text" readonly>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Date Deployed</label>
                                <input name="date_deployedValue" type='date' class="form-control input-md"  id='date_deployed' required/>
                            </div>
                            <div class="formSpacing" id="dateReturned">
                                <label class="formLabel">Date Returned</label>
                                <input name="date_returnedValue" type='date' class="form-control input-md"  id='date_returnedVal'/>
                            </div>
                            <div id="DisposedDate" class="formSpacing">
                                <label class="formLabel">Date Disposed</label>
                                <input name="dateDisposedValue" type='date' class="form-control input-md"  id='date_disposed'/>
                            </div>
                            <div class="formSpacing" id="RecoveryKey">
                                <label class="formLabel">Recovery Key</label>
                                <input id="recovery_keyValue" placeholder="Recovery Key" class="form-control" type="text" >
                            </div>
                            <div class="formSpacing">
                                <button class="CancelButtons" type="button" onclick="CloseNewAssetForm()">Cancel</button>
                                <button id="SubmitAsset" class="AddButton" type="submit">Submit</button>
                            </div>
                        </div>
                        <br />
                        <br/>

                        <br/>
                        <br/>
                    </form>`;
    GetTypes("#FormTypeDropdownValue", "");
    GetBrands('#FormBrandDropdownValue', '');
    GetModels('#FormModelDropdownValue', 'NewAssetModelSelectRow', '');
    GetOwners('#FormOwnerDropdownValue', '');
    GetLocations('#FormLocationDropdownValue', '');

    $(document.getElementById('serial')).hide();
    $(document.getElementById('cpu')).hide();
    $(document.getElementById('ram')).hide();
    $(document.getElementById('mac')).hide();
    $(document.getElementById('bios')).hide();
    $(document.getElementById('os')).hide();
    $(document.getElementById('ink')).hide();
    $(document.getElementById('PrinterServiceId')).hide();
    $(document.getElementById('ip_address')).hide();
    $(document.getElementById('notes')).hide();
    $(document.getElementById('disposed_reason')).hide();
    $(document.getElementById('SubmitAsset')).hide();
    $(document.getElementById('RecoveryKey')).hide();
    $(document.getElementById('dateReturned')).hide();
    $(document.getElementById('DisposedDate')).hide();



    $('.HidePage').show();
}

function PopulateUpdateAssetForm(assetId, assignmentId) {
    AddOrUpdate = "Updated";
    var assetAssignmentFilter = "";
    if (assignmentId == "") {
        if (assetId != "") {
            assetAssignmentFilter = "AssetId=" + assetId;
        }
    }
    else {
        assetAssignmentFilter = "AssignmentId=" + assignmentId
    }

    $.ajax({
        type: "GET",
        url: "../api/definition?getAssetAssignment=true&" + assetAssignmentFilter,
        dataType: "json",
        success: function (data) {
            assetId = data.AssetInfo.AssetId;
            var assignmentId = data.AssignmentInfo.AssignmentId;
            var po = data.AssetInfo.PO;
            var dateActive = new Date(data.AssetInfo.ActiveDate).toISOString().slice(0, 10);
            var assetModelId = data.AssetInfo.AssetModelId;
            var typeId = data.AssetInfo.TypeId;
            var brandId = data.AssetInfo.BrandId;
            var serial = data.AssetInfo.Serial;
            var cpu = data.AssetInfo.CPU;
            var ram = data.AssetInfo.Ram;
            var mac = data.AssetInfo.MACAddress;
            var bios = data.AssetInfo.Bios;
            var os = data.AssetInfo.OS;
            var ink = data.AssetInfo.InkModel;
            var printerServiceId = data.AssetInfo.PrinterServiceId;
            var ipAddress = data.AssetInfo.IPAddress;
            var notes = data.AssetInfo.Notes;
            var disposedDate = new Date(data.AssetInfo.DateDisposed).toISOString().slice(0, 10);
            if (disposedDate == '1900-01-01') {
                disposedDate = '';
            }
            var assetActive = data.AssetInfo.Active;
            var disposedReason = data.AssetInfo.DisposedReason;
            var ownerId = data.OwnerInfo.OwnerId;
            var deviceName = data.AssignmentInfo.DeviceName;
            var locationId = data.AssignmentInfo.LocationId;
            var departmentName = data.OwnerInfo.DepartmentName;
            var dateDeployed = new Date(data.AssignmentInfo.DateDeployed).toISOString().slice(0, 10);
            var dateReturned = new Date(data.AssignmentInfo.DateReturned).toISOString().slice(0, 10);
            if (dateReturned == '01/01/1900') {
                dateReturned = '';
            }
            var recoveryKey = data.AssignmentInfo.RecoveryKey;
            addAssetDiv.innerHTML = `
                    <form id="Hover-Form" method="post">
                        <br />
                        <h2>Update Asset</h2>
                        <div class="leftForm">
                            <div class="formSpacing">
                                <label class="formLabel">Asset</label>
                                <input id="assetIdValue" name="assetId" placeholder="Asset" class="form-control formSpacing" type="text" value="` + assetId + `" readonly>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">PO</label>
                                <input id="poValue" name="po" placeholder="PO" class="form-control" type="text" value="` + ((po != undefined && po != 'null') ? po : "") + `">
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Date In Service</label>
                                <input name="date_purchased" type='date' class="form-control" id='date_activeValue' required value="` + dateActive + `" />
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Asset Type</label>
                                <select id='FormTypeDropdownValue' class='maindropdown typesDropDown form-control' placeholder="Asset Type"></select>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Asset Brand</label>
                                <select id='FormBrandDropdownValue' class='maindropdown typesDropDown form-control'></select>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Asset Model</label>
                                <select id='FormModelDropdownValue' class='maindropdown typesDropDown form-control'></select>
                            </div>
                            <div class="formSpacing" id="serial">
                                <label class="formLabel">Serial Number</label>
                                <input id="serialValue" name="serial" placeholder="Serial" class="form-control input-md" type="text" value="` + ((serial != undefined && serial != 'null') ? serial : "") + `">
                            </div>
                            <div class="formSpacing" id="cpu">
                                <label class="formLabel">CPU</label>
                                <input id="cpuValue" name="cpu" placeholder="CPU" class="form-control input-md" type="text" value="` + ((cpu != undefined && cpu != 'null') ? cpu : "") + `">
                            </div>
                            <div class="formSpacing" id="ram">
                                <label class="formLabel">RAM</label>
                                <input id="ramValue" name="ram" placeholder="Ram" class="form-control input-md" type="text" value="` + ((ram != undefined && ram != 'null') ? ram : "") + `">
                            </div>
                            <div class="formSpacing" id="mac">
                                <label class="formLabel">MAC Address</label>
                                <input id="macValue" name="mac" placeholder="MAC Address" class="form-control input-md" type="text" value="` + ((mac != undefined && mac != 'null') ? mac : "") + `">
                            </div>
                            <div class="formSpacing" id="bios">
                                <label class="formLabel">BIOS</label>
                                <input id="biosValue" name="bios" placeholder="Bios Version" class="form-control input-md" type="text" value="` + ((bios != undefined && bios != 'null') ? bios : "") + `">
                            </div>
                            <div class="formSpacing" id="os">
                                <label class="formLabel">OS</label>
                                <input id="osValue" name="os" placeholder="OS" class="form-control input-md" type="text" value="` + ((os != undefined && os != 'null') ? os : "") + `">
                            </div>
                            <div class="formSpacing" id="ink">
                                <label class="formLabel">Ink</label>
                                <input id="inkValue" name="ink" placeholder="Ink Model" class="form-control input-md" type="text" value="` + ((ink != undefined && ink != 'null') ? ink : "") + `">
                            </div>
                            <div class="formSpacing" id="PrinterServiceId">
                                <label class="formLabel">Printer Service ID</label>
                                <input id="printerServiceValue" name="printerService" placeholder="Printer Service Id" class="form-control input-md" type="text" value="` + ((printerServiceId != undefined && printerServiceId != 'null') ? printerServiceId : "") + `">
                            </div>
                            <div class="formSpacing" id="ip_address">
                                <label class="formLabel">IP Address</label>
                                <input id="ip_addressValue" name="ip_address" placeholder="IP Address" class="form-control input-md" type="text" value="` + ((ipAddress != undefined && ipAddress != 'null') ? ipAddress : "") + `">
                            </div>
                            <div class="formSpacing" id="notes">
                                <label class="formLabel">Notes</label>
                                <textarea class="form-control" placeholder="Notes" id="notesValue" name="notes">` + ((notes != undefined && notes != 'null') ? notes : "") + `</textarea>
                            </div>
                            <div class="formSpacing" id="disposedCheckbox">
                                <input type="checkbox" style="float:left;" id="disposedCheck"/> 
                                <label class="formLabel">Disposed</label>
                                <br/>
                            </div>
                            <div class="formSpacing" id="disposed_reason">
                                <label class="formLabel">Disposed Reason</label>
                                <input id="disposed_reasonValue" name="disposed_reason" placeholder="Disposed Reason" value="` + ((disposedReason != undefined && disposedReason != 'null') ? disposedReason : "") + `" class="form-control input-md" type="text">
                            </div>
                        </div>
                        <div class="rightForm">
                            <div class="formSpacing">
                                <label class="formLabel">Owner</label>
                                <select id='FormOwnerDropdownValue' class='maindropdown form-control typesDropDown'></select>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Device Name</label>
                                <input id="device_nameValue" name="device_name" placeholder="Device Name" class="form-control" type="text" required value="` + ((deviceName != undefined && deviceName != 'null') ? deviceName : "") + `">
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Location</label>
                                <select id='FormLocationDropdownValue' class='maindropdown form-control typesDropDown'></select>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Department</label>
                                <input id="ShowDepartmentValue" name="device_name" placeholder="Department" class="form-control" type="text" readonly value="` + departmentName + `">
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Date Deployed</label>
                                <input name="date_deployedValue" type='date' class="form-control input-md"  id='date_deployed' value="` + dateDeployed + `"/>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Date Returned</label>
                                <input name="date_returnedValue" type='date' class="form-control input-md"  id='date_returnedVal' value="` + ((dateReturned == '1900-01-01') ? "" : dateReturned) + `"/>
                            </div>
                            <div id="DisposedDate" class="formSpacing">
                                <label class="formLabel">Date Disposed</label>
                                <input name="dateDisposedValue" type='date' class="form-control input-md"  id='date_disposed' value="` + ((disposedDate == '1900-01-01') ? "" : disposedDate) + `"/>
                            </div>
                            <div class="formSpacing" id="RecoveryKey">
                                <label class="formLabel">Recovery Key</label>
                                <input id="recovery_keyValue" placeholder="Recovery Key" class="form-control" type="text" value="` + ((recoveryKey != undefined && recoveryKey != 'null') ? recoveryKey : "") + `">
                            </div>
                            <div class="formSpacing">
                                <button class="CancelButtons" type="button" onclick="CloseNewAssetForm()">Cancel</button>
                                <button id="SubmitAsset" class="AddButton" type="button">Update</button>
                            </div>
                        </div>
                        <br/><br/>
                            <table class="mainTables">
                                <thead>
                                    <tr>
                                        <th>Owner Name</th>
                                        <th>Username</th>
                                        <th>Department</th>
                                        <th>Date Deployed</th>
                                        <th>Date Returned</th>
                                    </tr>
                                </thead>
                                <tbody id="assetsHistory">

                                </tbody>
                            </table>
                        <br/>
                        <br/>

                        <br/>
                        <br/>
                    </form>`;

            GetTypes("#FormTypeDropdownValue", typeId);
            GetBrands('#FormBrandDropdownValue', brandId);
            GetModels('#FormModelDropdownValue', 'NewAssetModelSelectRow', assetModelId);
            GetOwners('#FormOwnerDropdownValue', ownerId);
            GetLocations('#FormLocationDropdownValue', locationId);

            if (typeId == '1') {
                $(document.getElementById('serial')).show();
                $(document.getElementById('cpu')).show();
                $(document.getElementById('ram')).show();
                $(document.getElementById('mac')).show();
                $(document.getElementById('bios')).show();
                $(document.getElementById('os')).show();
                $(document.getElementById('ink')).hide();
                $(document.getElementById('PrinterServiceId')).hide();
                $(document.getElementById('ip_address')).hide();
                $(document.getElementById('notes')).show();
                $(document.getElementById('disposed_reason')).hide();
                $(document.getElementById('SubmitAsset')).show();
                $(document.getElementById('RecoveryKey')).show();
            }
            else if (typeId == '2') {
                $(document.getElementById('serial')).show();
                $(document.getElementById('cpu')).hide();
                $(document.getElementById('ram')).hide();
                $(document.getElementById('mac')).hide();
                $(document.getElementById('bios')).hide();
                $(document.getElementById('os')).hide();
                $(document.getElementById('ink')).hide();
                $(document.getElementById('PrinterServiceId')).hide();
                $(document.getElementById('ip_address')).show();
                $(document.getElementById('notes')).show();
                $(document.getElementById('disposed_reason')).hide();
                $(document.getElementById('SubmitAsset')).show();
                $(document.getElementById('RecoveryKey')).hide();
            }
            else if (typeId == '3') {
                $(document.getElementById('serial')).show();
                $(document.getElementById('cpu')).hide();
                $(document.getElementById('ram')).hide();
                $(document.getElementById('mac')).hide();
                $(document.getElementById('bios')).hide();
                $(document.getElementById('os')).hide();
                $(document.getElementById('ink')).show();
                $(document.getElementById('PrinterServiceId')).show();
                $(document.getElementById('ip_address')).show();
                $(document.getElementById('notes')).show();
                $(document.getElementById('disposed_reason')).hide();
                $(document.getElementById('SubmitAsset')).show();
                $(document.getElementById('RecoveryKey')).hide();
            }
            else if (typeId == '4') {
                $(document.getElementById('serial')).show();
                $(document.getElementById('cpu')).show();
                $(document.getElementById('ram')).show();
                $(document.getElementById('mac')).show();
                $(document.getElementById('bios')).show();
                $(document.getElementById('os')).show();
                $(document.getElementById('ink')).hide();
                $(document.getElementById('PrinterServiceId')).hide();
                $(document.getElementById('ip_address')).hide();
                $(document.getElementById('notes')).show();
                $(document.getElementById('disposed_reason')).hide();
                $(document.getElementById('SubmitAsset')).show();
                $(document.getElementById('RecoveryKey')).show();
            }
            else if (typeId == '5') {
                $(document.getElementById('serial')).hide();
                $(document.getElementById('cpu')).hide();
                $(document.getElementById('ram')).hide();
                $(document.getElementById('mac')).hide();
                $(document.getElementById('bios')).hide();
                $(document.getElementById('os')).hide();
                $(document.getElementById('ink')).hide();
                $(document.getElementById('PrinterServiceId')).hide();
                $(document.getElementById('ip_address')).hide();
                $(document.getElementById('notes')).show();
                $(document.getElementById('disposed_reason')).hide();
                $(document.getElementById('SubmitAsset')).show();
                $(document.getElementById('RecoveryKey')).hide();
            }
            else if (typeId == '6') {
                $(document.getElementById('serial')).hide();
                $(document.getElementById('cpu')).hide();
                $(document.getElementById('ram')).hide();
                $(document.getElementById('mac')).hide();
                $(document.getElementById('bios')).hide();
                $(document.getElementById('os')).hide();
                $(document.getElementById('ink')).hide();
                $(document.getElementById('PrinterServiceId')).hide();
                $(document.getElementById('ip_address')).hide();
                $(document.getElementById('notes')).show();
                $(document.getElementById('disposed_reason')).hide();
                $(document.getElementById('SubmitAsset')).show();
                $(document.getElementById('RecoveryKey')).hide();
            }
            else if (typeId == '7') {
                $(document.getElementById('serial')).show();
                $(document.getElementById('cpu')).hide();
                $(document.getElementById('ram')).hide();
                $(document.getElementById('mac')).hide();
                $(document.getElementById('bios')).hide();
                $(document.getElementById('os')).hide();
                $(document.getElementById('ink')).hide();
                $(document.getElementById('PrinterServiceId')).hide();
                $(document.getElementById('ip_address')).hide();
                $(document.getElementById('notes')).show();
                $(document.getElementById('disposed_reason')).hide();
                $(document.getElementById('SubmitAsset')).show();
                $(document.getElementById('RecoveryKey')).hide();
            }

            if (assetActive == true) {
                $(document.getElementById('disposed_reason')).hide();
                $(document.getElementById('DisposedDate')).hide();

            }
            else {
                $(document.getElementById('disposed_reason')).show();
                $(document.getElementById('DisposedDate')).show();
                $(document.getElementById('disposedCheck')).prop("checked", true);
            }

            $('.HidePage').show();
            AssignId = assignmentId;

            //Fill rows of History Table
            $.ajax({
                type: "GET",
                url: "../api/definition?getAssetAssignmentHistory=true&AssetId=" + assetId,
                dataType: "json",
                success: function (data) {
                    var specificAssetHistory = [];
                    $.each(data, function (index, value) {
                        specificAssetHistory.push('<tr class="assetTableRow"><td>' + value.OwnerName + '</td><td>' + value.UserName + '</td><td>'
                            + value.DepartmentName + '</td><td>' + value.DateDeployed + '</td><td>' + ((value.DateReturned == '01/01/1900') ? "" : value.DateReturned) + '</td></tr>')
                    });
                    $(document.getElementById('assetsHistory')).html(specificAssetHistory.join(""));
                }
            });
        }
    });


}

function SortFormAssetModels() {
    brandId = $(document.getElementById("FormBrandDropdownValue")).val();
    typeId = $(document.getElementById("FormTypeDropdownValue")).val();
    //Updating the asset Model Dropdown
    if (brandId == "") {
        //Update Asset Model dropdown
        if (typeId == "") {
            $(document.getElementsByClassName('NewAssetModelSelectRow')).each(function () {
                $(this).show();
            });
        }
        else {
            $(document.getElementsByClassName('NewAssetModelSelectRow')).each(function (value) {
                var rowTypeId = $(this).attr("data-typeId");
                if (rowTypeId == typeId) {
                    $(this).show();
                }
                else {
                    $(this).hide();
                }
            });
        }
        $('#FormModelDropdownValue').trigger("chosen:updated");
    }
    else {
        //If the Brand is selected, and the type isn't selected, show models with the brand
        if (typeId == "") {
            $(document.getElementsByClassName('NewAssetModelSelectRow')).each(function () {
                var rowBrandId = $(this).attr("data-brandId");
                if (rowBrandId == brandId) {
                    $(this).show();
                }
                else {
                    $(this).hide();
                }
            });
            $('#FormModelDropdownValue').trigger("chosen:updated");
        }
        else {
            //If both are selected, then show the models that apply to both
            $(document.getElementsByClassName('NewAssetModelSelectRow')).each(function () {
                var rowBrandId = $(this).attr("data-brandId");
                var rowTypeId = $(this).attr("data-typeId");
                if (rowBrandId == brandId) {
                    if (rowTypeId == typeId) {
                        $(this).show();
                    }
                    else {
                        $(this).hide();
                    }
                }
                else {
                    $(this).hide();
                }
            });
            $('#FormModelDropdownValue').trigger("chosen:updated");
        }
    }
}

function ChangeAssetFormVisible() {
    typeId = $(document.getElementById("FormTypeDropdownValue")).val();

    //Update Asset Model dropdown
    if (typeId == "") {
        $(document.getElementById('serial')).hide();
        $(document.getElementById('cpu')).hide();
        $(document.getElementById('ram')).hide();
        $(document.getElementById('mac')).hide();
        $(document.getElementById('bios')).hide();
        $(document.getElementById('os')).hide();
        $(document.getElementById('ink')).hide();
        $(document.getElementById('PrinterServiceId')).hide();
        $(document.getElementById('ip_address')).hide();
        $(document.getElementById('notes')).hide();
        $(document.getElementById('disposed_reason')).hide();
        $(document.getElementById('SubmitAsset')).hide();
    }
    else {
        if (typeId == '1') {
            $(document.getElementById('serial')).show();
            $(document.getElementById('cpu')).show();
            $(document.getElementById('ram')).show();
            $(document.getElementById('mac')).show();
            $(document.getElementById('bios')).show();
            $(document.getElementById('os')).show();
            $(document.getElementById('ink')).hide();
            $(document.getElementById('PrinterServiceId')).hide();
            $(document.getElementById('ip_address')).hide();
            $(document.getElementById('notes')).show();
            $(document.getElementById('disposed_reason')).hide();
            $(document.getElementById('SubmitAsset')).show();
            $(document.getElementById('RecoveryKey')).show();
        }
        else if (typeId == '2') {
            $(document.getElementById('serial')).show();
            $(document.getElementById('cpu')).hide();
            $(document.getElementById('ram')).hide();
            $(document.getElementById('mac')).hide();
            $(document.getElementById('bios')).hide();
            $(document.getElementById('os')).hide();
            $(document.getElementById('ink')).hide();
            $(document.getElementById('PrinterServiceId')).hide();
            $(document.getElementById('ip_address')).show();
            $(document.getElementById('notes')).show();
            $(document.getElementById('disposed_reason')).hide();
            $(document.getElementById('SubmitAsset')).show();
            $(document.getElementById('RecoveryKey')).hide();
        }
        else if (typeId == '3') {
            $(document.getElementById('serial')).show();
            $(document.getElementById('cpu')).hide();
            $(document.getElementById('ram')).hide();
            $(document.getElementById('mac')).hide();
            $(document.getElementById('bios')).hide();
            $(document.getElementById('os')).hide();
            $(document.getElementById('ink')).show();
            $(document.getElementById('PrinterServiceId')).show();
            $(document.getElementById('ip_address')).show();
            $(document.getElementById('notes')).show();
            $(document.getElementById('disposed_reason')).hide();
            $(document.getElementById('SubmitAsset')).show();
            $(document.getElementById('RecoveryKey')).hide();
        }
        else if (typeId == '4') {
            $(document.getElementById('serial')).show();
            $(document.getElementById('cpu')).show();
            $(document.getElementById('ram')).show();
            $(document.getElementById('mac')).show();
            $(document.getElementById('bios')).show();
            $(document.getElementById('os')).show();
            $(document.getElementById('ink')).hide();
            $(document.getElementById('PrinterServiceId')).hide();
            $(document.getElementById('ip_address')).hide();
            $(document.getElementById('notes')).show();
            $(document.getElementById('disposed_reason')).hide();
            $(document.getElementById('SubmitAsset')).show();
            $(document.getElementById('RecoveryKey')).show();
        }
        else if (typeId == '5') {
            $(document.getElementById('serial')).hide();
            $(document.getElementById('cpu')).hide();
            $(document.getElementById('ram')).hide();
            $(document.getElementById('mac')).hide();
            $(document.getElementById('bios')).hide();
            $(document.getElementById('os')).hide();
            $(document.getElementById('ink')).hide();
            $(document.getElementById('PrinterServiceId')).hide();
            $(document.getElementById('ip_address')).hide();
            $(document.getElementById('notes')).show();
            $(document.getElementById('disposed_reason')).hide();
            $(document.getElementById('SubmitAsset')).show();
            $(document.getElementById('RecoveryKey')).hide();
        }
        else if (typeId == '6') {
            $(document.getElementById('serial')).hide();
            $(document.getElementById('cpu')).hide();
            $(document.getElementById('ram')).hide();
            $(document.getElementById('mac')).hide();
            $(document.getElementById('bios')).hide();
            $(document.getElementById('os')).hide();
            $(document.getElementById('ink')).hide();
            $(document.getElementById('PrinterServiceId')).hide();
            $(document.getElementById('ip_address')).hide();
            $(document.getElementById('notes')).show();
            $(document.getElementById('disposed_reason')).hide();
            $(document.getElementById('SubmitAsset')).show();
            $(document.getElementById('RecoveryKey')).hide();
        }
        else if (typeId == '7') {
            $(document.getElementById('serial')).show();
            $(document.getElementById('cpu')).hide();
            $(document.getElementById('ram')).hide();
            $(document.getElementById('mac')).hide();
            $(document.getElementById('bios')).hide();
            $(document.getElementById('os')).hide();
            $(document.getElementById('ink')).hide();
            $(document.getElementById('PrinterServiceId')).hide();
            $(document.getElementById('ip_address')).hide();
            $(document.getElementById('notes')).show();
            $(document.getElementById('disposed_reason')).hide();
            $(document.getElementById('SubmitAsset')).show();
            $(document.getElementById('RecoveryKey')).hide();
        }
    }
}

//DropDown Change Events for the Add Asset Form
$(document.body).on("change", "#FormBrandDropdownValue", SortFormAssetModels);
$(document.body).on("change", "#FormTypeDropdownValue", SortFormAssetModels);
$(document.body).on("change", "#FormTypeDropdownValue", ChangeAssetFormVisible);
$(document.body).on("change", "#FormOwnerDropdownValue", function () {
    $(document.getElementById("ShowDepartmentValue")).val($("#FormOwnerDropdownValue option:selected").attr("data-ownerDepartment")).change();
});
$(document.body).on("click", "#disposedCheck", function () {
    if ($(this).prop("checked") == true) {
        $(document.getElementById("disposed_reason")).show();
    }
    else if ($(this).prop("checked") == false) {
        $(document.getElementById("disposed_reason")).hide();
    }
});

//Submit Asset Button Function
$(document.body).on('click', '#SubmitAsset', function (e) {
    //e.preventDefault();
    if (!$("form").valid()) return;
    else {
        var disposed = $(document.getElementById('disposedCheck')).prop("checked");
        var assetId = $(document.getElementById('assetIdValue')).val();
        var po = $(document.getElementById('poValue')).val();
        var dateActive = $(document.getElementById('date_activeValue')).val();
        var assetModelId = $(document.getElementById('FormModelDropdownValue')).val();
        var serial = $(document.getElementById('serialValue')).val();
        var cpu = $(document.getElementById('cpuValue')).val();
        var ram = $(document.getElementById('ramValue')).val();
        var mac = $(document.getElementById('macValue')).val();
        var bios = $(document.getElementById('biosValue')).val();
        var os = $(document.getElementById('osValue')).val();
        var ink = $(document.getElementById('inkValue')).val();
        var printerServiceId = $(document.getElementById('printerServiceValue')).val();
        var ipAddress = $(document.getElementById('ip_addressValue')).val();
        var notes = $(document.getElementById('notesValue')).val();
        var disposedDate = $(document.getElementById('dateDisposed')).val();
        if (disposedDate == null) {
            disposedDate = '1900-01-01';
        }
        var disposedReason = $(document.getElementById('disposed_reasonValue')).val();
        var ownerId = $(document.getElementById('FormOwnerDropdownValue')).val();
        var deviceName = $(document.getElementById('device_nameValue')).val();
        var locationId = $(document.getElementById('FormLocationDropdownValue')).val();
        var dateDeployed = $(document.getElementById('date_deployed')).val();
        var dateReturned = $(document.getElementById('date_returnedVal')).val();
        if (dateReturned == "" || dateReturned == null) {
            dateReturned = '1900-01-01';
        }

        var recoveryKey = $(document.getElementById('recovery_keyValue')).val();


        $.ajax({
            type: "GET",
            url: "../api/definition?addUpdateAssignmentAndAsset=true&AssetId=" + assetId + "&Po=" + po + "&DateInService=" + dateActive + "&ModelId=" + assetModelId + "&DateDisposed="
                + disposedDate + "&Active=" + (!disposed) + "&AdditionalNotes=" + notes + "&BiosVersion=" + bios + "&CPU=" + cpu + "&Ink=" + ink + "&IPAddress=" + ipAddress + "&MACAddress=" + mac + "&OsVersion="
                + os + "&Ram=" + ram + "&Serial=" + serial + "&PrinterServiceCoId=" + printerServiceId + "&DisposedReason=" + disposedReason + "&AssignmentId=" + AssignId + "&OwnerId=" + ownerId
                + "&DeviceName=" + deviceName + "&LocationId=" + locationId + "&DateDeployed=" + dateDeployed + "&DateReturned=" + dateReturned + "&RecoveryKey=" + recoveryKey + "",
            dataType: "json",
            success: function (data) {
                PopulateUpdateAssetForm(assetId, "");
                GetAssets("");
                alert('Asset ' + assetId + ' Successfully ' + AddOrUpdate);
            },
            error: function (data) {
                alert('Cannot Submit form without required Information');
            }
        });
        //Don't leave the page
        return false;
    }
});

//Return Asset Button
$(document.body).on('click', '.ReturnButton', function () {
    var assignmentId = $(this).attr("data-assignmentid");

    $.ajax({
        type: "GET",
        url: "../api/definition?QuickReturn=true&AssignmentId=" + assignmentId + "",
        dataType: "json",
        success: function (data) {
            alert(assignmentId + " was returned");
            GetAssets("");
        },
        error: function (data) {
            alert('Failed to click');
        }
    });
});

//Pull up Update Asset Form when Asset Tag is clicked
$(document.body).on('click', '.clickableAssetTag', function () {
    if ($(this).attr('data-assignmentId') == 0) {
        PopulateUpdateAssetForm($(this).text(), "");
    }
    else {
        PopulateUpdateAssetForm("", $(this).attr('data-assignmentId'));
    }
});



//Click the Update button when enter is pressed
$(document.body).on("keyup", ".form-control", function (e) {
    if (e.keyCode == 13) {
        $(document.getElementById("SubmitAsset")).click();
    }
});

var selectedAssignmentId = 0;
var selectedLicenseId = 0;


//      NEW OWNER FORM

function PopulateNewOwnerForm() {
    AddOrUpdate = "Added";
    addAssetDiv.innerHTML = `
                    <form id="Hover-Form" method="post">
                        <br />
                        <div id="NewOwnerHead"><h2>Add New Owner</h2></div>
                        <div class="leftForm">
                            <div class="formSpacing">
                                <label class="formLabel">Owner/Location Name</label>
                                <input id="OwnerLocationName" name="assetId" placeholder="Owner/Location Name" class="form-control formSpacing" type="text" required>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Details</label>
                                <input id="OwnerLocationDetails" name="po" placeholder="Details" class="form-control" type="text">
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Department</label>
                                <select id='DepartmentOwnerDropDown' class='maindropdown typesDropDown form-control'></select>
                            </div>
                            <div class="formSpacing">
                                <button class="CancelButtons" type="button" onclick="CloseNewAssetForm()">Cancel</button>
                                <button id="SubmitOwner" class="AddButton" type="submit">Submit</button>
                            </div>
                        </div>
                            
                        <br />
                        <br/>

                        <br/>
                        <br/>
                    </form>`;
    GetDepartments('#DepartmentOwnerDropDown');
    $('.HidePage').show();
}
//Submit New Owner Button Function
$(document.body).on('click', '#SubmitOwner', function (e) {
    //e.preventDefault();
    if (!$("form").valid()) return;
    else {
        var ownerLocationName = $(document.getElementById('OwnerLocationName')).val();
        var ownerLocationDetails = $(document.getElementById('OwnerLocationDetails')).val();
        var departmentId = $(document.getElementById('DepartmentOwnerDropDown')).val();
        


        $.ajax({
            type: "GET",
            url: "../api/definition?addUpdateOwner=true&OwnerName=" + ownerLocationName + "&UserNameOrDetails=" + ownerLocationDetails + "&DepartmentId=" + departmentId + "&OwnerStatus=true",
            dataType: "json",
            success: function (data) {
                GetOwners('.ownerNamesDropDown', '');
                alert('Owner ' + ownerLocationName + ' Successfully Added');
            },
            error: function (data) {
                alert('Cannot Submit form without required Information');
            }
        });
        //Don't leave the page
        return false;
    }
});

//      NEW ASSET MODEL
function PopulateNewAssetModelForm() {
    AddOrUpdate = "Added";
    addAssetDiv.innerHTML = `
                    <form id="Hover-Form" method="post">
                        <br />
                        <div id="NewOwnerHead"><h2>Add New Asset Model</h2></div>
                        <div class="leftForm">
                            <div class="formSpacing">
                                <label class="formLabel">Type</label>
                                <select id='TypeIdAssetModelOptions' class='maindropdown typesDropDown form-control'></select>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Brand</label>
                                <select id='BrandIdAssetModelOptions' class='maindropdown typesDropDown form-control'></select>
                            </div>
                            <div class="formSpacing">
                                <label class="formLabel">Name</label>
                                <input id="AssetModelNameText" placeholder="Asset Model Name" class="form-control" type="text">
                            </div>
                            <div class="formSpacing">
                                <button class="CancelButtons" type="button" onclick="CloseNewAssetForm()">Cancel</button>
                                <button id="SubmitNewAssetType" class="AddButton" type="submit">Submit</button>
                            </div>
                        </div>
                            
                        <br />
                        <br/>

                        <br/>
                        <br/>
                    </form>`;
    GetTypes('#TypeIdAssetModelOptions');
    GetBrands("#BrandIdAssetModelOptions");
    $('.HidePage').show();
}

// Submit new Asset Model
$(document.body).on('click', '#SubmitNewAssetType', function (e) {
    //e.preventDefault();
    if (!$("form").valid()) return;
    else {
        var assetModelName = $(document.getElementById('AssetModelNameText')).val();
        var brandId = $(document.getElementById('BrandIdAssetModelOptions')).val();
        var typeId = $(document.getElementById('TypeIdAssetModelOptions')).val();



        $.ajax({
            type: "GET",
            url: "../api/definition?addUpdateModel=true&AssetModelName=" + assetModelName + "&BrandId=" + brandId + "&TypeId=" + typeId + "&IsActive=true",
            dataType: "json",
            success: function (data) {
                GetModels('.assetModelsDropDown', 'NormalModelSelectRow', '');
                alert('Asset Model ' + data.AssetModelName + ' Successfully Added');
            },
            error: function (data) {
                alert('Cannot Submit form without required Information');
            }
        });
        //Don't leave the page
        return false;
    }
});



//Opens either New Asset Model, or new Owner Form
$(document.body).on("change", "#AddNewOptions", function () {
    var selectedAssets = $(this).val();
    if (selectedAssets == "AddOwner") {
        PopulateNewOwnerForm();
    }
    else if (selectedAssets == "AddAssetModel") {
        PopulateNewAssetModelForm();
    }
});

$(document.body).on("change", "#SortAssetStatusDrop", function () {
    var selectedAssets = $(this).val();
    if (selectedAssets == "AllActiveAssets") {
        GetAssets(selectedAssets);
        $('#assetTypes').show();
    }
    else if (selectedAssets == "CheckedIn") {
        GetAssets(selectedAssets);
        $('#assetTypes').show();
    }
    else if (selectedAssets == "CheckedOut") {
        GetAssets(selectedAssets);
        $('#assetTypes').show();
    }
    else if (selectedAssets == "Disposed") {
        GetAssets(selectedAssets);
        $('#assetTypes').show();
    }
    else if (selectedAssets == "AllAssets") {
        GetAssets(selectedAssets);
        $('#assetTypes').show();
    }
});




//Ways to close Form
$('.HidePage').click(CloseNewAssetForm);
function CloseNewAssetForm() {
    addAssetDiv.innerHTML = "";
    $('.HidePage').hide();
}








//Create Button to appear when scrolling down to get back to the top

window.onscroll = function () { scrollFunction(); };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("topButton").style.display = "block";
    } else {
        document.getElementById("topButton").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}



function GetEmployees() {
    $.ajax({
        type: "GET",
        url: "api/getemployee?getShortEmployeeList=true",
        dataType: "json",
        success: function (data) {
            var employees = [];
            $.each(data, function (value) {
                employees.push('<option value="' + value.EmployeeSid + '">' + value.Name + ' (' + value.Department + ')</option>')
            });
            $('.SelectEmployee').html('<option value="" selected disabled>Select Employee</option>' + employees.join(""));
            $('.EmployeeCredSelect').html('<option value="" selected disabled>Select Employee</option>' + employees.join(""));
            $('.EmployeeCredSelect').chosen();
        }
    });
}

$('#DownloadButton').click(downloadExcel);

function downloadExcel() {
    //reset the string to only include the column heads for spreadsheet
    var tdCheckCount = $('.assetTableRow').first().children('td').length;
    //If the count is greater than 10(All Assets), show date deployed, and disposed.
    if (tdCheckCount > 10) {
        reportDownloadString = 'Active Sorted Assets Report\r';
        reportDownloadString += 'Asset, Current Owner, Type, Brand, Model, Device Name, Department, Bios, OS, Date Deployed, Date Returned\r';
    }
    //If the count is equal to 10(Disposed), put date disposed
    else if (tdCheckCount == 10) {
        reportDownloadString = 'Disposed Sorted Assets Report\r';
        reportDownloadString += 'Asset, Current Owner, Type, Brand, Model, Device Name, Department, Bios, OS, Date Disposed\r';
    }

    //Find all the visible rows, and add the information to the string to download
    $('.assetTableRow:visible').each(function () {
        var tdCount = $(this).children('td').length;
        reportDownloadString += $(this).find('td').eq(0).html() + ', ' + $(this).find('td').eq(1).html() + ', ' + $(this).find('td').eq(2).html() + ', ' + $(this).find('td').eq(3).html() + ', ' + $(this).find('td').eq(4).html() + ', ' + ((tdCheckCount > 5) ? ($(this).find('td').eq(5).html()) : '') + ', ' + ((tdCheckCount > 5) ? ($(this).find('td').eq(6).html()) : '') + ', ' + ((tdCheckCount > 5) ? ($(this).find('td').eq(7).html()) : '') + ', ' + ((tdCheckCount > 5) ? ($(this).find('td').eq(8).html()) : '') + ', ' + ((tdCheckCount > 5) ? ($(this).find('td').eq(9).html()) : '') + ', ' + (tdCount > 10 ? (($(this).find('td').eq(10).html().includes('<button') == true) ? "" : $(this).find('td').eq(10).html()) : '') + '\r';
    });

    var mylink = document.createElement('a');
    mylink.download = "ReportDownload.csv";
    mylink.href = "data:application/csv," + escape(reportDownloadString);
    mylink.click();
}
