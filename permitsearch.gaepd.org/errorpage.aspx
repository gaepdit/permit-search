<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="errorpage.aspx.vb" Inherits="permitsearch.gaepd.org.errorpage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Permit Search - Error</title>
   <link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
    <!--[if lt IE 7]>
		<div style=' clear: both; text-align:center; position: relative;'>
		<a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie/home?ocid=ie6_countdown_bannercode">
		<img src="http://storage.ie6countdown.com/assets/100/images/banners/warning_bar_0000_us.jpg" border="0" height="42" width="820" alt="You are using an outdated browser. For a faster, safer browsing experience, upgrade for free today." />
		</a>
		</div>
		<![endif]-->
    <!--[if lt IE 9]>
		<script type="text/javascript" src="js/html5.js"></script>
		<link rel="stylesheet" href="css/ie.css" type="text/css" media="screen">
		<![endif]-->
    <telerik:RadStyleSheetManager ID="RadStyleSheetManager1" runat="server" />
</head>

<body style="font-family: Arial, Verdana, Times New Roman">
    <form id="form2" runat="server">
    <div id="header">
        <div id="epdlogo">
            <img src="Images/epd_logo.jpg" alt="GA EPD logo" />
        </div>
        <div id="apptitle">
            <img src="Images/airbranch_header.jpg" alt="GA AIR" />
        </div>
    </div>
   <div class="maincontent">
   <p><font face="Arial" color="#cc0000" size="4">The page you are requesting is either 
										currently unavailable or we are experiencing problems with the server. Please 
										try again later.</font></p>
								<p><font face="Arial" color="#cc0000" size="4">If the problem persists, please contact 
										the Data Management Unit at the Air Protection Branch at 404-363-7000.</font></P>
    </div>
   <div class="footer">
        <table style="width: 99%;">
            <tr>
                <td style="width: 33%; text-align: center;  font-size:smaller">
                    <a href="https://epd.georgia.gov/air/" target="_blank" style="color: #92501a">
                        Air Protection Branch Website</a>
                </td>
                <td style="width: 33%; text-align: center;  font-size:smaller">
                    <a href="https://gatv.gaepd.org" target="_blank"
                        style="color: #92501a">Title V Applications Archive</a>
                </td>
            </tr>
        </table>
        <div class="footer">
            ©2006 • Georgia Environmental Protection Division, Air Protection Branch • All rights
            reservedection Branch • All rights reserved</div>
        <!-- end footer -->
    </div>
    </form>
</body>

</html>
