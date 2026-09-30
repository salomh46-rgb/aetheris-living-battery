$paths = @(
    [System.Environment]::GetFolderPath('Desktop'),
    'C:\Users\salom\Desktop',
    'C:\Users\salom\OneDrive\Desktop'
) | Select-Object -Unique

$wsh = New-Object -ComObject WScript.Shell
$vbsPath = 'D:\ALLProjects\aetheris\start_silent.vbs'
$iconPath = 'D:\ALLProjects\aetheris\resources\tray.ico'

foreach ($p in $paths) {
    if (Test-Path $p) {
        $shortcutPath = Join-Path $p "Aetheris Batareyka.lnk"
        $shortcut = $wsh.CreateShortcut($shortcutPath)
        $shortcut.TargetPath = "wscript.exe"
        $shortcut.Arguments = "`"$vbsPath`""
        $shortcut.WorkingDirectory = "D:\ALLProjects\aetheris"
        $shortcut.IconLocation = "$iconPath,0"
        $shortcut.Description = "Aetheris - Living Battery & System Biome"
        $shortcut.Save()
        Write-Output "Yorliq yaratildi: $shortcutPath"
    }
}
