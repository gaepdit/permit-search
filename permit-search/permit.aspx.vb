﻿Imports Microsoft.Data.SqlClient
Imports System.Linq
Imports System.Net

Public Class permit
    Inherits Page

    Protected ReadOnly Property RaygunApiKey = CType(ConfigurationManager.GetSection("RaygunSettings"), Mindscape.Raygun4Net.RaygunSettings).ApiKey

    Private Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        Dim file As String = Request.QueryString("id")
        If String.IsNullOrEmpty(file) Then
            Response.StatusCode = HttpStatusCode.BadRequest
            Return
        End If

        Dim ext As String = file.Substring(0, 3)
        If Not {"PDF", "DOC"}.Contains(ext) Then
            Response.StatusCode = HttpStatusCode.NotFound
            Return
        End If

        Dim filename As String = file.Substring(4)
        If String.IsNullOrEmpty(filename) Then
            Response.StatusCode = HttpStatusCode.NotFound
            Return
        End If

        Dim query As String
        If ext = "PDF" Then
            query = "SELECT pdfpermitdata FROM dbo.apbpermits WHERE strFILENAME = @filename "
        Else
            query = "SELECT docpermitdata FROM dbo.apbpermits WHERE strFILENAME = @filename "
        End If

        Dim connectionString As String = ConfigurationManager.ConnectionStrings("SqlConnectionString").ConnectionString
        Dim result As Object

        Using connection As New SqlConnection(connectionString)
            Using command As New SqlCommand(query, connection)
                command.CommandType = CommandType.Text
                command.Parameters.AddWithValue("@filename", filename)
                command.Connection.Open()
                result = command.ExecuteScalar()
                command.Connection.Close()
                command.Parameters.Clear()
            End Using
        End Using

        If result Is Nothing OrElse Convert.IsDBNull(result) Then
            Response.StatusCode = HttpStatusCode.NotFound
            Return
        End If

        Response.Clear()
        Response.ClearHeaders()
        Response.ClearContent()
        Response.Buffer = True

        If ext = "PDF" Then
            Response.ContentType = "application/pdf"
            Response.AddHeader("content-disposition", "inline;filename=" & file & ".pdf")
        Else
            Response.ContentType = "application/msword"
            Response.AddHeader("content-disposition", "inline;filename=" & file & ".doc")
        End If

        Response.Charset = ""
        Response.Cache.SetCacheability(HttpCacheability.Public)
        Response.BinaryWrite(CType(result, Byte()))
        Response.Flush()
        Response.End()
    End Sub

End Class