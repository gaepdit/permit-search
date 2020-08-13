<%@ Page Language="VB" MasterPageFile="~/MasterPage.Master" AutoEventWireup="false" CodeBehind="Default.aspx.vb" Inherits="permitsearch.gaepd.org._Default" %>
<%@ Register TagPrefix="telerik" Namespace="Telerik.Web.UI" Assembly="Telerik.Web.UI" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">      
    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />   
    <telerik:RadStyleSheetManager ID="RadStyleSheetManager1" runat="server" />
    <script type="text/javascript">
     function OnClientEntryAdded(sender, args) 
     {
       sender.get_inputElement().disabled = true;
     }
    </script>
    <style>

legend {color:black;
        font:bold;
        font-weight:bold; 
} /* this is the GroupingText color */
</style>
    </asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder2" runat="server">
 <%--   <form id="form1" runat="server">--%>
         <telerik:RadScriptManager ID="RadScriptManager1" runat="server">
            <Scripts>
                <asp:ScriptReference Assembly="Telerik.Web.UI" Name="Telerik.Web.UI.Common.Core.js" />
                <asp:ScriptReference Assembly="Telerik.Web.UI" Name="Telerik.Web.UI.Common.jQuery.js" />
                <asp:ScriptReference Assembly="Telerik.Web.UI" Name="Telerik.Web.UI.Common.jQueryInclude.js" />
            </Scripts>
        </telerik:RadScriptManager>

        <telerik:RadAjaxManager ID="RadAjaxManager1" runat="server">
        </telerik:RadAjaxManager>
    <%--<div id="header">
        <div id="epdlogo">
            <img src="Images/epd_logo.jpg" alt="GA EPD logo" />
        </div>
        <div id="apptitle">
            <img src="Images/airbranch_header.jpg" alt="GA AIR" />
        </div>
    </div>--%>
    <div class="maincontent" style="width: 97%; margin-bottom:15px; height:100%">
        <telerik:RadAjaxLoadingPanel ID="LoadingPanel1" runat="Server" Transparency="30"
            EnableSkinTransparency="false" BackColor="#E0E0E0">
        </telerik:RadAjaxLoadingPanel>
        <telerik:RadAjaxPanel ID="AjaxPanel1" runat="server" LoadingPanelID="LoadingPanel1">
            <asp:Panel ID="pnlSearch" runat="server" >
                <div class="div1" style="height:60px; line-height:60px; text-align:center; color:white; background-color:#203119">
                <h3 align="center">                 
                   Georgia Air Permit Search Engine</h3>
                     </div>
                <hr/>
                <br />
                <table style="width: 97%;">
                    <tr>
                        <td>
                            AIRS Number:                      
                                                   
                            <telerik:RadAutoCompleteBox RenderMode="Lightweight" ID="txtAirsNo" runat="server" Width="200px" DropDownWidth="200px" DropDownHeight="250px" 
                                DataSourceID="SqlDataSource1" DataTextField="strairsnumber" EmptyMessage="Select a AIRS Number" Filter="StartsWith"
                                AllowCustomEntry="False" InputType="Token" OnEntryAdded="RadAutoCompleteBox1_EntryAdded" 
                                OnTextChanged="RadAutoCompleteBox1_TextChanged" OnEntryRemoved="RadAutoCompleteBox1_EntryRemoved"
                                OnClientEntryAdded="OnClientEntryAdded">
                            </telerik:RadAutoCompleteBox>
                        </td>
                        <td>
                            Facility Name:
                        
                            <telerik:RadAutoCompleteBox RenderMode="Lightweight" ID="txtFacility" runat="server" Width="320px" DropDownWidth="350px" DropDownHeight="300px" 
                                DataSourceID="SqlDataSource1" DataTextField="facilityname" EmptyMessage="Select a Facility" Filter="StartsWith"
                                AllowCustomEntry="False" InputType="Token" OnEntryAdded="RadAutoCompleteBox1_EntryAdded" 
                                OnTextChanged="RadAutoCompleteBox1_TextChanged" OnEntryRemoved="RadAutoCompleteBox1_EntryRemoved"
                                OnClientEntryAdded="OnClientEntryAdded">
                            </telerik:RadAutoCompleteBox>
                        </td>
                        
                        <td>
                            Permit Number/SIC Code:
                        
                            <telerik:RadTextBox ID="txtSIC" runat="server" Width="200px"></telerik:RadTextBox>
                        </td>
                    </tr>
                </table>
                  <br />
                         
                &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; Permit Types:
                <asp:RadioButtonList ID="rblPermitType" runat="server" RepeatDirection="Horizontal"
                    RepeatLayout="Flow">
                    <asp:ListItem style="margin-left: 12px;" Text="All" Value="All" Selected="True" />
                    <asp:ListItem style="margin-left: 12px;" Text="Title V" Value="Title V" />
                    <asp:ListItem style="margin-left: 12px;" Text="SIP" Value="SIP" />
                    <asp:ListItem style="margin-left: 12px;" Text="PSD/NSR" Value="PSD" />
                </asp:RadioButtonList>               
                &nbsp; &nbsp;<telerik:RadButton runat="server" ID="btnSearch" Text="Search Permits" BorderStyle="Solid" ForeColor="#925001" Font-Bold="true" />
                &nbsp; &nbsp;<telerik:RadButton runat="server" ID="btnClear" Text="Clear Search" BorderStyle="Solid" ForeColor="#925001" Font-Bold="true" />
                <br />
            <br />
            
            </asp:Panel>
            <asp:Panel ID="pnlHelp" runat="server" CssClass="legend" GroupingText="HELP - GA Permit Search" BorderWidth="1" BorderStyle="Solid" BorderColor="Black"  ForeColor="#925001">
                <ul class="niceList">
                    <li>Permit Types All, Title V, and SIP will return final permits and narratives, if
                        available.</li>
                    <li>Permit Types PSD/NSR will return final permits, narratives and additional documents
                        if available. To see the complete PSD document set, go to the PSD/112(g)/NAA-NSR/PCP
                        Permits directory on the Air Protection Branch website (link below). </li>
                    <li>For Title V applications, please go to the Title V Applications online or the Archive
                        (links below).</li>
                </ul>
            </asp:Panel>
            <telerik:RadWindowManager ID="RadWindowManager1" runat="server">
                <Windows>
                    <telerik:RadWindow ID="HelpWindow" runat="server" Title="HELP - GA Permit Search"
                        Width="400" Height="400" Behaviors="Minimize, Move, Resize, Maximize, Close"
                        EnableShadow="true" KeepInScreenBounds="true" OpenerElementID="lbtHelp" OffsetElementID="lbtHelp">
                        <ContentTemplate>
                            <ul class="niceList">
                                <li>Permit Types All, Title V, and SIP will return final permits and narratives, if
                                    available.</li>
                                <li>Permit Types PSD/NSR will return final permits, narratives and additional documents
                                    if available. To see the complete PSD document set, go to the PSD/112(g)/NAA-NSR/PCP
                                    Permits directory on the Air Protection Branch website (link below). </li>
                                <li>For Title V applications, please go to the Title V Applications online or the Archive
                                    (links below).</li>
                            </ul>
                        </ContentTemplate>
                    </telerik:RadWindow>
                </Windows>
            </telerik:RadWindowManager>
            <telerik:RadGrid ID="gvwPermits" runat="server" AutoGenerateColumns="False" AllowSorting="true"
                OnItemDataBound="gvwPermits_ItemDataBound" AllowPaging="true" PageSize="15" OnSortCommand="RadGrid1_SortCommand"
                OnPageIndexChanged="RadGrid1_PageIndexChanged" OnPageSizeChanged="RadGrid1_PageSizeChanged">
                <MasterTableView Summary="RadGrid table" DataKeyNames="permitNumber,VNarrative,VFinal,PSDNarrative,PSDFinal,OtherNarrative,OtherPermit">
                    <Columns>
                        <telerik:GridBoundColumn DataField="AIRSNumber" HeaderText="AIRS Number" SortExpression="AIRSNumber" />
                        <telerik:GridBoundColumn DataField="strfacilityname" HeaderText="Facility Name" SortExpression="strfacilityname" />
                        <telerik:GridBoundColumn DataField="issuancedate" HeaderText="Issuance Date" SortExpression="issuancedate"
                            DataFormatString="{0:d}" HtmlEncode="false" />
                        <telerik:GridTemplateColumn HeaderText="Final Permit" SortExpression="permitNumber">
                            <ItemTemplate>
                                <asp:HyperLink ID="hlFinalPermit" runat="server" Target="_blank"></asp:HyperLink>
                            </ItemTemplate>
                        </telerik:GridTemplateColumn>
                        <telerik:GridTemplateColumn HeaderText="Narrative">
                            <ItemTemplate>
                                <asp:HyperLink ID="hlNarrative" runat="server" Target="_blank"></asp:HyperLink>
                            </ItemTemplate>
                        </telerik:GridTemplateColumn>
                        <telerik:GridBoundColumn DataField="fileType" HeaderText="Permit Type" SortExpression="fileType" UniqueName="fileType" />
                    </Columns>
                </MasterTableView>
                <PagerStyle Mode="NextPrevAndNumeric"></PagerStyle>
            </telerik:RadGrid>
            <br />
            <telerik:RadGrid ID="gvwPSDPermits" runat="server" AutoGenerateColumns="False" AllowSorting="true"
                OnItemDataBound="gvwPSDPermits_ItemDataBound" AllowPaging="true" OnSortCommand="RadGrid1_SortCommand"
                OnPageIndexChanged="RadGrid1_PageIndexChanged" OnPageSizeChanged="RadGrid1_PageSizeChanged">
                <MasterTableView Summary="RadGrid table" DataKeyNames="permitNumber,PSDFinal">
                    <Columns>
                        <telerik:GridBoundColumn DataField="AIRSNumber" HeaderText="AIRS Number" SortExpression="AIRSNumber" />
                        <telerik:GridBoundColumn DataField="strfacilityname" HeaderText="Facility Name" SortExpression="strfacilityname" />
                        <telerik:GridBoundColumn DataField="issuancedate" HeaderText="Issuance Date" SortExpression="issuancedate"
                            DataFormatString="{0:d}" HtmlEncode="false" />
                        <telerik:GridTemplateColumn HeaderText="Final Permit" SortExpression="permitNumber">
                            <ItemTemplate>
                                <asp:HyperLink ID="hlPSDFinalPermit" runat="server" Target="_blank"></asp:HyperLink>
                            </ItemTemplate>
                        </telerik:GridTemplateColumn>
                        <telerik:GridHyperLinkColumn HeaderText="Narrative" DataTextField="PSDNarrative"
                            Target="_blank" DataNavigateUrlFields="PSDNarrative" DataNavigateUrlFormatString="permit.aspx?id={0}"
                            NavigateUrl="~/permit.aspx" />
                        <telerik:GridHyperLinkColumn HeaderText="Preliminary Determination" DataTextField="PSDPrelim"
                            Target="_blank" DataNavigateUrlFields="PSDPrelim" DataNavigateUrlFormatString="permit.aspx?id={0}"
                            NavigateUrl="~/permit.aspx" />
                        <telerik:GridHyperLinkColumn HeaderText="Final Determination" DataTextField="PSDFinalDet"
                            Target="_blank" DataNavigateUrlFields="PSDFinalDet" DataNavigateUrlFormatString="permit.aspx?id={0}"
                            NavigateUrl="~/permit.aspx" />
                        <telerik:GridHyperLinkColumn HeaderText="Application Summary" DataTextField="PSDAppSum"
                            Target="_blank" DataNavigateUrlFields="PSDAppSum" DataNavigateUrlFormatString="permit.aspx?id={0}"
                            NavigateUrl="~/permit.aspx" />
                        <telerik:GridBoundColumn DataField="fileType" HeaderText="Permit Type" SortExpression="fileType" />
                    </Columns>
                </MasterTableView>
                <PagerStyle Mode="NextPrevAndNumeric"></PagerStyle>
            </telerik:RadGrid>
        </telerik:RadAjaxPanel>
    </div>
    <div style="width: 97%;">
        <table style="width: 97%;">
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
        <br />
        <div style="text-align:center; font-size:smaller">
            ©2006 • Georgia Environmental Protection Division, Air Protection Branch • All rights
            reserved</div>
       
    </div>
    <asp:SqlDataSource ID="SqlDataSource1" runat="server" ProviderName="System.Data.SqlClient" ConnectionString="<%$ ConnectionStrings:SqlConnectionString %>"
        SelectCommand="Select DISTINCT substring(strairsnumber, 5, 12) as strairsnumber, Upper(strfacilityname) as facilityname from APBFacilityInformation order by strairsnumber">
    </asp:SqlDataSource>
    <%--</form>--%>
</asp:Content>

