Public Class MasterPage
    Inherits UI.MasterPage

    Public ReadOnly Property RaygunApiKey = CType(ConfigurationManager.GetSection("RaygunSettings"), Mindscape.Raygun4Net.RaygunSettings).ApiKey

End Class