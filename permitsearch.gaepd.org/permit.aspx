<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="permit.aspx.vb" Inherits="permitsearch.gaepd.org.permit" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>GA Air - Permits</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    <asp:Label id="lblFileName" runat="server" Visible="false"></asp:Label>
    <asp:Panel ID="NoPermit" runat="server" Visible="false">
    <h4>Permit File currently not in database</h4>    
    <br />
    <asp:LinkButton ID="lbtReturn" runat="server" Text="Return to Permit Search Engine"></asp:LinkButton>
    </asp:Panel>
    </div>
    </form>
</body>
</html>
