Imports Microsoft.Data.SqlClient
Imports System.Collections.Specialized
Imports System.Linq
Imports System.Net

Public Class permit
    Inherits Page

    Private Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        Dim nameValues As NameValueCollection = HttpUtility.ParseQueryString(Request.QueryString.ToString())
        Dim file As String = nameValues.Item("id")

        If String.IsNullOrEmpty(file) Then
            Response.StatusCode = HttpStatusCode.BadRequest
            Return
        End If

        Dim ext As String = file.Substring(0, 3)
        If {"PDF", "DOC"}.Contains(ext) Then
            Dim newFileName As String = file.Substring(4)
            nameValues.Set("id", newFileName)

            Response.Redirect(String.Concat(Request.Url.AbsolutePath, "?", nameValues), False)
            HttpContext.Current.ApplicationInstance.CompleteRequest()
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