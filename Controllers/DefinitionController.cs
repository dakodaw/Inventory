using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net.Http;
using System.Web.Http;
using Inventory.Models;
using HttpGetAttribute = System.Web.Http.HttpGetAttribute;
using HttpPostAttribute = System.Web.Http.HttpPostAttribute;

namespace Inventory.Controllers
{
    public class DefinitionController : ApiController
    {
        PeopleEntities1 _db = new PeopleEntities1();

        [System.Web.Http.HttpGet]
        public List<ComputerBrand> GetComputerBrands(bool getBrands)
        {
            return _db.ComputerBrands.Where(i => i.IsActive).ToList();
        }

        [HttpGet]
        public ComputerBrand AddUpdateComputerBrands([FromUri] bool addUpdateBrand, [FromUri] ComputerBrand computerBrand)
        {
            ComputerBrand brand = _db.ComputerBrands.FirstOrDefault(i => i.Id == computerBrand.Id || i.Name == computerBrand.Name.Trim());
            if (brand == null)
            {
                brand = new ComputerBrand
                {
                    Id = 0
                };
            }

            brand.Name = computerBrand.Name.Trim();
            brand.IsActive = computerBrand.IsActive;

            if (brand.Id == 0)
                _db.ComputerBrands.Add(brand);
            _db.SaveChanges();
            return brand;
        }

        [HttpGet]
        public List<AssetType> GetAssetTypes(bool getTypes)
        {
            return _db.AssetTypes.Where(i => i.IsActive).ToList();
        }

        [HttpPost]
        public AssetType AddUpdateAssetType([FromUri] bool addUpdateType, [FromBody] AssetType assetType)
        {
            AssetType newType = _db.AssetTypes.FirstOrDefault(i => i.Id == assetType.Id || i.Name == assetType.Name.Trim());
            if (newType == null)
            {
                newType = new AssetType
                {
                    Id = 0
                };
            }

            newType.Name = assetType.Name.Trim();
            newType.IsActive = assetType.IsActive;

            if (newType.Id == 0)
                _db.AssetTypes.Add(newType);
            _db.SaveChanges();
            return newType;
        }

        [HttpGet]
        public List<ReturnComputerModel> GetComputerModels()
        {
            var computerModels = (from cm in _db.ComputerModels.Where(i => i.IsActive)
                                    join b in _db.ComputerBrands on cm.BrandId equals b.Id
                                    join t in _db.AssetTypes on cm.TypeId equals t.Id
                                    select new ReturnComputerModel { BrandId = b.Id, Id = cm.Id, BrandName = b.Name, Name = cm.Name, IsActive = cm.IsActive, TypeId = t.Id, TypeName = t.Name }).ToList();
            return computerModels;
        }

        [HttpGet]
        public ComputerModel AddUpdateComputerModel([FromUri] bool addUpdateModel, [FromUri] ComputerModel computerModel)
        {
            ComputerModel newModel = _db.ComputerModels.FirstOrDefault(i => i.Id == computerModel.Id || i.Name == computerModel.Name.Trim());
            if (newModel == null)
            {
                newModel = new ComputerModel
                {
                    Id = 0
                };
            }
            newModel.Name = computerModel.Name.Trim();
            newModel.BrandId = computerModel.BrandId;
            newModel.TypeId = computerModel.TypeId;
            newModel.IsActive = computerModel.IsActive;

            if (newModel.Id == 0)
                _db.ComputerModels.Add(newModel);
            _db.SaveChanges();
            return newModel;
        }
    }

    public class ReturnComputerModel
    {
        public int Id { get; set; }
        public string BrandName { get; set; }
        public int BrandId { get; set; }
        public string TypeName { get; set; }
        public int TypeId { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }
}
