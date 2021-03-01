<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="clearcache.aspx.vb" Inherits="permitsearch.gaepd.org.clearcache" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Clear Permit Search Engine Cache</title>
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
        <asp:LinkButton ID="lbtClearCache" runat="server">Clear Permit Search Engine Cache</asp:LinkButton>
    </div>
    </form>
    <script type="text/javascript">
        rg4js('apiKey', '<%= RaygunApiKey %>');
        rg4js('enableCrashReporting', true);
        rg4js('enablePulse', true);
        rg4js('options', { ignore3rdPartyErrors: true });
    </script>
</body>
</html>
