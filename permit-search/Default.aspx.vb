﻿Imports Telerik.Web.UI

Public Class _Default
    Inherits Page

    Private Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        If Not IsPostBack AndAlso Request.QueryString("AirsNumber") <> "" Then
            Dim airsNumber As String = Request.QueryString("AirsNumber")

            If ApbFacilityId.IsValidAirsNumberFormat(airsNumber) Then
                txtAirsNo.Entries.Insert(0, New AutoCompleteBoxEntry(New ApbFacilityId(airsNumber).FormattedString))
                gvwPermits.Visible = True
                gvwPermits.Rebind()
            End If
        End If
    End Sub

    Private Sub btnSearch_Click(sender As Object, e As EventArgs) Handles btnSearch.Click
        gvwPermits.Visible = True
        gvwPermits.CurrentPageIndex = 0
        gvwPermits.Rebind()
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
            permit = item.GetDataKeyValue("OtherPermit").ToString
            narrative = item.GetDataKeyValue("OtherNarrative").ToString
        ElseIf fileType = "Title V" Then
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

        Dim link = DirectCast(item.FindControl("hlNarrative"), HyperLink)
        If Not String.IsNullOrEmpty(narrative) Then
            link.NavigateUrl = String.Concat("~/permit.aspx?id=", narrative)
        Else
            link.Visible = False
        End If

        link = DirectCast(item.FindControl("hlPreDeterm"), HyperLink)
        If Not String.IsNullOrEmpty(preDeterm) Then
            link.NavigateUrl = String.Concat("~/permit.aspx?id=", preDeterm)
        Else
            link.Visible = False
        End If

        link = DirectCast(item.FindControl("hlFinDeterm"), HyperLink)
        If Not String.IsNullOrEmpty(finDeterm) Then
            link.NavigateUrl = String.Concat("~/permit.aspx?id=", finDeterm)
        Else
            link.Visible = False
        End If

        link = DirectCast(item.FindControl("hlAppSumm"), HyperLink)
        If Not String.IsNullOrEmpty(appSumm) Then
            link.NavigateUrl = String.Concat("~/permit.aspx?id=", appSumm)
        Else
            link.Visible = False
        End If
    End Sub

    Private Sub btnClear_Click(sender As Object, e As EventArgs) Handles btnClear.Click
        txtAirsNo.Entries.Clear()
        txtFacility.Entries.Clear()
        txtSIC.Text = ""

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

        gvwPermits.DataSource = GetPermits(gvwPermits.CurrentPageIndex, gvwPermits.PageSize,
                                           txtAirsNo.Text, txtFacility.Text, txtSIC.Text,
                                           sortColumn, sortDirection)
        gvwPermits.VirtualItemCount = GetPermitsCount(txtAirsNo.Text, txtFacility.Text, txtSIC.Text)
    End Sub
End Class