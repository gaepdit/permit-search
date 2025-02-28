<%@ Page Language="VB" Async="true" MasterPageFile="~/Main.Master" AutoEventWireup="false" CodeBehind="Default.aspx.vb" Inherits="permitsearch.gaepd.org._Default" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder2" runat="server">
    <telerik:RadScriptManager ID="RadScriptManager1" runat="server">
        <Scripts>
            <asp:ScriptReference Assembly="Telerik.Web.UI" Name="Telerik.Web.UI.Common.Core.js" />
            <asp:ScriptReference Assembly="Telerik.Web.UI" Name="Telerik.Web.UI.Common.jQuery.js" />
            <asp:ScriptReference Assembly="Telerik.Web.UI" Name="Telerik.Web.UI.Common.jQueryInclude.js" />
        </Scripts>
    </telerik:RadScriptManager>
    <telerik:RadAjaxManager ID="RadAjaxManager1" runat="server" />

    <div class="maincontent">
         <asp:PlaceHolder ID="OrgNotifications" runat="server"></asp:PlaceHolder>

        <div class="form-banner">
            <h2>Georgia Air Protection Branch<br />
                Permit Search Engine</h2>
        </div>

        <telerik:RadAjaxLoadingPanel ID="LoadingPanel1" runat="Server" Transparency="30" EnableSkinTransparency="false" BackColor="#E0E0E0" />
        <telerik:RadAjaxPanel ID="AjaxPanel1" runat="server" LoadingPanelID="LoadingPanel1">
            <asp:Panel ID="pnlSearch" runat="server">
                <table>
                    <tr>
                        <td>
                            <telerik:RadLabel ID="lblAirsNo" runat="server" AssociatedControlID="txtAirsNo">AIRS Number:</telerik:RadLabel>
                            <telerik:RadAutoCompleteBox ID="txtAirsNo" runat="server" RenderMode="Lightweight"
                                Width="200px" DropDownWidth="500px" DropDownHeight="300px" MinFilterLength="3" MaxResultCount="30"
                                DataSourceID="SqlDataSource1" DataTextField="AIRS" EmptyMessage="Select an AIRS Number"
                                Filter="StartsWith" OnClientEntryAdding="OnClientEntryAdding">
                                <DropDownItemTemplate>
                                    <div class="autocomplete-entry">
                                        <span><%# DataBinder.Eval(Container.DataItem, "AIRS")%></span>
                                        <span><%# DataBinder.Eval(Container.DataItem, "FACILITY")%></span>
                                    </div>
                                </DropDownItemTemplate>
                            </telerik:RadAutoCompleteBox>
                        </td>
                        <td>
                            <telerik:RadLabel ID="lblFacility" runat="server" AssociatedControlID="txtFacility">Facility Name:</telerik:RadLabel>
                            <telerik:RadAutoCompleteBox ID="txtFacility" runat="server" RenderMode="Lightweight"
                                Width="320px" DropDownWidth="500px" DropDownHeight="300px" MinFilterLength="2" MaxResultCount="30"
                                DataSourceID="SqlDataSource2" DataTextField="FACILITY" EmptyMessage="Select a Facility"
                                AllowCustomEntry="True" HighlightFirstMatch="False" OnClientEntryAdding="OnClientEntryAdding" />
                        </td>
                        <td>
                            <asp:Label ID="lblSIC" runat="server" AssociatedControlID="txtSIC">Permit Number/SIC Code:</asp:Label>
                            <telerik:RadTextBox ID="txtSIC" runat="server" Width="200px" />
                        </td>
                    </tr>
                </table>

                <div class="button-row">
                    <telerik:RadButton runat="server" ID="btnSearch" Text="Search Permits" BorderStyle="Solid" ForeColor="#925001" Font-Bold="true" />
                    <telerik:RadButton runat="server" ID="btnClear" Text="Clear Search" BorderStyle="Solid" ForeColor="#925001" Font-Bold="true" />
                </div>
            </asp:Panel>

            <telerik:RadGrid ID="gvwPermits" runat="server"
                AllowCustomPaging="True" AllowPaging="true" AllowSorting="true" AutoGenerateColumns="False"
                PagerStyle-PageSizeControlType="None" PagerStyle-Position="TopAndBottom" PageSize="20" Visible="False">
                <MasterTableView DataKeyNames="PermitNumber,VNarrative,VFinal,PSDNarrative,PSDFinal,OtherNarrative,OtherPermit,PSDPrelim,PSDFinalDet,PSDAppSum">
                    <Columns>
                        <telerik:GridBoundColumn DataField="AIRS" HeaderText="AIRS Number" />
                        <telerik:GridBoundColumn DataField="FacilityName" HeaderText="Facility Name" />
                        <telerik:GridTemplateColumn HeaderText="Permit" SortExpression="PermitNumber">
                            <ItemTemplate>
                                <asp:HyperLink ID="hlFinalPermit" runat="server" Target="_blank" />
                            </ItemTemplate>
                        </telerik:GridTemplateColumn>
                        <telerik:GridBoundColumn DataField="IssuanceDate" HeaderText="Issuance Date" DataFormatString="{0:d&#8209;MMM&#8209;yyyy}" />
                        <telerik:GridTemplateColumn HeaderText="Other Documents">
                            <ItemTemplate>
                                <ul id="listDocs" runat="server">
                                    <li id="liNarrative" runat="server">
                                        <asp:HyperLink ID="hlNarrative" runat="server" Target="_blank" Text="Narrative" />
                                    </li>
                                    <li id="liPreDeterm" runat="server">
                                        <asp:HyperLink ID="hlPreDeterm" runat="server" Target="_blank" Text="Preliminary Determination" />
                                    </li>
                                    <li id="liFinDeterm" runat="server">
                                        <asp:HyperLink ID="hlFinDeterm" runat="server" Target="_blank" Text="Final Determination" />
                                    </li>
                                    <li id="liAppSumm" runat="server">
                                        <asp:HyperLink ID="hlAppSumm" runat="server" Target="_blank" Text="Application Summary" />
                                    </li>
                                </ul>
                            </ItemTemplate>
                        </telerik:GridTemplateColumn>
                        <telerik:GridBoundColumn DataField="fileType" HeaderText="Permit Type" AllowSorting="false" />
                    </Columns>
                </MasterTableView>
                <PagerStyle Mode="NextPrevAndNumeric" />
            </telerik:RadGrid>
        </telerik:RadAjaxPanel>
    </div>
    <asp:SqlDataSource ID="SqlDataSource1" runat="server" ProviderName="System.Data.SqlClient" ConnectionString="<%$ ConnectionStrings:SqlConnectionString %>"
        SelectCommand="select right(STRAIRSNUMBER, 8) as AIRS, STRFACILITYNAME as FACILITY from dbo.APBFACILITYINFORMATION order by 1" />
    <asp:SqlDataSource ID="SqlDataSource2" runat="server" ProviderName="System.Data.SqlClient" ConnectionString="<%$ ConnectionStrings:SqlConnectionString %>"
        SelectCommand="select concat(substring(STRAIRSNUMBER, 5, 3), '-', right(STRAIRSNUMBER, 5)) as AIRS, STRFACILITYNAME as FACILITY from dbo.APBFACILITYINFORMATION order by 2" />
</asp:Content>

