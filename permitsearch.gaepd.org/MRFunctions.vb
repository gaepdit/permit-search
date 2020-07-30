Imports System.Net.Mail
Imports System.Data.SqlClient

Public Module MRFunctions

    Public OracleDate As String = Format(Date.Today, "dd-MMM-yyyy")
    Public strDBConnection As String = ConfigurationManager.ConnectionStrings("SqlConnectionString").ToString
    Public Sub ErrorReport(ByVal errormsg As String)
        Dim IPAddress = HttpContext.Current.Request.ServerVariables("REMOTE_ADDR")
        Dim URL = HttpContext.Current.Request.Url.AbsoluteUri
        'Dim errormsg = HttpContext.Current.Server.GetLastError().InnerException.ToString()
        HttpContext.Current.Server.ClearError()
        Dim SQL As String
        Dim cmd As SQLCommand
        Dim dr As SqlDataReader

        SQL = "Insert into OlapErrorLog " &
        "(strIPAddress, strUserEmail, " &
        "strErrorPage, DateTimeStamp, strErrorMsg, numError) " &
        "values " &
        "('" & IPAddress & "', '" & "Permit Search', " &
        "'" & URL & "', '" & Format$(Now, "dd-MMM-yyyy hh:mm:ss") & "', " &
        "'" & Replace(errormsg, "'", "''") & "', Next Value for OlapErrorLog_SEQ) "

        Dim conn As New SqlConnection(strDBConnection)
        cmd = New SqlCommand(SQL, conn)
        If conn.State = ConnectionState.Closed Then
            conn.Open()
        End If

        dr = cmd.ExecuteReader
        If dr.IsClosed = False Then
            dr.Close()
        End If

        If conn.State = ConnectionState.Open Then
            conn.Close()
        End If
        'Send email to members of DMU
        Dim msg As New MailMessage
        Dim smtpClient As SmtpClient = New SmtpClient()
        Dim fromAddress As MailAddress = New MailAddress("airbranch@dnr.ga.gov", "GA Air Protection")
        msg.From = fromAddress
        msg.To.Add("brian.gregory@dnr.ga.gov")
        msg.To.Add("tamika.huguley@dnr.ga.gov")
        msg.To.Add("mahesh.rathi@dnr.ga.gov")


        msg.Subject = URL
        msg.IsBodyHtml = True
        msg.Body = "<p> Error Page: " & URL
        msg.Body &= "<p> Error Message: " & errormsg

        smtpClient.Host = "smtp.gets.ga.gov"
        smtpClient.Send(msg)
    End Sub

    
End Module