Imports System.Data.SqlClient

Module PermitSearch

    Public Function GetPermits(currentPageIndex As Integer, pageSize As Integer,
                               airs As String, name As String, permit As String) As DataTable

        Dim query As String =
            "select ApplicationNumber, AIRSNumber, FacilityName, PermitNumber, 
               IssuanceDate, FileType, VNarrative, VFinal, PSDAppSum,PSDPrelim,
               PSDNarrative, PSDFinalDet, PSDFinal, OtherNarrative, OtherPermit
            from dbo.VW_GA_PERMITS
            where AIRSNumber like concat('%', @airs, '%')
              and FacilityName like concat('%', @name, '%')
              and PermitNumber like concat('%', @permit, '%')
            order by AIRSNumber, IssuanceDate, ApplicationNumber
            offset @skip rows fetch Next @take rows only"

        Dim parameterArray As SqlParameter() = {
            New SqlParameter("@airs", airs.TrimEnd({" "c, ";"c})),
            New SqlParameter("@name", name.TrimEnd({" "c, ";"c})),
            New SqlParameter("@permit", permit),
            New SqlParameter("@skip", currentPageIndex * pageSize),
            New SqlParameter("@take", pageSize)
        }

        Dim connectionString As String = ConfigurationManager.ConnectionStrings("SqlConnectionString").ConnectionString

        Using connection As New SqlConnection(connectionString)
            Using command As New SqlCommand(query, connection)
                command.CommandType = CommandType.Text
                command.Parameters.AddRange(parameterArray)

                Dim dataTable As DataTable = New DataTable("Permits")

                Using adapter As New SqlDataAdapter(command)
                    adapter.Fill(dataTable)
                End Using

                command.Parameters.Clear()
                Return dataTable
            End Using
        End Using
    End Function


    Public Function GetPermitsCount(airs As String, name As String, permit As String) As Integer

        Dim query As String =
            "Select count(*)
            from dbo.VW_GA_PERMITS
            where AIRSNumber like concat('%', @airs, '%')
              and FacilityName like concat('%', @name, '%')
              and PermitNumber like concat('%', @permit, '%')"

        Dim parameterArray As SqlParameter() = {
            New SqlParameter("@airs", airs.TrimEnd({" "c, ";"c})),
            New SqlParameter("@name", name.TrimEnd({" "c, ";"c})),
            New SqlParameter("@permit", permit)
        }

        Dim connectionString As String = ConfigurationManager.ConnectionStrings("SqlConnectionString").ConnectionString

        Using connection As New SqlConnection(connectionString)
            Using command As New SqlCommand(query, connection)
                command.CommandType = CommandType.Text
                command.Parameters.AddRange(parameterArray)
                command.Connection.Open()
                Dim result As Integer = command.ExecuteScalar()
                command.Connection.Close()
                command.Parameters.Clear()

                Return result
            End Using
        End Using
    End Function

End Module
