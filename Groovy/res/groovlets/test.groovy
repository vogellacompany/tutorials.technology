html.html
{
    head
    {
        title 'First Groovlet'
    }
    body
    {
        h1 'Response from the Groovlet page'
        p   "HTTP Method: ${request.getMethod()}"
        p   "Context Path: ${request.getContextPath()}"
    }
}