Imports System.Web.Routing

Public Class Global_asax
    Inherits HttpApplication

    Private Sub Application_Start(ByVal sender As Object, ByVal e As EventArgs)
        RegisterRoutes(RouteTable.Routes)
    End Sub

    Private Shared Sub RegisterRoutes(routes As RouteCollection)
        routes.MapPageRoute("Permit", "Permit/{Id}", "~/Permit.aspx")
        routes.MapPageRoute("AirsNumber", "AirsNumber/{Id}", "~/Default.aspx")
    End Sub

End Class
