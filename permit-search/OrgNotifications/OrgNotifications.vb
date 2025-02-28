Imports System.Text.Json.Serialization

Friend Module OrgNotifications

    Public Class OrgNotification
        <JsonPropertyName("message")>
        Public Property Message As String
    End Class

End Module
