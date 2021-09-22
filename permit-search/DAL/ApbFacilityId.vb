Public Class ApbFacilityId

    Private Const AirsNumberPattern As String = "^(04-?13-?)?\d{3}-?\d{5}$"

    ''' <summary>
    ''' APB facility ID as an eight-character string in the form "00000000"
    ''' </summary>
    Public ReadOnly Property ShortString As String

    Public Sub New(airsNumber As String)
        If Not IsValidAirsNumberFormat(airsNumber) Then
            Throw New ArgumentException(String.Format("{0} is not a valid AIRS number.", airsNumber))
        End If

        ShortString = GetNormalizedAirsNumber(airsNumber)
    End Sub

    ''' <summary>
    ''' Returns APB facility ID as a nine-character string in the form "000-00000"
    ''' </summary>
    Public ReadOnly Property FormattedString As String
        Get
            Return CountySubstring & "-" & ShortString.Substring(3, 5)
        End Get
    End Property

    ''' <summary>
    ''' Returns county substring as a 3-character string 
    ''' </summary>
    Private ReadOnly Property CountySubstring As String
        Get
            Return ShortString.Substring(0, 3)
        End Get
    End Property

    ''' <summary>
    ''' Determines whether a string is in the format of a valid AIRS number.
    ''' </summary>
    ''' <param name="airsNumber">The string to test</param>
    ''' <returns>True if airsNumber is valid; otherwise, False.</returns>
    ''' <remarks>Valid AIRS numbers are in the form 000-00000 or 04-13-000-0000 (with or without the dashes)</remarks>
    Public Shared Function IsValidAirsNumberFormat(airsNumber As String) As Boolean
        If airsNumber Is Nothing Then Return False

        Return Regex.IsMatch(airsNumber, AirsNumberPattern)
    End Function

    ''' <summary>
    ''' Converts a string representation of an AIRS number to the "00000000" form.
    ''' </summary>
    ''' <param name="airsNumber">The AIRS number to convert.</param>
    ''' <returns>A string representation of an AIRS number in the form "00000000".</returns>
    Private Shared Function GetNormalizedAirsNumber(airsNumber As String) As String
        ' Converts a string representation of an AIRS number to the "00000000" form 
        ' (eight numerals, no dashes).

        ' Remove spaces, dashes, and leading '0413'
        airsNumber = airsNumber.Replace("-", "").Replace(" ", "")

        If airsNumber.Length = 12 Then airsNumber = airsNumber.Remove(0, 4)

        Return airsNumber
    End Function

End Class
