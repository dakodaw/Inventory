using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Inventory
{
    public partial class InventoryTest : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            DropDownList1.Text = "Hello";
        }

        protected void DropDownList1_SelectedIndexChanged(object sender, EventArgs e)
        {
            
        }
    }
}