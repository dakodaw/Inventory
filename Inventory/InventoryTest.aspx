<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="InventoryTest.aspx.cs" Inherits="Inventory.InventoryTest" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
        </div>
        <asp:DropDownList ID="DropDownList1" runat="server" OnSelectedIndexChanged="DropDownList1_SelectedIndexChanged">
            <asp:ListItem>Hello</asp:ListItem>
            <asp:ListItem>GoodBye</asp:ListItem>
        </asp:DropDownList>
    </form>
</body>
</html>
