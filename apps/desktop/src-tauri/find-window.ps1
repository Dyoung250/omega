$proc = Get-Process | Where-Object { $_.ProcessName -eq 'forgia-desktop' }
if ($proc) {
    Write-Host "PID: $($proc.Id)"
    Write-Host "MainWindowHandle: $($proc.MainWindowHandle)"
    Write-Host "MainWindowTitle: $($proc.MainWindowTitle)"
    Write-Host "Responding: $($proc.Responding)"
    if ($proc.MainWindowHandle -ne 0) {
        $ws = New-Object -ComObject WScript.Shell
        $ws.AppActivate($proc.Id)
        Write-Host "Activated via WScript.Shell"
    }
} else {
    Write-Host "Process not found"
}
