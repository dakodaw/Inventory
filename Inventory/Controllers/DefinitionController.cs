using Inventory.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Inventory.Controllers
{
    public class DefinitionController : ApiController
    {
        InventoryEntities _db = new InventoryEntities();
        


        //ASSET BRANDS, TYPES, MODELS

        //Allow User to get all Brands
        [HttpGet]
        public List<AssetBrand> GetAssetBrands(bool getBrands)
        {
            return _db.AssetBrands.ToList();
        }
        
        //Allow User to add or update computer brands
        [HttpGet]
        public AssetBrand AddUpdateAssetBrands([FromUri] bool addUpdateBrand, [FromUri] AssetBrand computerBrand)
        {
            AssetBrand brand = _db.AssetBrands.FirstOrDefault(i => i.Id == computerBrand.Id || i.BrandName == computerBrand.BrandName.Trim());
            if (brand == null)
            {
                brand = new AssetBrand
                {
                    Id = 0
                };
            }

            brand.BrandName = computerBrand.BrandName.Trim();
            //brand.IsActive = computerBrand.IsActive;

            if (brand.Id == 0)
                _db.AssetBrands.Add(brand);
            _db.SaveChanges();
            return brand;
        }


        //Allow User to Get Asset Types(Laptop, Desktop, Printer, etc..)
        [HttpGet]
        public List<AssetType> GetAssetTypes(bool getTypes)
        {
            return _db.AssetTypes.ToList();
        }


        //Adds or updates types
        [HttpPost]
        public AssetType AddUpdateAssetType([FromUri] bool addUpdateType, [FromBody] AssetType assetType)
        {
            AssetType newType = _db.AssetTypes.FirstOrDefault(i => i.Id == assetType.Id || i.TypeName == assetType.TypeName.Trim());
            if (newType == null)
            {
                newType = new AssetType
                {
                    Id = 0
                };
            }

            newType.TypeName= assetType.TypeName.Trim();
            //newType.IsActive = assetType.IsActive;

            if (newType.Id == 0)
                _db.AssetTypes.Add(newType);
            _db.SaveChanges();
            return newType;
        }

        //Gets all information for the computer models, including the brand and type
        [HttpGet]
        public List<AssetModelDetails> GetAssetModels(bool getAssetModels)
        {
            var assetModels = (from am in _db.AssetModels.Where(i => i.IsActive)
                               join b in _db.AssetBrands on am.BrandId equals b.Id
                               join t in _db.AssetTypes on am.TypeId equals t.Id
                               orderby am.AssetModelName
                               select new AssetModelDetails { BrandId = b.Id, Id = am.Id, BrandName = b.BrandName, Name = am.AssetModelName, IsActive = am.IsActive, TypeId = t.Id, TypeName = t.TypeName }).ToList();
            return assetModels;
        }

        //Add or update the asset model
        [HttpGet]
        public AssetModel AddUpdateAssetModel([FromUri] bool addUpdateModel, [FromUri] string AssetModelName, [FromUri] int BrandId, [FromUri] int TypeId, [FromUri] bool IsActive, [FromUri] int AssetModelId = -1)
        {
            AssetModel newModel = _db.AssetModels.FirstOrDefault(i => i.Id == AssetModelId || i.AssetModelName == AssetModelName.Trim());
            if (newModel == null)
            {
                newModel = new AssetModel
                {
                    AssetModelName = AssetModelName.Trim(),
                    BrandId = BrandId,
                    TypeId = TypeId,
                    IsActive = IsActive
                };
                _db.AssetModels.Add(newModel);
            }
            else
            {
                _db.AssetModels.Where(i => i.Id == newModel.Id).FirstOrDefault().AssetModelName = AssetModelName;
                _db.AssetModels.Where(i => i.Id == newModel.Id).FirstOrDefault().BrandId = BrandId;
                _db.AssetModels.Where(i => i.Id == newModel.Id).FirstOrDefault().TypeId = TypeId;
                _db.AssetModels.Where(i => i.Id == newModel.Id).FirstOrDefault().IsActive = IsActive;
            }    
            _db.SaveChanges();
            return newModel;
        }

        //Gets all the Departments
        [HttpGet]
        public List<Department> GetDepartments(bool getDepartments)
        {
            return _db.Departments.ToList();
        }

        //Gets all the Owners
        [HttpGet]
        public List<OwnerDetails> GetOwners([FromUri]bool getOwners)
        {
            var OwnerDetails = (from o in _db.Owners/*.Where(i => i.OwnerStatus == true)*/
                                join d in _db.Departments on o.DepartmentId equals d.Id
                                select new OwnerDetails
                                {
                                    OwnerId = o.Id.ToString(),
                                    OwnerName = o.OwnerName,
                                    OwnerStatus = o.OwnerStatus,
                                    UserName = o.UserName,
                                    DepartmentId = d.Id,
                                    DepartmentName = d.DepartmentName
                                }).ToList();

            var AllOwnersAndLocations = OwnerDetails;

            return AllOwnersAndLocations.ToList();
        }

        //Adds or updates an owner
        [HttpGet]
        public Owner AddUpdateOwner([FromUri] bool addUpdateOwner, [FromUri] string OwnerName, [FromUri] string UserNameOrDetails, [FromUri] int DepartmentId, [FromUri] bool OwnerStatus, [FromUri] int OwnerId = -1)
        {
            //Check to see if there is an owner matched to the ownerName, or to the id if ID is available
            var newOwner = _db.Owners.Where(i=>i.OwnerName.Contains(OwnerName.Trim()) || i.Id == OwnerId).FirstOrDefault();
            //If there isn't a matching owner, add an owner
            if(newOwner == null)
            {
                newOwner = new Owner
                {
                    OwnerName = OwnerName,
                    UserName = UserNameOrDetails,
                    DepartmentId = DepartmentId,
                    OwnerStatus = OwnerStatus
                };
                _db.Owners.Add(newOwner);
            }
            //If there is a matching owner, update the owner
            else
            {
                _db.Owners.Where(i => i.Id == newOwner.Id).FirstOrDefault().OwnerName = OwnerName;
                _db.Owners.Where(i => i.Id == newOwner.Id).FirstOrDefault().UserName = UserNameOrDetails;
                _db.Owners.Where(i => i.Id == newOwner.Id).FirstOrDefault().DepartmentId = DepartmentId;
                _db.Owners.Where(i => i.Id == newOwner.Id).FirstOrDefault().OwnerStatus = OwnerStatus;
            }

            _db.SaveChanges();
            return newOwner;
        }


        //Gets all Locations
        [HttpGet]
        public List<Location> GetLocations(bool getLocations)
        {
            return _db.Locations.ToList();
        }




        //ASSETS AND ASSIGNMENTS

        //Adds or Updates an asset Id
        [HttpGet]
        public Asset AddUpdateAssetIdGet([FromUri] bool addUpdateAssetIdGet, [FromUri] int AssetId, [FromUri] string Po, [FromUri] DateTime DateInService, [FromUri] int ModelId
            , [FromUri] DateTime DateDisposed, [FromUri] bool Active, [FromUri] string AdditionalNotes, [FromUri] string BiosVersion, [FromUri] string CPU, [FromUri] string Ink, [FromUri] string IPAddress
            , [FromUri] string MACAddress, [FromUri] string OsVersion, [FromUri] string Ram, [FromUri] string Serial, [FromUri] string PrinterServiceCoId, [FromUri] string DisposedReason)
        {
            //Assignment newAssignment = new Assignment();
            //If an asset isn't already in the database, create a new Asset with provided information 
            Asset newAsset = new Asset();

            if (_db.Assets.Where(i => i.Id == AssetId).FirstOrDefault() == null)
            {
                newAsset.Id = AssetId;
                newAsset.Po = Po;
                newAsset.DateInService = DateInService;
                newAsset.ModelId = ModelId;
                newAsset.DateDisposed = DateDisposed;
                newAsset.Active = Active;
                newAsset.AdditionalNotes = AdditionalNotes;
                newAsset.BiosVersion = BiosVersion;
                newAsset.Cpu = CPU;
                newAsset.Ink = Ink;
                newAsset.IpAddress = IPAddress;
                newAsset.MacAddress = MACAddress;
                newAsset.OsVersion = OsVersion;
                newAsset.Ram = Ram;
                newAsset.Serial = Serial;
                newAsset.ServiceCompanyId = PrinterServiceCoId;
                newAsset.DisposedReason = DisposedReason;
            }
            else
            {
                //If it's existant, update it with new information
                newAsset = _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault();
                newAsset.Po = Po;
                newAsset.DateInService = DateInService;
                newAsset.ModelId = ModelId;
                newAsset.DateDisposed = DateDisposed;
                newAsset.Active = Active;
                newAsset.AdditionalNotes = AdditionalNotes;
                newAsset.BiosVersion = BiosVersion;
                newAsset.Cpu = CPU;
                newAsset.Ink = Ink;
                newAsset.IpAddress = IPAddress;
                newAsset.MacAddress = MACAddress;
                newAsset.OsVersion = OsVersion;
                newAsset.Ram = Ram;
                newAsset.Serial = Serial;
                newAsset.ServiceCompanyId = PrinterServiceCoId;
                newAsset.DisposedReason = DisposedReason;
            }

            //See if the asset is already assigned to the owner provided
            //If it is assigned, update assignment info
            //If it isn't already assigned to them, create a new assignment
            //Mark other assignments as returned

            //_db.Assets.Add(newAsset);
            //_db.SaveChanges();
            return newAsset;
        }


        //Adds or Updates an asset and assignment Id
        [HttpGet]
        public Assignment AddUpdateAssignmentAndIdGet(/*HERE ARE THE ASSET VARIABLES*/[FromUri] bool addUpdateAssignmentAndAsset, [FromUri] int AssetId, [FromUri] string Po, [FromUri] DateTime DateInService, [FromUri] int ModelId
            , [FromUri] DateTime DateDisposed, [FromUri] bool Active, [FromUri] string AdditionalNotes, [FromUri] string BiosVersion, [FromUri] string CPU, [FromUri] string Ink, [FromUri] string IPAddress
            , [FromUri] string MACAddress, [FromUri] string OsVersion, [FromUri] string Ram, [FromUri] string Serial, [FromUri] string PrinterServiceCoId, [FromUri] string DisposedReason
            ,/*HERE STARTS THE ASSIGNMENT VARIABLES*/ [FromUri] int AssignmentId, [FromUri] string OwnerId, [FromUri] string DeviceName, [FromUri] int LocationId, [FromUri] DateTime DateDeployed, [FromUri] DateTime DateReturned
            , [FromUri] string RecoveryKey)
        {
            //Assignment newAssignment = new Assignment();
            //If an asset isn't already in the database, create a new Asset with provided information 
            Asset newAsset = new Asset();
            Assignment newAssignment = new Assignment();
            var checking = _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault();
            DateTime DisposedDay = DateDisposed;
            DateTime ReturnedDay = DateReturned;

            bool CheckedOut = true;

            //If the the asset is disposed, set the disposed date to now, and if the returnedDay isn't set, then set that to now as well
            if(Active == false)
            {
                DisposedDay = DateTime.Now;
                if (DateReturned == Convert.ToDateTime("1900-01-01"))
                {
                    ReturnedDay = DateTime.Now;
                }
                CheckedOut = false;
            }
            else
            {
                DisposedDay = Convert.ToDateTime("1900-01-01");
                if (DateReturned == Convert.ToDateTime("1900-01-01"))
                {
                    CheckedOut = true;
                }
                else
                {
                    CheckedOut = false;
                }
            }

            if (_db.Assets.Where(i => i.Id == AssetId).FirstOrDefault() == null)
            {
                newAsset.Id = AssetId;
                newAsset.Po = Po;
                newAsset.DateInService = DateInService;
                newAsset.ModelId = ModelId;
                newAsset.DateDisposed = DisposedDay;
                newAsset.Active = Active;
                newAsset.AdditionalNotes = AdditionalNotes;
                newAsset.BiosVersion = BiosVersion;
                newAsset.Cpu = CPU;
                newAsset.Ink = Ink;
                newAsset.IpAddress = IPAddress;
                newAsset.MacAddress = MACAddress;
                newAsset.OsVersion = OsVersion;
                newAsset.Ram = Ram;
                newAsset.Serial = Serial;
                newAsset.ServiceCompanyId = PrinterServiceCoId;
                newAsset.DisposedReason = DisposedReason;
                _db.Assets.Add(newAsset);
            }
            else
            {
                //If it exists, update it with new information
                newAsset = _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault();
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().Po = Po;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().DateInService = DateInService;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().ModelId = ModelId;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().DateDisposed = DisposedDay;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().Active = Active;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().AdditionalNotes = AdditionalNotes;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().BiosVersion = BiosVersion;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().Cpu = CPU;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().Ink = Ink;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().IpAddress = IPAddress;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().MacAddress = MACAddress;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().OsVersion = OsVersion;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().Ram = Ram;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().Serial = Serial;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().ServiceCompanyId = PrinterServiceCoId;
                _db.Assets.Where(i => i.Id == AssetId).FirstOrDefault().DisposedReason = DisposedReason;
            }
            _db.SaveChanges();


            //See if the asset is already assigned to the owner provided
            if (AssignmentId == 0)
            {
                //If there isn't an assignment ID entered, check to see if there is a previous assignment in the database
                if (_db.Assignments.Where(i=>i.AssetId == AssetId).FirstOrDefault() != null)
                {
                    //Get previous assignments
                    var previousAssigments = _db.Assignments.Where(i => i.AssetId == AssetId);

                    //If there is an assignment in the database with the matching asset, check if it is an active assignment
                    var tempOwnerId = OwnerId;
                    if (previousAssigments.Where(i=>i.CheckedOut == true && i.OwnerId == tempOwnerId).FirstOrDefault() != null)
                    {
                        //Update Assignment
                        _db.Assignments.Where(i => i.CheckedOut == true && i.OwnerId == tempOwnerId).FirstOrDefault().DeviceName = DeviceName;
                        _db.Assignments.Where(i => i.CheckedOut == true && i.OwnerId == tempOwnerId).FirstOrDefault().LocationId = LocationId;
                        _db.Assignments.Where(i => i.CheckedOut == true && i.OwnerId == tempOwnerId).FirstOrDefault().DateDeployed = DateDeployed;
                        _db.Assignments.Where(i => i.CheckedOut == true && i.OwnerId == tempOwnerId).FirstOrDefault().DateReturned = ReturnedDay;
                        if(DateReturned != Convert.ToDateTime("1900-01-01"))
                        {
                            _db.Assignments.Where(i => i.CheckedOut == true && i.OwnerId == tempOwnerId).FirstOrDefault().CheckedOut = true;
                        }
                        else
                        {
                            _db.Assignments.Where(i => i.CheckedOut == true && i.OwnerId == tempOwnerId).FirstOrDefault().CheckedOut = false;
                        }
                        _db.Assignments.Where(i => i.CheckedOut == true && i.OwnerId == tempOwnerId).FirstOrDefault().DateUpdated = DateTime.Now;
                        _db.Assignments.Where(i => i.CheckedOut == true && i.OwnerId == tempOwnerId).FirstOrDefault().Bitlocker = RecoveryKey;

                    }
                    //If there aren't assignments with the given owner ID, create a new Assignment
                    else if(previousAssigments.Where(i => i.CheckedOut == true && i.OwnerId != tempOwnerId).FirstOrDefault() != null)
                    {
                        //Mark previous assignments as returned with Today as the date
                        foreach(var assignment in previousAssigments.Where(i => i.CheckedOut == true && i.OwnerId != tempOwnerId))
                        {
                            assignment.CheckedOut = false;
                            assignment.DateReturned = DateTime.Now;
                            assignment.DateUpdated = DateTime.Now;
                        }
                        //Add New Assignment
                        newAssignment = new Assignment
                        {
                            AssetId = AssetId,
                            CheckedOut = true,
                            OwnerId = OwnerId,
                            DeviceName = DeviceName,
                            LocationId = LocationId,
                            DateDeployed = DateDeployed,
                            DateReturned = ReturnedDay,
                            DateUpdated = DateTime.Now,
                            Bitlocker = RecoveryKey,
                            UserUpdate = User.Identity.Name
                        };
                        _db.Assignments.Add(newAssignment);
                    }
                    //If all previous assignments are checked in, Just add a new Assignment
                    else
                    {
                        newAssignment = new Assignment
                        {
                            AssetId = AssetId,
                            CheckedOut = true,
                            OwnerId = OwnerId,
                            DeviceName = DeviceName,
                            LocationId = LocationId,
                            DateDeployed = DateDeployed,
                            DateReturned = ReturnedDay,
                            DateUpdated = DateTime.Now,
                            Bitlocker = RecoveryKey,
                            UserUpdate = (User.Identity.Name.Split('\\')[1])
                        };
                        _db.Assignments.Add(newAssignment);
                    }
                }
                else
                {
                    //Add Assignment
                    newAssignment = new Assignment();
                    newAssignment.AssetId = AssetId;
                    newAssignment.CheckedOut = true;
                    newAssignment.OwnerId = OwnerId;
                    newAssignment.DeviceName = DeviceName;
                    newAssignment.LocationId = LocationId;
                    newAssignment.DateDeployed = DateDeployed;
                    newAssignment.DateReturned = ReturnedDay;
                    newAssignment.DateUpdated = DateTime.Now;
                    newAssignment.Bitlocker = RecoveryKey;
                    newAssignment.UserUpdate = (User.Identity.Name.Split('\\')[1]);

                    _db.Assignments.Add(newAssignment);
                }
            }
            //If an assignment ID is given, check to see if the owner given matches.
            else
            {
                //Get previous assignments to mark as returned if 
                var previousAssigments = _db.Assignments.Where(i => i.AssetId == AssetId).ToList();

                //If there is an assignment in the database with the matching asset, check if it is an active assignment
                var tempOwnerId = OwnerId;
               
                //If owner matches, Update the assignment, 
                if (_db.Assignments.Where(i=>i.Id == AssignmentId).FirstOrDefault().OwnerId == tempOwnerId)
                {
                    _db.Assignments.Where(i => i.Id == AssignmentId).FirstOrDefault().AssetId = AssetId;
                    _db.Assignments.Where(i => i.Id == AssignmentId).FirstOrDefault().CheckedOut = CheckedOut;
                    _db.Assignments.Where(i => i.Id == AssignmentId).FirstOrDefault().OwnerId = OwnerId;
                    _db.Assignments.Where(i => i.Id == AssignmentId).FirstOrDefault().DeviceName = DeviceName;
                    _db.Assignments.Where(i => i.Id == AssignmentId).FirstOrDefault().LocationId = LocationId;
                    _db.Assignments.Where(i => i.Id == AssignmentId).FirstOrDefault().DateDeployed = DateDeployed;
                    _db.Assignments.Where(i => i.Id == AssignmentId).FirstOrDefault().DateReturned = ReturnedDay;
                    _db.Assignments.Where(i => i.Id == AssignmentId).FirstOrDefault().DateUpdated = DateTime.Now;
                    _db.Assignments.Where(i => i.Id == AssignmentId).FirstOrDefault().Bitlocker = RecoveryKey;
                    _db.Assignments.Where(i => i.Id == AssignmentId).FirstOrDefault().UserUpdate = (User.Identity.Name.Split('\\')[1]);
                }
                //If the Owner ID isn't matching the one of the one with the assignment ID
                else
                {
                    //Mark all previous assignments, with the returned Date as today
                    foreach(var assignment in _db.Assignments.Where(i=>i.AssetId == AssetId))
                    {
                        if(assignment.DateReturned == Convert.ToDateTime("1900-01-01"))
                        {
                            assignment.DateReturned = DateTime.Now;
                        }
                        assignment.CheckedOut = false;
                    }
                    _db.SaveChanges();

                    //Add New Assignment
                    newAssignment = new Assignment
                    {
                        AssetId = AssetId,
                        CheckedOut = true,
                        OwnerId = OwnerId,
                        DeviceName = DeviceName,
                        LocationId = LocationId,
                        DateDeployed = DateDeployed,
                        DateReturned = ReturnedDay,
                        DateUpdated = DateTime.Now,
                        Bitlocker = RecoveryKey,
                        UserUpdate = (User.Identity.Name.Split('\\')[1])
                    };
                    _db.Assignments.Add(newAssignment);
                }
            }

            //Save the Changes
            _db.SaveChanges();
            return newAssignment;
        }

        
        [HttpGet]
        public DetailedAssignmentAssetInfo GetDetailedAssignmentInfo([FromUri] bool getAssetAssignment, [FromUri] int AssetId = -1, int AssignmentId = 0)
        {
            
            //Get all the owners from owners table, and bridge table
            var AllOwnersAndLocations = GetOwners(true);
            //Get all the asset info from all assets
            var allAssetInfoAssignments = (from aa in _db.Assets
                                           join m in _db.AssetModels on aa.ModelId equals m.Id
                                           join b in _db.AssetBrands on m.BrandId equals b.Id
                                           join t in _db.AssetTypes on m.TypeId equals t.Id
                                           select new FullAssetInfo
                                           {
                                               AssetId = aa.Id,
                                               AssetModelId = aa.ModelId,
                                               AssetModel = m.AssetModelName,
                                               Bios = aa.BiosVersion,
                                               BrandId = b.Id,
                                               BrandName = b.BrandName,
                                               OS = aa.OsVersion,
                                               TypeId = t.Id,
                                               TypeName = t.TypeName,
                                               Active = aa.Active,
                                               ActiveDate = aa.DateInService,
                                               CPU = aa.Cpu,
                                               DateDisposed = (DateTime)aa.DateDisposed,
                                               DisposedReason = aa.DisposedReason,
                                               InkModel = aa.Ink,
                                               IPAddress = aa.IpAddress,
                                               MACAddress = aa.MacAddress,
                                               Notes = aa.AdditionalNotes,
                                               PO = aa.Po,
                                               PrinterServiceId = aa.ServiceCompanyId,
                                               Ram = aa.Ram,
                                               Serial = aa.Serial

                                           }).ToList();
            //Get matching asset if it exists
            var matchingAsset = allAssetInfoAssignments.Where(i => i.AssetId == AssetId).FirstOrDefault();


            //If I have the asset, not the assignment, get assets with the matching assetId
            var matchingAssignment = new Assignment();

            if (matchingAsset == null)
            {
                matchingAssignment = _db.Assignments.Where(i => i.Id == AssignmentId).FirstOrDefault();
                if(matchingAssignment == null)
                {
                    return new DetailedAssignmentAssetInfo { AssignmentInfo = new ShortAssignmentInfo { AssignmentId = -1 } };
                }
            }
            else
            {
                matchingAssignment = _db.Assignments.Where(i => i.AssetId == matchingAsset.AssetId).OrderByDescending(i => i.CheckedOut).ThenByDescending(i => i.DateDeployed).FirstOrDefault();

                if (matchingAssignment == null)
                {
                    var tempOwner = AllOwnersAndLocations.Where(i => i.OwnerId == "893").FirstOrDefault();

                    return new DetailedAssignmentAssetInfo {
                        AssetInfo = matchingAsset,
                        AssignmentInfo = new ShortAssignmentInfo
                        {
                            CheckedOut = false,
                            DateDeployed = DateTime.Now.ToString("MM/dd/yyy"),
                            DateReturned = DateTime.Now.ToString("MM/dd/yyy"),
                            DeviceName = "No Assignment Found",
                            LocationId = 2,
                            RecoveryKey = ""
                        },
                        OwnerInfo = tempOwner
                    };
                }
            }

            //Get the Asset Info and owner that matche the matching assignment
            var assetInfo = allAssetInfoAssignments.Where(i => i.AssetId == matchingAssignment.AssetId).FirstOrDefault();
            var selectedOwner = AllOwnersAndLocations.Where(i => i.OwnerId == matchingAssignment.OwnerId).FirstOrDefault();
            DetailedAssignmentAssetInfo detailedAssignment;
            if (selectedOwner == null)
            {
                detailedAssignment = new DetailedAssignmentAssetInfo
                {
                    AssetInfo = assetInfo,
                    AssignmentInfo = new ShortAssignmentInfo
                    {
                        AssignmentId = matchingAssignment.Id,
                        CheckedOut = matchingAssignment.CheckedOut,
                        DateDeployed = matchingAssignment.DateDeployed.ToString("MM/dd/yyyy"),
                        DateReturned = matchingAssignment.DateReturned.ToString("MM/dd/yyyy"),
                        DeviceName = "Needs Attention",
                        LocationId = matchingAssignment.LocationId,
                        RecoveryKey = matchingAssignment.Bitlocker,
                    },
                    OwnerInfo = new OwnerDetails
                    {
                        OwnerName = "Needs Attention",
                        DepartmentId = 144,
                        UserName = "Needs Attention",
                    }
                };
            }
            else
            {
                detailedAssignment = new DetailedAssignmentAssetInfo
                {
                    AssetInfo = assetInfo,
                    AssignmentInfo = new ShortAssignmentInfo
                    {
                        AssignmentId = matchingAssignment.Id,
                        CheckedOut = matchingAssignment.CheckedOut,
                        DateDeployed = matchingAssignment.DateDeployed.ToString("MM/dd/yyyy"),
                        DateReturned = matchingAssignment.DateReturned.ToString("MM/dd/yyyy"),
                        DeviceName = matchingAssignment.DeviceName,
                        LocationId = matchingAssignment.LocationId,
                        RecoveryKey = matchingAssignment.Bitlocker,
                    },
                    OwnerInfo = selectedOwner
                };
            }
            return detailedAssignment;
        }

        [HttpGet]
        public List<AssetHistoryLine> GetAssignmentHistory([FromUri] bool getAssetAssignmentHistory, [FromUri] int AssetId)
        {
            var AllOwnersAndLocations = GetOwners(true);
            //Get all the asset info from all assets
            var allAssets = (from aa in _db.Assets.Where(i=>i.Id == AssetId)
                                           join m in _db.AssetModels on aa.ModelId equals m.Id
                                           join b in _db.AssetBrands on m.BrandId equals b.Id
                                           join t in _db.AssetTypes on m.TypeId equals t.Id
                                           select new FullAssetInfo
                                           {
                                               AssetId = aa.Id,
                                               AssetModelId = aa.ModelId,
                                               AssetModel = m.AssetModelName,
                                               Bios = aa.BiosVersion,
                                               BrandId = b.Id,
                                               BrandName = b.BrandName,
                                               OS = aa.OsVersion,
                                               TypeId = t.Id,
                                               TypeName = t.TypeName,
                                               Active = aa.Active,
                                               ActiveDate = aa.DateInService,
                                               CPU = aa.Cpu,
                                               DateDisposed = (DateTime)aa.DateDisposed,
                                               DisposedReason = aa.DisposedReason,
                                               InkModel = aa.Ink,
                                               IPAddress = aa.IpAddress,
                                               MACAddress = aa.MacAddress,
                                               Notes = aa.AdditionalNotes,
                                               PO = aa.Po,
                                               PrinterServiceId = aa.ServiceCompanyId,
                                               Ram = aa.Ram,
                                               Serial = aa.Serial

                                           }).ToList();
            var AllRelatedAssignments = _db.Assignments.Where(i => i.AssetId == AssetId).ToList();
            var assetHistory = (from a in AllRelatedAssignments
                                join aa in allAssets on a.AssetId equals aa.AssetId
                                join o in AllOwnersAndLocations on a.OwnerId equals o.OwnerId
                                where a.OwnerId != "1406"
                                where a.OwnerId != "893"
                                orderby a.CheckedOut descending, a.DateReturned descending
                                select new AssetHistoryLine
                                {
                                    OwnerName = o.OwnerName,
                                    UserName = o.UserName,
                                    DepartmentName = o.DepartmentName,
                                    DateDeployed = a.DateDeployed.ToString("MM/dd/yyyy"),
                                    DateReturned = a.DateReturned.ToString("MM/dd/yyyy")
                                }).ToList();

            //var assetHistory = (from aa in _db.Assignments.Where(i => i.AssetId == AssetId)
            //                    join o in _db.Owners on aa.OwnerId equals o.Id.ToString()
            //                    join d in _db.Departments on o.DepartmentId equals d.Id
            //                    where aa.OwnerId != "1406"
            //                    where aa.OwnerId != "893"
            //                    orderby aa.CheckedOut descending, aa.DateReturned descending
            //                    select new AssetHistoryLine
            //                    {
            //                        OwnerName = o.OwnerName,
            //                        UserName = o.UserName,
            //                        DepartmentName = d.DepartmentName,
            //                        DateDeployed = aa.DateDeployed.ToString(),
            //                        DateReturned = aa.DateReturned.ToString()
            //                    }).ToList();

            return assetHistory;
        }



        [HttpGet]
        public string QuickReturn([FromUri] bool QuickReturn, int AssignmentId)
        {
            try
            {
                _db.Assignments.Where(i => i.Id == AssignmentId).FirstOrDefault().DateReturned = DateTime.Now;
                _db.Assignments.Where(i => i.Id == AssignmentId).FirstOrDefault().CheckedOut = false;

                _db.SaveChanges();
                return "Success for " + AssignmentId;
            }
            catch
            {
                return "Operation Failed";
            }
        }



        //Get All Asset Tags
        [HttpGet]
        public List<ShortAssetAssignmentInfo> GetAllAssets([FromUri] bool getAllAssets, [FromUri] string filterType="")
        {
            List<ShortAssetAssignmentInfo> allAssetAssignments = new List<ShortAssetAssignmentInfo>();

            var AllOwnersAndLocations = GetOwners(true);
            //Get all the asset info from all assets
            var allAssetInfoAssignments = (from aa in _db.Assets
                            join m in _db.AssetModels on aa.ModelId equals m.Id
                            join b in _db.AssetBrands on m.BrandId equals b.Id
                            join t in _db.AssetTypes on m.TypeId equals t.Id
                            select new ShortAssetInfo
                            {
                                AssetId = aa.Id,
                                AssetModelId = aa.ModelId,
                                AssetModel = m.AssetModelName,
                                Bios = aa.BiosVersion,
                                BrandId = b.Id,
                                Brand = b.BrandName,
                                OS = aa.OsVersion,
                                TypeId = t.Id,
                                Type = t.TypeName,
                                Active = aa.Active,
                                PO = aa.Po
                            }).ToList();
            

            if (filterType == "" || filterType == "AllActiveAssets" || filterType == "undefined"|| filterType is null)
            {
                foreach (var asset in allAssetInfoAssignments.Where(i => i.Active))
                {
                    //If there are assignments for the active assets, join it with the Assignment Information, including owner
                    var relatedAssignments = _db.Assignments.Where(i => i.AssetId == asset.AssetId).OrderByDescending(i=>i.CheckedOut).ThenByDescending(i=>i.DateReturned).ToList();
                    if(relatedAssignments.Count() > 0)
                    {
                        //Find the assignment with the given asset that is checked out
                        var assignment = relatedAssignments.Where(i => i.CheckedOut == true).FirstOrDefault();
                        if(assignment == null)
                        {
                            assignment = relatedAssignments.OrderByDescending(i => i.CheckedOut).ThenByDescending(i => i.DateReturned).FirstOrDefault();
                        }


                        if (assignment != null)
                        {
                            var assignmentOwner = AllOwnersAndLocations.Where(i => i.OwnerId == assignment.OwnerId).FirstOrDefault();
                            //If the owner doesn't exist, set it to HelpDesk Storage
                            if (assignmentOwner == null)
                            {
                                assignmentOwner = AllOwnersAndLocations.Where(i => i.OwnerId == "893").FirstOrDefault();
                            }
                            allAssetAssignments.Add(new ShortAssetAssignmentInfo
                            {
                                AssetInfo = asset,
                                AssignmentInfo = new ShortAssignmentInfo
                                {
                                    AssignmentId = assignment.Id,
                                    CheckedOut = assignment.CheckedOut,
                                    DateDeployed = assignment.DateDeployed.ToString("MM/dd/yyyy"),
                                    DateReturned = assignment.DateReturned.ToString("MM/dd/yyyy"),
                                    DeviceName = assignment.DeviceName,
                                    LocationId = assignment.LocationId,
                                    RecoveryKey = assignment.Bitlocker
                                },
                                OwnerInfo = assignmentOwner
                            });
                        }
                        //If there are no assignments checked out, find the one with the most recent returned Date
                        else
                        {
                            allAssetAssignments.Add(new ShortAssetAssignmentInfo {
                                AssetInfo = asset,
                                AssignmentInfo = new ShortAssignmentInfo
                                {
                                    AssignmentId = 0,
                                    CheckedOut = false,
                                    DateDeployed = DateTime.Now.ToString("MM/dd/yyyy"),
                                    DateReturned = DateTime.Now.ToString("MM/dd/yyyy"),
                                    DeviceName = "No Assignments Found",
                                    LocationId = 1
                                },
                                OwnerInfo = AllOwnersAndLocations.Where(i=>i.OwnerId == "893").FirstOrDefault()
                            });
                        }
                    }
                    //If there isn't an assignment for the given asset, combine it with Not Assigned, or To Be Deployed
                    else
                    {
                        //Get To Be Deployed Assignment
                        var toBeDeployedOwner = _db.Owners.Where(i => i.Id == 1406).FirstOrDefault();

                        allAssetAssignments.Add(new ShortAssetAssignmentInfo
                        {
                            AssetInfo = asset,
                            AssignmentInfo = new ShortAssignmentInfo
                            {
                                AssignmentId = 0,
                                CheckedOut = false,
                                DateDeployed = DateTime.Now.ToString("MM/dd/yyyy"),
                                DateReturned = DateTime.Now.ToString("MM/dd/yyyy"),
                                DeviceName = "No Assignments Found",
                                LocationId = 1
                            },
                            OwnerInfo = new OwnerDetails
                            {
                                OwnerId = toBeDeployedOwner.Id.ToString(),
                                OwnerName = toBeDeployedOwner.OwnerName,
                                OwnerStatus = toBeDeployedOwner.OwnerStatus,
                                DepartmentId = toBeDeployedOwner.DepartmentId,
                                DepartmentName = "To Be Deployed",
                                UserName = "To Be Deployed"
                            }
                        });
                    }
                }
            }
            else if(filterType == "CheckedIn")
            {
                foreach (var asset in allAssetInfoAssignments.Where(i => i.Active))
                {
                    //If there are assignments for the active assets, join it with the Assignment Information, including owner
                    var relatedAssignments = _db.Assignments.Where(i => i.AssetId == asset.AssetId).OrderByDescending(i => i.CheckedOut).ThenByDescending(i => i.DateReturned).ToList();
                    if (relatedAssignments.Count() > 0)
                    {
                        //Find the assignment with the given asset that is checked out
                        //Check if there is an existing checked out assignment. If there is, skip this line. 
                        var assignment = relatedAssignments.Where(i => i.CheckedOut == true).FirstOrDefault();
                        //If there the assignment where checkedout equals false, Create an object for it
                        if (assignment == null)
                        {
                            assignment = relatedAssignments.OrderByDescending(i => i.CheckedOut).ThenByDescending(i => i.DateReturned).FirstOrDefault();

                            var assignmentOwner = AllOwnersAndLocations.Where(i => i.OwnerId == assignment.OwnerId).FirstOrDefault();
                            //If the owner doesn't exist, set it to HelpDesk Storage
                            if (assignmentOwner == null)
                            {
                                assignmentOwner = AllOwnersAndLocations.Where(i => i.OwnerId == "893").FirstOrDefault();
                            }
                            allAssetAssignments.Add(new ShortAssetAssignmentInfo
                            {
                                AssetInfo = asset,
                                AssignmentInfo = new ShortAssignmentInfo
                                {
                                    AssignmentId = assignment.Id,
                                    CheckedOut = assignment.CheckedOut,
                                    DateDeployed = assignment.DateDeployed.ToString("MM/dd/yyyy"),
                                    DateReturned = assignment.DateReturned.ToString("MM/dd/yyyy"),
                                    DeviceName = assignment.DeviceName,
                                    LocationId = assignment.LocationId,
                                    RecoveryKey = assignment.Bitlocker
                                },
                                OwnerInfo = assignmentOwner
                            });

                        }
                        //If there is a checked out assignment, do nothing
                        else
                        {
                            //If the checked out assignment is to HelpDesk Storage, show it
                            if(assignment.OwnerId == "893")
                            {
                                var assignmentOwner = AllOwnersAndLocations.Where(i => i.OwnerId == "893").FirstOrDefault();
                                allAssetAssignments.Add(new ShortAssetAssignmentInfo
                                {
                                    AssetInfo = asset,
                                    AssignmentInfo = new ShortAssignmentInfo
                                    {
                                        AssignmentId = assignment.Id,
                                        CheckedOut = assignment.CheckedOut,
                                        DateDeployed = assignment.DateDeployed.ToString("MM/dd/yyyy"),
                                        DateReturned = assignment.DateReturned.ToString("MM/dd/yyyy"),
                                        DeviceName = assignment.DeviceName,
                                        LocationId = assignment.LocationId,
                                        RecoveryKey = assignment.Bitlocker
                                    },
                                    OwnerInfo = assignmentOwner
                                });
                            }
                            //If not, Do nothing
                            else
                            {

                            }
                        }
                    }
                    //If there isn't an assignment for the given asset, combine it with Not Assigned, or To Be Deployed
                    else
                    {
                        //Get To Be Deployed Assignment
                        var helpDeskOwner = _db.Owners.Where(i => i.Id == 893).FirstOrDefault();

                        allAssetAssignments.Add(new ShortAssetAssignmentInfo
                        {
                            AssetInfo = asset,
                            AssignmentInfo = new ShortAssignmentInfo
                            {
                                AssignmentId = 0,
                                CheckedOut = false,
                                DateDeployed = DateTime.Now.ToString("MM/dd/yyyy"),
                                DateReturned = DateTime.Now.ToString("MM/dd/yyyy"),
                                DeviceName = "No Assignments Found",
                                LocationId = 1
                            },
                            OwnerInfo = new OwnerDetails
                            {
                                OwnerId = helpDeskOwner.Id.ToString(),
                                OwnerName = helpDeskOwner.OwnerName,
                                OwnerStatus = helpDeskOwner.OwnerStatus,
                                DepartmentId = helpDeskOwner.DepartmentId,
                                DepartmentName = "144(IT-HelpDesk)",
                                UserName = "Returned"
                            }
                        });
                    }
                }




                //allAssetAssignments = (from aa in _db.Assets.Where(i => i.Active)
                //                           join m in _db.AssetModels on aa.ModelId equals m.Id
                //                           join b in _db.AssetBrands on m.BrandId equals b.Id
                //                           join t in _db.AssetTypes on m.TypeId equals t.Id
                //                           join a in _db.Assignments.Where(i=>i.CheckedOut == false) on aa.Id equals a.AssetId
                //                           join o in _db.Owners on a.OwnerId equals o.Id.ToString()
                //                           join d in _db.Departments on o.DepartmentId equals d.Id
                //                           where aa.Active
                //                           orderby aa.Id
                //                           orderby a.CheckedOut descending
                //                           orderby a.DateDeployed
                //                           select new ShortAssetAssignmentInfo
                //                           {
                //                               AssetInfo = new ShortAssetInfo
                //                               {
                //                                   AssetId = (int)a.AssetId,
                //                                   TypeId = t.Id,
                //                                   Type = t.TypeName,
                //                                   BrandId = b.Id,
                //                                   Brand = b.BrandName,
                //                                   AssetModelId = m.Id,
                //                                   AssetModel = m.AssetModelName,
                //                                   Bios = aa.BiosVersion,
                //                                   OS = aa.OsVersion
                //                               },
                //                               AssignmentInfo = new ShortAssignmentInfo
                //                               {
                //                                   AssignmentId = a.Id,
                //                                   DeviceName = a.DeviceName,
                //                                   DateDeployed = a.DateDeployed.ToString("MM/dd/yyyy"),
                //                                   LocationId = a.LocationId
                //                               },
                //                               OwnerInfo = new OwnerDetails
                //                               {
                //                                   OwnerId = o.Id.ToString(),
                //                                   OwnerName = o.OwnerName,
                //                                   UserName = o.UserName,
                //                                   DepartmentId = o.DepartmentId,
                //                                   DepartmentName = d.DepartmentName,
                //                               }
                //                           }
                //                 ).ToList();
            }
            else if (filterType == "CheckedOut")
            {
                foreach (var asset in allAssetInfoAssignments.Where(i => i.Active))
                {
                    //If there are assignments for the active assets, join it with the Assignment Information, including owner
                    var relatedAssignments = _db.Assignments.Where(i => i.AssetId == asset.AssetId).OrderByDescending(i => i.CheckedOut).ThenByDescending(i => i.DateReturned).ToList();
                    if (relatedAssignments.Count() > 0)
                    {
                        //Find the assignment with the given asset that is checked out
                        var assignment = relatedAssignments.Where(i => i.CheckedOut == true).FirstOrDefault();
                        
                        if (assignment != null)
                        {
                            var assignmentOwner = AllOwnersAndLocations.Where(i => i.OwnerId == assignment.OwnerId).FirstOrDefault();
                            //If the owner doesn't exist, set it to HelpDesk Storage
                            if (assignmentOwner == null)
                            {
                                assignmentOwner = AllOwnersAndLocations.Where(i => i.OwnerId == "893").FirstOrDefault();
                            }
                            allAssetAssignments.Add(new ShortAssetAssignmentInfo
                            {
                                AssetInfo = asset,
                                AssignmentInfo = new ShortAssignmentInfo
                                {
                                    AssignmentId = assignment.Id,
                                    CheckedOut = assignment.CheckedOut,
                                    DateDeployed = assignment.DateDeployed.ToString("MM/dd/yyyy"),
                                    DateReturned = assignment.DateReturned.ToString("MM/dd/yyyy"),
                                    DeviceName = assignment.DeviceName,
                                    LocationId = assignment.LocationId,
                                    RecoveryKey = assignment.Bitlocker
                                },
                                OwnerInfo = assignmentOwner
                            });
                        }
                        //If there are no assignments checked out do nothing
                        else
                        {
                            
                        }
                    }
                    //If there isn't an assignment for the given asset Assume it is checked in, and do nothing. It will show up in checked in assignments
                    else
                    {
                        
                    }
                }
            }
            else if(filterType == "AllAssets")
            {
                foreach (var asset in allAssetInfoAssignments)
                {
                    //If there are assignments for the active assets, join it with the Assignment Information, including owner
                    var relatedAssignments = _db.Assignments.Where(i => i.AssetId == asset.AssetId).OrderByDescending(i => i.CheckedOut).ThenByDescending(i => i.DateReturned).ToList();
                    if (relatedAssignments.Count() > 0)
                    {
                        //Find the assignment with the given asset that is checked out
                        var assignment = relatedAssignments.Where(i => i.CheckedOut == true).FirstOrDefault();
                        if (assignment == null)
                        {
                            assignment = relatedAssignments.OrderByDescending(i => i.CheckedOut).ThenByDescending(i => i.DateReturned).FirstOrDefault();
                        }


                        if (assignment != null)
                        {
                            var assignmentOwner = AllOwnersAndLocations.Where(i => i.OwnerId == assignment.OwnerId).FirstOrDefault();
                            //If the owner doesn't exist, set it to HelpDesk Storage
                            if (assignmentOwner == null)
                            {
                                assignmentOwner = AllOwnersAndLocations.Where(i => i.OwnerId == "893").FirstOrDefault();
                            }
                            allAssetAssignments.Add(new ShortAssetAssignmentInfo
                            {
                                AssetInfo = asset,
                                AssignmentInfo = new ShortAssignmentInfo
                                {
                                    AssignmentId = assignment.Id,
                                    CheckedOut = assignment.CheckedOut,
                                    DateDeployed = assignment.DateDeployed.ToString("MM/dd/yyyy"),
                                    DateReturned = assignment.DateReturned.ToString("MM/dd/yyyy"),
                                    DeviceName = assignment.DeviceName,
                                    LocationId = assignment.LocationId,
                                    RecoveryKey = assignment.Bitlocker
                                },
                                OwnerInfo = assignmentOwner
                            });
                        }
                        //If there are no assignments checked out, find the one with the most recent returned Date
                        else
                        {
                            allAssetAssignments.Add(new ShortAssetAssignmentInfo
                            {
                                AssetInfo = asset,
                                AssignmentInfo = new ShortAssignmentInfo
                                {
                                    AssignmentId = 0,
                                    CheckedOut = false,
                                    DateDeployed = DateTime.Now.ToString("MM/dd/yyyy"),
                                    DateReturned = DateTime.Now.ToString("MM/dd/yyyy"),
                                    DeviceName = "No Assignments Found",
                                    LocationId = 1
                                },
                                OwnerInfo = AllOwnersAndLocations.Where(i => i.OwnerId == "893").FirstOrDefault()
                            });
                        }
                    }
                    //If there isn't an assignment for the given asset, combine it with Not Assigned, or To Be Deployed
                    else
                    {
                        //Get To Be Deployed Assignment
                        var toBeDeployedOwner = _db.Owners.Where(i => i.Id == 1406).FirstOrDefault();

                        allAssetAssignments.Add(new ShortAssetAssignmentInfo
                        {
                            AssetInfo = asset,
                            AssignmentInfo = new ShortAssignmentInfo
                            {
                                AssignmentId = 0,
                                CheckedOut = false,
                                DateDeployed = DateTime.Now.ToString("MM/dd/yyyy"),
                                DateReturned = DateTime.Now.ToString("MM/dd/yyyy"),
                                DeviceName = "No Assignments Found",
                                LocationId = 1
                            },
                            OwnerInfo = new OwnerDetails
                            {
                                OwnerId = toBeDeployedOwner.Id.ToString(),
                                OwnerName = toBeDeployedOwner.OwnerName,
                                OwnerStatus = toBeDeployedOwner.OwnerStatus,
                                DepartmentId = toBeDeployedOwner.DepartmentId,
                                DepartmentName = "To Be Deployed",
                                UserName = "To Be Deployed"
                            }
                        });
                    }
                }
            }
            var allSelectedAssets = allAssetAssignments.GroupBy(i => i.AssetInfo.AssetId).Select(i => i.FirstOrDefault()).OrderBy(i=>i.AssetInfo.AssetId).ToList();
            return allSelectedAssets;
        }

        //Get All Asset Tags
        [HttpGet]
        public List<ShortAssetAssignmentInfo> GetAllAssets([FromUri] bool getAllDisposedAssets)
        {
            List<ShortAssetAssignmentInfo> allAssetAssignments = new List<ShortAssetAssignmentInfo>();

            var AllOwnersAndLocations = GetOwners(true);
            //Get all the asset info from all assets
            var allAssetInfoAssignments = (from aa in _db.Assets
                                           join m in _db.AssetModels on aa.ModelId equals m.Id
                                           join b in _db.AssetBrands on m.BrandId equals b.Id
                                           join t in _db.AssetTypes on m.TypeId equals t.Id
                                           select new ShortAssetInfo
                                           {
                                               AssetId = aa.Id,
                                               AssetModelId = aa.ModelId,
                                               AssetModel = m.AssetModelName,
                                               Bios = aa.BiosVersion,
                                               BrandId = b.Id,
                                               Brand = b.BrandName,
                                               OS = aa.OsVersion,
                                               TypeId = t.Id,
                                               Type = t.TypeName,
                                               Active = aa.Active,
                                               PO = aa.Po
                                           }).ToList();


            foreach (var asset in allAssetInfoAssignments.Where(i => i.Active == false))
            {
                //If there are assignments for the active assets, join it with the Assignment Information, including owner
                var relatedAssignments = _db.Assignments.Where(i => i.AssetId == asset.AssetId).OrderByDescending(i => i.CheckedOut).ThenByDescending(i => i.DateReturned).ToList();
                if (relatedAssignments.Count() > 0)
                {
                    //Find the assignment with the given asset that is checked out
                    var assignment = relatedAssignments.Where(i => i.CheckedOut == true).FirstOrDefault();
                    if (assignment == null)
                    {
                        assignment = relatedAssignments.OrderByDescending(i => i.CheckedOut).ThenByDescending(i => i.DateReturned).FirstOrDefault();
                    }


                        if (assignment != null)
                        {
                            var assignmentOwner = AllOwnersAndLocations.Where(i => i.OwnerId == assignment.OwnerId).FirstOrDefault();
                            //If the owner doesn't exist, set it to HelpDesk Storage
                            if (assignmentOwner == null)
                            {
                                assignmentOwner = AllOwnersAndLocations.Where(i => i.OwnerId == "893").FirstOrDefault();
                            }
                            allAssetAssignments.Add(new ShortAssetAssignmentInfo
                            {
                                AssetInfo = asset,
                                AssignmentInfo = new ShortAssignmentInfo
                                {
                                    AssignmentId = assignment.Id,
                                    CheckedOut = assignment.CheckedOut,
                                    DateDeployed = assignment.DateDeployed.ToString("MM/dd/yyyy"),
                                    DateReturned = assignment.DateReturned.ToString("MM/dd/yyyy"),
                                    DeviceName = assignment.DeviceName,
                                    LocationId = assignment.LocationId,
                                    RecoveryKey = assignment.Bitlocker
                                },
                                OwnerInfo = assignmentOwner
                            });
                        }
                        //If there are no assignments checked out, find the one with the most recent returned Date
                        else
                        {
                            allAssetAssignments.Add(new ShortAssetAssignmentInfo
                            {
                                AssetInfo = asset,
                                AssignmentInfo = new ShortAssignmentInfo
                                {
                                    AssignmentId = 0,
                                    CheckedOut = false,
                                    DateDeployed = DateTime.Now.ToString("MM/dd/yyyy"),
                                    DateReturned = DateTime.Now.ToString("MM/dd/yyyy"),
                                    DeviceName = "No Assignments Found",
                                    LocationId = 1
                                },
                                OwnerInfo = AllOwnersAndLocations.Where(i => i.OwnerId == "893").FirstOrDefault()
                            });
                        }
                    }
                    //If there isn't an assignment for the given asset, combine it with Not Assigned, or To Be Deployed
                    else
                    {
                        //Get To Be Deployed Assignment
                        var toBeDeployedOwner = _db.Owners.Where(i => i.Id == 1406).FirstOrDefault();

                        allAssetAssignments.Add(new ShortAssetAssignmentInfo
                        {
                            AssetInfo = asset,
                            AssignmentInfo = new ShortAssignmentInfo
                            {
                                AssignmentId = 0,
                                CheckedOut = false,
                                DateDeployed = DateTime.Now.ToString("MM/dd/yyyy"),
                                DateReturned = DateTime.Now.ToString("MM/dd/yyyy"),
                                DeviceName = "No Assignments Found",
                                LocationId = 1
                            },
                            OwnerInfo = new OwnerDetails
                            {
                                OwnerId = toBeDeployedOwner.Id.ToString(),
                                OwnerName = toBeDeployedOwner.OwnerName,
                                OwnerStatus = toBeDeployedOwner.OwnerStatus,
                                DepartmentId = toBeDeployedOwner.DepartmentId,
                                DepartmentName = "To Be Deployed",
                                UserName = "To Be Deployed"
                            }
                        });
                    }
                }

            var allSelectedAssets = allAssetAssignments.GroupBy(i => i.AssetInfo.AssetId).Select(i => i.FirstOrDefault()).OrderBy(i => i.AssetInfo.AssetId).ToList();
            return allSelectedAssets;
        }
    }






    //Class to create an asset Model object to be able to return
    public class AssetModelDetails
    {
        public int Id { get; set; }
        public string BrandName { get; set; }
        public int BrandId { get; set; }
        public string TypeName { get; set; }
        public int TypeId { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }

    public class ShortAssetInfo
    {
        public int AssetId { get; set; }
        public int TypeId { get; set; }
        public string Type { get; set; }
        public int BrandId { get; set; }
        public string Brand { get; set; }
        public int AssetModelId { get; set; }
        public string AssetModel { get; set; }
        public string Bios { get; set; }
        public string OS { get; set; }
        public string PO { get; set; }
        public bool Active { get; set; }
    }

    public class FullAssetInfo : ShortAssetInfo
    {
        public DateTime ActiveDate { get; set; }
        public string TypeName { get; set; }
        public string BrandName { get; set; }
        public string Serial { get; set; }
        public string CPU { get; set; }
        public string Ram { get; set; }
        public string MACAddress { get; set; }
        public string Notes { get; set; }
        public string IPAddress { get; set; }
        public string InkModel { get; set; }
        public string PrinterServiceId { get; set; }
        public DateTime DateDisposed { get; set; }
        public string DisposedReason { get; set; }
    }
   


    //Class to create front Table for Assets
    public class ShortAssetAssignmentInfo
    {
        public ShortAssetInfo AssetInfo { get; set; }

        public ShortAssignmentInfo AssignmentInfo { get; set; }

        public OwnerDetails OwnerInfo { get; set; }

    }

    public class ShortAssignmentInfo
    {
        public int AssignmentId { get; set; }
        public string DeviceName { get; set; }
        public int LocationId { get; set; }
        public bool CheckedOut { get; set; }
        public string DateDeployed { get; set; }
        public string DateReturned { get; set; }
        public string RecoveryKey { get; set; }
    }

    //Class to fill the update form
    public class DetailedAssignmentAssetInfo
    {
        public FullAssetInfo AssetInfo { get; set; }

        public ShortAssignmentInfo AssignmentInfo { get; set; }

        public OwnerDetails OwnerInfo { get; set; }
    }

    // Class to fill Owner Details
    public class OwnerDetails
    {
        public string OwnerId { get; set; }
        public string OwnerName { get; set; }
        public bool OwnerStatus { get; set; }
        public string UserName { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
    }

    /// <summary>
    /// Class to fill one line of the asset
    /// </summary>
    public class AssetHistoryLine
    {
        public string OwnerName { get; set; }
        public string UserName { get; set; }
        public string DepartmentName { get; set; }
        public string DateDeployed { get; set; }
        public string DateReturned { get; set; }
    }
}
