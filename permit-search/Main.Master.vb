Public Class Main
    Inherits MasterPage

    Public ReadOnly Property CurrentEnvironment As String = ConfigurationManager.AppSettings("APP_ENVIRONMENT")

End Class