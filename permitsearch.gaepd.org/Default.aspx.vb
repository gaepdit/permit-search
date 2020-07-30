Imports System.Data.SqlClient
Imports Telerik.Web.UI

Public Class _Default
    Inherits System.Web.UI.Page

    Public charsToTrim As Char() = {"="c, "*"c, """"c, ";"c, "'"c, " "c, "?"c, "%"c, "!"c, "~"c, "@"c, "#"c, "<"c, ">"c}

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Not IsPostBack AndAlso Request.QueryString("AirsNumber") <> "" Then
            txtAirsNo.Entries.Insert(0, New AutoCompleteBoxEntry(Request.QueryString("AirsNumber")))
            rblPermitType.SelectedValue = "All"
            SearchPermits()
        End If
    End Sub

    Protected Sub btnSearch_Click(ByVal sender As Object, ByVal e As EventArgs) Handles btnSearch.Click
        SearchPermits()
    End Sub

    Protected Sub SearchPermits()
        Dim searchstr As String
        pnlHelp.Visible = False
        lbtHelp.Visible = True
        Dim dataViews As DataView = New DataView()
        If (Cache("AllPermits") Is Nothing) Then
            PopulatePermitsGridView()
        End If
        Dim item As DataTable = DirectCast(Cache("AllPermits"), DataTable).Copy
        dataViews.Table = item

        Dim str As String = txtAirsNo.Text
        str = str.Substring(0, str.IndexOf(";") + 1).Trim(charsToTrim)
        str = Replace(str, """", "")
        Dim str1 As String = txtFacility.Text
        str1 = str1.Substring(0, str1.IndexOf(";") + 1).Trim(charsToTrim)
        str1 = Replace(str1, """", "")
        str1 = Replace(str1, "'", "''")
        Dim str2 As String = txtSIC.Text
        str2 = str2.Trim(charsToTrim)
        'str2 = str2.Substring(0, str2.IndexOf(";") + 1).Trim(charsToTrim)
        str2 = Replace(str2, """", "")
        Dim selectedValue As String = rblPermitType.SelectedValue

        If selectedValue = "PSD" Then
            searchstr = "airsnumber LIKE '%" & str
            searchstr &= "%' and strfacilityname LIKE '%" & str1
            searchstr &= "%' and permitnumber LIKE '%" & str2
            searchstr &= "%' and fileType LIKE '%PSD%'"
            dataViews.RowFilter = searchstr
            gvwPSDPermits.DataSource = dataViews
            Session("MyView") = dataViews.ToTable()
            gvwPSDPermits.DataBind()
            gvwPSDPermits.Visible = True
            gvwPermits.Visible = False
        ElseIf selectedValue = "SIP" Then
            searchstr = "airsnumber LIKE '%" & str
            searchstr &= "%' and strfacilityname LIKE '%" & str1
            searchstr &= "%' and permitnumber LIKE '%" & str2
            searchstr &= "%' and fileType LIKE '%SIP%'"
            dataViews.RowFilter = searchstr
            gvwPermits.DataSource = dataViews
            Session("MyView") = dataViews.ToTable()
            gvwPermits.DataBind()
            gvwPermits.Visible = True
            gvwPSDPermits.Visible = False
        ElseIf selectedValue = "Title V" Then
            searchstr = "airsnumber LIKE '%" & str
            searchstr &= "%' and strfacilityname LIKE '%" & str1
            searchstr &= "%' and permitnumber LIKE '%" & str2
            searchstr &= "%' and fileType LIKE '%Title V%'"
            dataViews.RowFilter = searchstr
            gvwPermits.DataSource = dataViews
            Session("MyView") = dataViews.ToTable()
            gvwPermits.DataBind()
            gvwPermits.Visible = True
            gvwPSDPermits.Visible = False
        Else
            searchstr = "airsnumber LIKE '%" & str
            searchstr &= "%' and strfacilityname LIKE '%" & str1
            searchstr &= "%' and permitnumber LIKE '%" & str2
            searchstr &= "%'"
            dataViews.RowFilter = searchstr
            gvwPermits.DataSource = dataViews
            Session("MyView") = dataViews.ToTable()
            gvwPermits.DataBind()
            gvwPermits.Visible = True
            gvwPSDPermits.Visible = False
        End If

    End Sub

    Private Sub PopulatePermitsGridView()

        If (Me.Cache("AllPermits") Is Nothing) Then
            Dim str As String = "SELECT * from vw_ga_permits"
            Dim dataTable As DataTable = New DataTable("Permits")
            Using conn = New SqlConnection(strDBConnection)
                Using cmd = New SqlCommand(str, conn)
                    conn.Open()
                    Dim adapter As New SqlDataAdapter(cmd)
                    adapter.Fill(dataTable)
                    conn.Close()
                End Using
            End Using
            Dim now As DateTime = DateTime.Now
            Me.Cache.Insert("AllPermits", dataTable, Nothing, now.AddHours(12), Cache.NoSlidingExpiration)
            Me.Session("MyView") = dataTable
        End If

    End Sub

    Protected Sub gvwPermits_ItemDataBound(ByVal sender As Object, ByVal e As GridItemEventArgs)

        If TypeOf e.Item Is GridDataItem Then
            Dim item As GridDataItem = DirectCast(e.Item, GridDataItem)
            Dim hyperLink As HyperLink = DirectCast(item.FindControl("hlFinalPermit"), HyperLink)
            Dim hyperLink1 As HyperLink = DirectCast(item.FindControl("hlNarrative"), HyperLink)
            'DirectCast(e.Item, GridDataItem)).GetDataKeyValue("CustomerID").ToString()
            hyperLink.Text = DirectCast(e.Item, GridDataItem).GetDataKeyValue("permitNumber").ToString()
            hyperLink.Text = HighlightText(txtSIC.Text, hyperLink.Text)
            hyperLink1.Text = DirectCast(e.Item, GridDataItem).GetDataKeyValue("permitNumber").ToString()
            hyperLink1.Text = HighlightText(txtSIC.Text, hyperLink1.Text)
            Dim text As String = item("fileType").Text
            If text = "SIP" Then
                hyperLink.NavigateUrl = String.Concat("~/permit.aspx?id=", DirectCast(e.Item, GridDataItem).GetDataKeyValue("OtherPermit").ToString())
                hyperLink1.Text = Mid(DirectCast(e.Item, GridDataItem).GetDataKeyValue("OtherNarrative").ToString(), 5)
                hyperLink1.NavigateUrl = String.Concat("~/permit.aspx?id=", DirectCast(e.Item, GridDataItem).GetDataKeyValue("OtherNarrative").ToString())
            ElseIf text = "Title V" Then
                hyperLink.NavigateUrl = String.Concat("~/permit.aspx?id=", DirectCast(e.Item, GridDataItem).GetDataKeyValue("VFinal").ToString())
                hyperLink1.Text = Mid(DirectCast(e.Item, GridDataItem).GetDataKeyValue("VNarrative").ToString(), 5)
                hyperLink1.NavigateUrl = String.Concat("~/permit.aspx?id=", DirectCast(e.Item, GridDataItem).GetDataKeyValue("VNarrative").ToString())
            Else
                hyperLink.NavigateUrl = String.Concat("~/permit.aspx?id=", DirectCast(e.Item, GridDataItem).GetDataKeyValue("PSDFinal").ToString())
                hyperLink1.Text = Mid(DirectCast(e.Item, GridDataItem).GetDataKeyValue("PSDNarrative").ToString(), 5)
                hyperLink1.NavigateUrl = String.Concat("~/permit.aspx?id=", DirectCast(e.Item, GridDataItem).GetDataKeyValue("PSDNarrative").ToString())
            End If
        End If
    End Sub

    Protected Sub gvwPSDPermits_ItemDataBound(ByVal sender As Object, ByVal e As GridItemEventArgs)
        If TypeOf e.Item Is GridDataItem Then
            Dim item As GridDataItem = DirectCast(e.Item, GridDataItem)
            Dim hyperLink As HyperLink = DirectCast(item.FindControl("hlPSDFinalPermit"), HyperLink)
            hyperLink.Text = DirectCast(e.Item, GridDataItem).GetDataKeyValue("permitNumber").ToString()
            hyperLink.Text = HighlightText(String.Concat(txtSIC.Text, ""), hyperLink.Text)
            hyperLink.NavigateUrl = String.Concat("~/permit.aspx?id=", DirectCast(e.Item, GridDataItem).GetDataKeyValue("PSDFinal").ToString())
        End If

    End Sub

    Public Function HighlightText(ByVal Search_Str As String, ByVal InputTxt As String) As String

        If Search_Str = "" Then
            Return InputTxt
        End If
        Search_Str = Search_Str.Trim(charsToTrim)
        Search_Str = Replace(Search_Str, """", "")
        Dim regex As Regex = New Regex(Search_Str.Replace(" ", "|").Trim(), RegexOptions.IgnoreCase)
        Return regex.Replace(InputTxt, New MatchEvaluator(AddressOf ReplaceWords))
    End Function



    Protected Sub RadGrid1_PageIndexChanged(ByVal source As Object, ByVal e As GridPageChangedEventArgs)
        SearchPermits()
    End Sub

    Protected Sub RadGrid1_PageSizeChanged(ByVal source As Object, ByVal e As GridPageSizeChangedEventArgs)
        SearchPermits()
    End Sub

    Protected Sub RadGrid1_SortCommand(ByVal source As Object, ByVal e As GridSortCommandEventArgs)
        SearchPermits()
    End Sub

    Public Function ReplaceWords(ByVal m As Match) As String
        Dim str As String = String.Concat("<span class=highlight>", m.ToString(), "</span>")
        Return str
    End Function

    Protected Sub RadAutoCompleteBox1_TextChanged(sender As Object, e As AutoCompleteTextEventArgs)
        SearchPermits()
    End Sub

    Protected Sub RadAutoCompleteBox1_EntryAdded(sender As Object, e As AutoCompleteEntryEventArgs)
        SearchPermits()
    End Sub

    Protected Sub RadAutoCompleteBox1_EntryRemoved(sender As Object, e As AutoCompleteEntryEventArgs)
        SearchPermits()
    End Sub

    Private Sub btnClear_Click(sender As Object, e As EventArgs) Handles btnClear.Click
        pnlHelp.Visible = False
        lbtHelp.Visible = True
        txtAirsNo.Entries.Clear()
        txtFacility.Entries.Clear()
        'Dim count As Integer = txtAirsNo.Entries.Count
        'If count > 0 Then
        '    txtAirsNo.Entries.RemoveAt(count - 1)
        'End If
        'Dim count1 As Integer = txtFacility.Entries.Count
        'If count1 > 0 Then
        '    txtFacility.Entries.RemoveAt(count1 - 1)
        'End If
        txtSIC.Text = ""
        Dim dataViews As DataView = New DataView()
        If (Cache("AllPermits") Is Nothing) Then
            PopulatePermitsGridView()
        End If
        Dim item As DataTable = DirectCast(Cache("AllPermits"), DataTable).Copy
        dataViews.Table = item
        gvwPermits.DataSource = dataViews
        Session("MyView") = dataViews.ToTable()
        gvwPermits.DataBind()
        gvwPermits.Visible = True
        gvwPSDPermits.Visible = False
        rblPermitType.SelectedValue = "All"
    End Sub

End Class