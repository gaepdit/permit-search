<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="permit.aspx.vb" Inherits="permitsearch.gaepd.org.permit" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>GA Air - Permits</title>
    <script type="text/javascript">
      !function(a,b,c,d,e,f,g,h){a.RaygunObject=e,a[e]=a[e]||function(){
      (a[e].o=a[e].o||[]).push(arguments)},f=b.createElement(c),g=b.getElementsByTagName(c)[0],
      f.async=1,f.src=d,g.parentNode.insertBefore(f,g),h=a.onerror,a.onerror=function(b,c,d,f,g){
      h&&h(b,c,d,f,g),g||(g=new Error(b)),a[e].q=a[e].q||[],a[e].q.push({
      e:g})}}(window,document,"script","//cdn.raygun.io/raygun4js/raygun.min.js","rg4js");
    </script>
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
    <script type="text/javascript">
        rg4js('apiKey', '<%= RaygunApiKey %>');
        rg4js('enableCrashReporting', true);
        rg4js('enablePulse', true);
    </script>
</body>
</html>
