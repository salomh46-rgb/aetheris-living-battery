Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
strPath = fso.GetParentFolderName(WScript.ScriptFullName)

WshShell.CurrentDirectory = strPath

' 1. Server ishlamayotgan bo'lsa fonda ishga tushirish
WshShell.Run "powershell -WindowStyle Hidden -Command ""if (!(Get-NetTCPConnection -LocalPort 3456 -ErrorAction SilentlyContinue)) { Start-Process node -ArgumentList 'server.cjs' -WindowStyle Hidden; Start-Sleep -Milliseconds 600 }; powershell -ExecutionPolicy Bypass -File launch_tray_pos.ps1""", 0, False
