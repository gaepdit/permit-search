Public Class clearcache
    Inherits Page

    Public ReadOnly Property RaygunApiKey = CType(ConfigurationManager.GetSection("RaygunSettings"), Mindscape.Raygun4Net.RaygunSettings).ApiKey

    Protected Sub lbtClearCache_Click(ByVal sender As Object, ByVal e As EventArgs) Handles lbtClearCache.Click
        Me.Cache.Remove("AllPermits")
    End Sub

End Class