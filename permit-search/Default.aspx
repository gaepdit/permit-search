<%@ Page Language="VB" MasterPageFile="~/Main.Master" AutoEventWireup="false" CodeBehind="Default.aspx.vb" Inherits="permitsearch.gaepd.org._Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <telerik:RadStyleSheetManager ID="RadStyleSheetManager1" runat="server" />
    <script type="text/javascript">
        function OnClientEntryAdding(sender, args) {
            if (sender.get_entries().get_count() > 0) {
                var entries = sender.get_entries();
                entries.clear();
                entries.add(args.get_entry());
                args.set_cancel(true);
            }
        }
    </script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder2" runat="server">
    <telerik:RadScriptManager ID="RadScriptManager1" runat="server">
        <Scripts>
            <asp:ScriptReference Assembly="Telerik.Web.UI" Name="Telerik.Web.UI.Common.Core.js" />
            <asp:ScriptReference Assembly="Telerik.Web.UI" Name="Telerik.Web.UI.Common.jQuery.js" />
            <asp:ScriptReference Assembly="Telerik.Web.UI" Name="Telerik.Web.UI.Common.jQueryInclude.js" />
        </Scripts>
    </telerik:RadScriptManager>
    <telerik:RadAjaxManager ID="RadAjaxManager1" runat="server" />

    <div class="maincontent" style="width: 97%; margin-bottom: 15px; height: 100%">
        <div class="div1" style="text-align: center; color: white; background-color: #203119; padding: 16px 0; line-height: 1.4; margin-bottom: 20px">
            <h2>Georgia Air Protection Branch<br />
                Permit Search Engine</h2>
        </div>

        <telerik:RadAjaxLoadingPanel ID="LoadingPanel1" runat="Server" Transparency="30" EnableSkinTransparency="false" BackColor="#E0E0E0" />
        <telerik:RadAjaxPanel ID="AjaxPanel1" runat="server" LoadingPanelID="LoadingPanel1">
            <asp:Panel ID="pnlSearch" runat="server">
                <table style="width: 97%;">
                    <tr>
                        <td>AIRS Number:
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
                        <td>Facility Name:
                        <telerik:RadAutoCompleteBox ID="txtFacility" runat="server" RenderMode="Lightweight"
                            Width="320px" DropDownWidth="500px" DropDownHeight="300px" MinFilterLength="2" MaxResultCount="30"
                            DataSourceID="SqlDataSource2" DataTextField="FACILITY" EmptyMessage="Select a Facility"
                            AllowCustomEntry="True" HighlightFirstMatch="False" OnClientEntryAdding="OnClientEntryAdding" />
                        </td>
                        <td>Permit Number/SIC Code:
                        <telerik:RadTextBox ID="txtSIC" runat="server" Width="200px" />
                        </td>
                    </tr>
                </table>

                <div style="margin: 20px 0;">
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
                        <telerik:GridBoundColumn DataField="IssuanceDate" HeaderText="Issuance Date" DataFormatString="{0:d-MMM-yyyy}" />
                        <telerik:GridTemplateColumn HeaderText="Other Documents">
                            <ItemTemplate>
                                <div id="divDocs" runat="server">
                                    <asp:HyperLink ID="hlNarrative" runat="server" Target="_blank" Text="Narrative" />
                                    <asp:HyperLink ID="hlPreDeterm" runat="server" Target="_blank" Text="Preliminary Determination" />
                                    <asp:HyperLink ID="hlFinDeterm" runat="server" Target="_blank" Text="Final Determination" />
                                    <asp:HyperLink ID="hlAppSumm" runat="server" Target="_blank" Text="Application Summary" />
                                </div>
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

