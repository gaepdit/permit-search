Imports System.Data.SqlClient

Public Class permit
    Inherits System.Web.UI.Page
    Dim file As String
    Dim MyData() As Byte

    'Public Sub ConvertToPDF(SourceFilename As String, DestinationFilename As String)
    '    Dim OOPDirectory As String = "D:\wwwroot\OpenOfficePortable\"
    '    'OOP = Open Office Portable
    '    Dim OOPExecutable As String = "OpenOfficePortable.exe"
    '    Dim OOPConversionLibrary As String = "ConversionLibrary"
    '    Dim OOPConversionModule As String = "PDFConversion"
    '    Dim OOPConversionFunction As String = "ConvertWordToPDF"

    '    Dim p As New Process()
    '    Try
    '        Dim startInfo As New ProcessStartInfo()
    '        startInfo.CreateNoWindow = True
    '        startInfo.FileName = OOPDirectory + OOPExecutable
    '        startInfo.Arguments = [String].Format("-invisible macro:///{0}.{1}.{2}(""{3}"",""{4}"")", OOPConversionLibrary, OOPConversionModule, OOPConversionFunction, SourceFilename, DestinationFilename)

    '        p.StartInfo = startInfo
    '        p.Start()
    '        p.WaitForExit()
    '    Catch ex As Exception
    '        ErrorReport(ex.ToString)
    '    Finally
    '        If Not p.HasExited Then
    '            p.Kill()
    '            p.WaitForExit()
    '        End If
    '    End Try
    'End Sub

    'Public Function FileExists(ByVal FileFullPath As String) As Boolean
    '    Dim fileInfo As FileInfo = New FileInfo(FileFullPath)
    '    Dim exists As Boolean = fileInfo.Exists
    '    Return exists
    'End Function

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

        'If FileExists(Server.MapPath("Files\" & file & ".pdf")) Then
        '    Dim webClient As WebClient = New WebClient()
        '    Dim myBuff As [Byte]() = webClient.DownloadData(Server.MapPath("Files\" & file & ".pdf"))
        '    Response.ContentType = "application/pdf"
        '    Response.AddHeader("content-length", myBuff.Length.ToString())
        '    Response.BinaryWrite(myBuff)
        '    Response.Flush()
        '    Response.End()
        'End If
      
        Dim ext As String = Mid(file, 1, 3)
        If ext = "PDF" Then

            Dim sql = "SELECT pdfpermitdata FROM apbpermits WHERE strFILENAME = '" & Mid(file, 5) & "' "
            Dim conn As New SqlConnection(strDBConnection)
            Dim cmd As New SqlCommand(sql, conn)
            cmd.CommandType = CommandType.Text

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
            Dim cmd As New SqlCommand(sql, conn)
            cmd.CommandType = CommandType.Text

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

    'Private Sub DisplayDocFile()
    '    Try
    '        If FileExists(Server.MapPath("Files\" & file & ".doc")) Then
    '            Dim webClient As WebClient = New WebClient()
    '            Dim myBuff As [Byte]() = webClient.DownloadData(Server.MapPath("Files\" & file & ".doc"))
    '            Response.ContentType = "application/msword"
    '            Response.AddHeader("content-length", myBuff.Length.ToString())
    '            Response.BinaryWrite(myBuff)
    '            Response.Flush()
    '            Response.End()
    '        End If

    '        Dim sql = "SELECT docpermitdata FROM apbpermits WHERE strFILENAME = '" & Mid(file, 5) & "' "
    '        Dim conn As New SQLConnection(strcon)
    '        Dim cmd As New SQLCommand(sql, conn)
    '        cmd.CommandType = CommandType.Text

    '        If conn.State = ConnectionState.Open Then
    '        Else
    '            conn.Open()
    '        End If

    '        Dim dr As SQLDataReader = cmd.ExecuteReader()
    '        Dim recExist As Boolean = dr.Read
    '        If recExist = True Then
    '            NoPermit.Visible = False
    '            Me.Title = "GA AIR - File " & file
    '            MyData = CType(dr.Item("docpermitdata"), Byte())
    '            Response.Clear()
    '            Response.ClearHeaders()
    '            Response.ClearContent()
    '            Response.Buffer = True
    '            Response.ContentType = "application/msword"
    '            Response.AddHeader("content-disposition", "inline;filename=" + "Permit.doc")
    '            Response.Charset = ""
    '            Response.Cache.SetCacheability(HttpCacheability.NoCache)
    '            Response.BinaryWrite(MyData)
    '            Response.Flush()
    '            Response.End()
    '        Else
    '            NoPermit.Visible = True
    '        End If

    '        If conn.State = ConnectionState.Open Then
    '            conn.Close()
    '        Else
    '            'conn.Open()
    '        End If

    '    Catch exThreadAbort As System.Threading.ThreadAbortException
    '    Catch ex As Exception
    '        ErrorReport(ex.ToString)
    '    Finally
    '        If FileExists(Server.MapPath("Files\" & file & ".doc")) Then
    '            System.IO.File.Delete(Server.MapPath("Files\" & file & ".doc"))
    '        End If
    '    End Try
    'End Sub
End Class