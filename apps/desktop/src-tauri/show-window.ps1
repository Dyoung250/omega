Add-Type @"
using System;
using System.Runtime.InteropServices;
public class WinAPI {
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
}
"@

$h = [WinAPI]::FindWindow($null, "FORGIA Ω — Editor 3D")
if ($h -ne [IntPtr]::Zero) {
    [WinAPI]::ShowWindow($h, 9)  # SW_RESTORE = 9
    [WinAPI]::SetForegroundWindow($h)
    Write-Host "Window activated"
} else {
    Write-Host "Window not found"
}
