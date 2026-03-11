<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="permit.aspx.vb" Inherits="permitsearch.gaepd.org.permit" %>

<!DOCTYPE html>
<html lang="en-us">
<head>
    <title>Georgia Air Permit Not Found</title>
    <script>
        (function (h, o, u, n, d) {
            h = h[d] = h[d] || { q: [], onReady: function (c) { h.q.push(c) } }
            d = o.createElement(u); d.async = 1; d.src = n; d.crossOrigin = ''
            n = o.getElementsByTagName(u)[0]; n.parentNode.insertBefore(d, n)
        })(window, document, 'script', 'https://www.datadoghq-browser-agent.com/us3/v6/datadog-rum.js', 'DD_RUM')
        window.DD_RUM.onReady(function () {
            window.DD_RUM.init({
                clientToken: '<%= ConfigurationManager.AppSettings("dd_clientToken") %>',
                applicationId: '<%= ConfigurationManager.AppSettings("dd_applicationId") %>',
                site: 'us3.datadoghq.com',
                service: 'permitsearch',
                env: '<%= ConfigurationManager.AppSettings("dd_env") %>',
                trackUserInteractions: true,
                sessionSampleRate: 100,
                sessionReplaySampleRate: 20,
                trackBfcacheViews: true,
                defaultPrivacyLevel: 'mask-user-input',
            });
        })
    </script>
</head>
<body>
    <h1>Permit file not found.</h1>
</body>
</html>
