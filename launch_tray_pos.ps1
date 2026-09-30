Add-Type -AssemblyName System.Windows.Forms
$screen = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
$width = 415
$height = 680
$posX = $screen.Right - $width - 10
$posY = $screen.Bottom - $height - 10

$profileDir = Join-Path $PSScriptRoot ".app_profile"
$arg = "--app=http://127.0.0.1:3456/ --window-size=$width,$height --window-position=$posX,$posY --user-data-dir=`"$profileDir`""

Start-Process "msedge.exe" -ArgumentList $arg
