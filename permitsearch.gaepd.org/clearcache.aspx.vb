Public Class clearcache
    Inherits System.Web.UI.Page

    Protected Sub lbtClearCache_Click(ByVal sender As Object, ByVal e As EventArgs) Handles lbtClearCache.Click
        Me.Cache.Remove("AllPermits")
    End Sub

End Class