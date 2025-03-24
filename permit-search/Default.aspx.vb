Imports System.Net.Http
Imports System.Runtime.Caching
Imports System.Text.Json
Imports System.Threading.Tasks
Imports System.Web.UI.HtmlControls
Imports Telerik.Web.UI

Public Class _Default
    Inherits Page

    Public ReadOnly Property CurrentEnvironment As String = ConfigurationManager.AppSettings("APP_ENVIRONMENT")

    Private Async Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        If Not IsPostBack AndAlso Request.QueryString("AirsNumber") <> "" Then
            Dim airsNumber As String = Request.QueryString("AirsNumber")

            If ApbFacilityId.IsValidAirsNumberFormat(airsNumber) Then
                txtAirsNo.Entries.Insert(0, New AutoCompleteBoxEntry(New ApbFacilityId(airsNumber).ShortString))
                SearchPermits()
            End If
        End If

        Await DisplayNotificationsAsync()
    End Sub

    Private Async Function DisplayNotificationsAsync() As Task
        Dim notifications As List(Of OrgNotification) = Await GetNotificationsAsync()

        If notifications.Count > 0 Then
            Dim div As New HtmlGenericControl("div")
            div.Attributes("class") = "announcement announcement-severe"
            div.InnerHtml = "<h2>Notice</h2>"
            For Each notification As OrgNotification In notifications
                div.InnerHtml += $"<p>{notification.Message}</p>"
            Next
            div.InnerHtml += "<p>Please refer to the <a href=""https://status.gaepd.org/"">EPD-IT status page</a> for updates.</p>"
            OrgNotifications.Controls.Add(div)
        End If
    End Function

    Private Async Function GetNotificationsAsync() As Task(Of List(Of OrgNotification))
        Const cacheKey As String = "OrgNotifications"
        Dim orgNotificationsApiUrl As String = ConfigurationManager.AppSettings("OrgNotificationsApiUrl")

        If String.IsNullOrEmpty(orgNotificationsApiUrl) Then
            Return New List(Of OrgNotification)
        End If

        Dim cache As ObjectCache = MemoryCache.Default
        Dim notifications As List(Of OrgNotification) = cache.Get(cacheKey)

        If notifications Is Nothing Then
            notifications = Await FetchNotificationsFromApi(orgNotificationsApiUrl)
            cache.Add(cacheKey, notifications, DateTimeOffset.Now.AddHours(1))
        End If

        Return notifications
    End Function

    Private Async Function FetchNotificationsFromApi(orgNotificationsApiUrl As String) As Task(Of List(Of OrgNotification))
        Try
            Using client As New HttpClient()
                Dim response As HttpResponseMessage = Await client.GetAsync(orgNotificationsApiUrl)
                response.EnsureSuccessStatusCode()
                Return JsonSerializer.Deserialize(Of List(Of OrgNotification))(Await response.Content.ReadAsStringAsync())
            End Using
        Catch
            ' Intentionally left empty. If the API is unresponsive or other error occurs, no notifications will be displayed.
            Return New List(Of OrgNotification)
        End Try
    End Function

    Private Sub SearchPermits()
        gvwPermits.Visible = True
        gvwPermits.CurrentPageIndex = 0
        gvwPermits.Rebind()
    End Sub

    Private Sub btnSearch_Click(sender As Object, e As EventArgs) Handles btnSearch.Click
        SearchPermits()
    End Sub

    Private Sub gvwPermits_ItemDataBound(sender As Object, e As GridItemEventArgs) Handles gvwPermits.ItemDataBound
        If Not (TypeOf e.Item Is GridDataItem) Then
            Return
        End If

        Dim item = DirectCast(e.Item, GridDataItem)
        Dim fileType As String = item("FileType").Text
        Dim permit As String
        Dim narrative As String
        Dim preDeterm = ""
        Dim finDeterm = ""
        Dim appSumm = ""

        If fileType = "SIP" Then
            Dim list = DirectCast(item.FindControl("listDocs"), HtmlGenericControl)
            list.Attributes.Add("class", "nul")
            permit = item.GetDataKeyValue("OtherPermit").ToString
            narrative = item.GetDataKeyValue("OtherNarrative").ToString
        ElseIf fileType = "Title V" Then
            Dim list = DirectCast(item.FindControl("listDocs"), HtmlGenericControl)
            list.Attributes.Add("class", "nul")
            permit = item.GetDataKeyValue("VFinal").ToString
            narrative = item.GetDataKeyValue("VNarrative").ToString
        Else
            permit = item.GetDataKeyValue("PSDFinal").ToString
            narrative = item.GetDataKeyValue("PSDNarrative").ToString
            preDeterm = item.GetDataKeyValue("PSDPrelim").ToString
            finDeterm = item.GetDataKeyValue("PSDFinalDet").ToString
            appSumm = item.GetDataKeyValue("PSDAppSum").ToString
        End If

        Dim hlFinalPermit = DirectCast(item.FindControl("hlFinalPermit"), HyperLink)
        hlFinalPermit.Text = item.GetDataKeyValue("PermitNumber")
        hlFinalPermit.NavigateUrl = String.Concat("~/permit.aspx?id=", permit)

        If Not String.IsNullOrEmpty(narrative) Then
            Dim link = DirectCast(item.FindControl("hlNarrative"), HyperLink)
            link.NavigateUrl = String.Concat("~/permit.aspx?id=", narrative)
        Else
            Dim listItem = item.FindControl("liNarrative")
            listItem.Visible = False
        End If

        If Not String.IsNullOrEmpty(preDeterm) Then
            Dim link = DirectCast(item.FindControl("hlPreDeterm"), HyperLink)
            link.NavigateUrl = String.Concat("~/permit.aspx?id=", preDeterm)
        Else
            Dim listItem = item.FindControl("liPreDeterm")
            listItem.Visible = False
        End If

        If Not String.IsNullOrEmpty(finDeterm) Then
            Dim link = DirectCast(item.FindControl("hlFinDeterm"), HyperLink)
            link.NavigateUrl = String.Concat("~/permit.aspx?id=", finDeterm)
        Else
            Dim listItem = item.FindControl("liFinDeterm")
            listItem.Visible = False
        End If

        If Not String.IsNullOrEmpty(appSumm) Then
            Dim link = DirectCast(item.FindControl("hlAppSumm"), HyperLink)
            link.NavigateUrl = String.Concat("~/permit.aspx?id=", appSumm)
        Else
            Dim listItem = item.FindControl("liAppSumm")
            listItem.Visible = False
        End If
    End Sub

    Private Sub EntryAdded(sender As Object, e As AutoCompleteEntryEventArgs) Handles txtFacility.EntryAdded, txtAirsNo.EntryAdded
        SearchPermits()
    End Sub

    Private Sub EntryRemoved(sender As Object, e As AutoCompleteEntryEventArgs) Handles txtFacility.EntryRemoved, txtAirsNo.EntryRemoved
        ClearSearch()
    End Sub

    Private Sub btnClear_Click(sender As Object, e As EventArgs) Handles btnClear.Click
        txtAirsNo.Entries.Clear()
        txtFacility.Entries.Clear()
        txtSIC.Text = ""

        ClearSearch()
    End Sub

    Private Sub ClearSearch()
        gvwPermits.CurrentPageIndex = 0
        gvwPermits.DataSource = Nothing
        gvwPermits.DataBind()
        gvwPermits.Visible = False
    End Sub

    Private Sub gvwPermits_NeedDataSource(sender As Object, e As GridNeedDataSourceEventArgs) Handles gvwPermits.NeedDataSource
        Dim sortExpressions = gvwPermits.MasterTableView.SortExpressions

        Dim sortColumn = ""
        Dim sortDirection = ""

        If sortExpressions.Count = 1 Then
            sortColumn = sortExpressions(0).FieldName
            sortDirection = sortExpressions(0).SortOrderAsString
        End If

        Dim airs As String = ""
        If txtAirsNo.Entries.Count = 1 Then
            airs = txtAirsNo.Entries.Item(0).Text
        End If

        Dim fac As String = ""
        If txtFacility.Entries.Count = 1 Then
            fac = txtFacility.Entries(0).Text
        End If

        gvwPermits.DataSource = GetPermits(gvwPermits.CurrentPageIndex, gvwPermits.PageSize,
                                           airs, fac, txtSIC.Text, sortColumn, sortDirection)
        gvwPermits.VirtualItemCount = GetPermitsCount(airs, fac, txtSIC.Text)
    End Sub

End Class