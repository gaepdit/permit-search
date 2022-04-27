<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="permit.aspx.vb" Inherits="permitsearch.gaepd.org.permit" %>
<!DOCTYPE html>
<html lang="en-us">
<head>
    <title>Georgia Air Permit Not Found</title>
    <script>
      !function(a,b,c,d,e,f,g,h){a.RaygunObject=e,a[e]=a[e]||function(){
      (a[e].o=a[e].o||[]).push(arguments)},f=b.createElement(c),g=b.getElementsByTagName(c)[0],
      f.async=1,f.src=d,g.parentNode.insertBefore(f,g),h=a.onerror,a.onerror=function(b,c,d,f,g){
      h&&h(b,c,d,f,g),g||(g=new Error(b)),a[e].q=a[e].q||[],a[e].q.push({
      e:g})}}(window,document,"script","//cdn.raygun.io/raygun4js/raygun.min.js","rg4js");
    </script>
</head>
<body>
    <h1>Permit file not found.</h1>    
    <script>
        rg4js('apiKey', '<%= RaygunApiKey %>');
        rg4js('enableCrashReporting', true);
        rg4js('enablePulse', true);
        rg4js('options', { ignore3rdPartyErrors: true });
    </script>
</body>
</html>
