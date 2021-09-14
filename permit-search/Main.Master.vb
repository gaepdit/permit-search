Public Class Main
    Inherits MasterPage

    Public ReadOnly Property RaygunApiKey = CType(ConfigurationManager.GetSection("RaygunSettings"), Mindscape.Raygun4Net.RaygunSettings).ApiKey
    Public ReadOnly Property CurrentEnvironment As String = ConfigurationManager.AppSettings("APP_ENVIRONMENT")

End Class