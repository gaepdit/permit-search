Imports System.Data.SqlClient

Public Class permit
    Inherits Page

    Public ReadOnly Property RaygunApiKey = CType(ConfigurationManager.GetSection("RaygunSettings"), Mindscape.Raygun4Net.RaygunSettings).ApiKey

    Dim file As String
    Dim MyData() As Byte

    Protected Sub lbtReturn_Click(ByVal sender As Object, ByVal e As EventArgs) Handles lbtReturn.Click
        Response.Write("<script language='javascript'> { window.close();}</script>")
    End Sub

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As EventArgs) Handles Me.Load
        lbtReturn.Attributes.Add("onclick", "window.close();")

        file = Request.QueryString("id")

        If file = "" Then
            NoPermit.Visible = True
            Exit Sub
        End If

        Dim ext As String = Mid(file, 1, 3)
        If ext = "PDF" Then

            Dim sql = "SELECT pdfpermitdata FROM apbpermits WHERE strFILENAME = '" & Mid(file, 5) & "' "
            Dim conn As New SqlConnection(strDBConnection)
            Dim cmd As New SqlCommand(sql, conn) With {
                .CommandType = CommandType.Text
            }

            If conn.State = ConnectionState.Open Then
            Else
                conn.Open()
            End If

            Dim dr As SqlDataReader = cmd.ExecuteReader()
            Dim recExist As Boolean = dr.Read

            If recExist = True Then
                NoPermit.Visible = False
                Me.Title = "GA AIR - File " & file
                MyData = CType(dr.Item("pdfpermitdata"), Byte())
                Response.Clear()
                Response.ClearHeaders()
                Response.ClearContent()
                Response.Buffer = True
                Response.ContentType = "application/pdf"
                Response.AddHeader("content-disposition", "inline;filename=" + file + ".pdf")
                Response.Charset = ""
                Response.Cache.SetCacheability(HttpCacheability.NoCache)
                Response.BinaryWrite(MyData)
                Response.Flush()
                Response.End()
            Else
                NoPermit.Visible = True
            End If

            If conn.State = ConnectionState.Open Then
                conn.Close()
            Else
                'conn.Open()
            End If

        ElseIf ext = "DOC" Then

            Dim sql = "SELECT docpermitdata FROM apbpermits WHERE strFILENAME = '" & Mid(file, 5) & "' "
            Dim conn As New SqlConnection(strDBConnection)
            Dim cmd As New SqlCommand(sql, conn) With {
                .CommandType = CommandType.Text
            }

            If conn.State = ConnectionState.Open Then
            Else
                conn.Open()
            End If

            Dim dr As SqlDataReader = cmd.ExecuteReader()
            Dim recExist As Boolean = dr.Read
            If recExist = True Then
                NoPermit.Visible = False
                Me.Title = "GA AIR - File " & file
                MyData = CType(dr.Item("docpermitdata"), Byte())
                Response.Clear()
                Response.ClearHeaders()
                Response.ClearContent()
                Response.Buffer = True
                Response.ContentType = "application/msword"
                Response.AddHeader("content-disposition", "inline;filename=" + file + ".doc")
                Response.Charset = ""
                Response.Cache.SetCacheability(HttpCacheability.NoCache)
                Response.BinaryWrite(MyData)
                Response.Flush()
                Response.End()
            Else
                NoPermit.Visible = True
            End If

            If conn.State = ConnectionState.Open Then
                conn.Close()
            Else
                'conn.Open()
            End If



        Else
            NoPermit.Visible = True
        End If

    End Sub

End Class