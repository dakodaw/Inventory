//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Inventory.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Asset
    {
        public int Id { get; set; }
        public bool Active { get; set; }
        public System.DateTime DateInService { get; set; }
        public Nullable<System.DateTime> DateDisposed { get; set; }
        public string DisposedReason { get; set; }
        public int ModelId { get; set; }
        public string Po { get; set; }
        public string Serial { get; set; }
        public string Cpu { get; set; }
        public string Ram { get; set; }
        public string MacAddress { get; set; }
        public string BiosVersion { get; set; }
        public string OsVersion { get; set; }
        public string Ink { get; set; }
        public string ServiceCompanyId { get; set; }
        public string IpAddress { get; set; }
        public string AdditionalNotes { get; set; }
    }
}
