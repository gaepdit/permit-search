Imports Microsoft.Data.SqlClient
Imports System.Linq
Imports System.Net

Public Class Permit
    Inherits Page

    Private Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load

        ' Check for old style URLs and redirect to new route
        Dim fileId As String = Request.QueryString.Get("Id")
        If fileId IsNot Nothing Then
            Response.RedirectToRoute("Permit", New With {.Id = fileId})
            Return
        End If

        Dim file As String = ""
        If Not Page.RouteData.Values.TryGetValue("Id", file) OrElse String.IsNullOrEmpty(file) Then
            Response.Redirect("~/")
            Return
        End If

        If {"PDF", "DOC"}.Contains(file.Substring(0, 3)) Then
            Dim newFileName As String = file.Substring(4)
            Response.RedirectToRoute("Permit", New With {.Id = newFileName})
            Return
        End If

        Const query As String = "SELECT pdfpermitdata FROM dbo.apbpermits WHERE strFILENAME = @filename "

        Dim connectionString As String = ConfigurationManager.ConnectionStrings("SqlConnectionString").ConnectionString
        Dim result As Object

        Using connection As New SqlConnection(connectionString)
            Using command As New SqlCommand(query, connection)
                command.CommandType = CommandType.Text
                command.Parameters.AddWithValue("@filename", file)
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
        Response.ContentType = "application/pdf"
        Response.AddHeader("content-disposition", "inline;filename=" & file & ".pdf")
        Response.Charset = ""
        Response.Cache.SetCacheability(HttpCacheability.Public)
        Response.BinaryWrite(CType(result, Byte()))
        Response.Flush()
        Response.End()
    End Sub

End Class