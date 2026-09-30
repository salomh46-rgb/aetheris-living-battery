Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$icoPath = Join-Path $PSScriptRoot "resources\tray.ico"
$serverPath = Join-Path $PSScriptRoot "server.cjs"
$port = 3456

# 1. Ichki serverni tekshirish va ishga tushirish
function Ensure-Server {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if (-not $conn) {
        Start-Process "node" -ArgumentList "`"$serverPath`"" -WindowStyle Hidden
        Start-Sleep -Milliseconds 600
    }
}

# 2. Aetheris Popover oynasini ochish
function Open-Aetheris {
    Ensure-Server
    # Ekran o'lchami bo'yicha pastki o'ng burchak pozitsiyasi
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
    $width = 390
    $height = 670
    $posX = $screen.Right - $width - 12
    $posY = $screen.Bottom - $height - 8

    # Edge App rejimida pastki o'ng burchakda ochish
    $args = "--app=http://127.0.0.1:$port/ --window-size=$width,$height --window-position=$posX,$posY"
    Start-Process "msedge.exe" -ArgumentList $args
}

# 3. Tray ikonkasi (2-rasmdagi Taskbar hududida)
if (Test-Path $icoPath) {
    $icon = New-Object System.Drawing.Icon($icoPath)
} else {
    $icon = [System.Drawing.SystemIcons]::Application
}

$tray = New-Object System.Windows.Forms.NotifyIcon
$tray.Icon = $icon
$tray.Text = "Aetheris - Kvant Batareykasi (Bosing)"
$tray.Visible = $true

# Batareykaga bosilganda (Left Click)
$tray.Add_Click({
    if ($_.Button -eq [System.Windows.Forms.MouseButtons]::Left) {
        Open-Aetheris
    }
})

# O'ng tugma menyusi (Right Click)
$menu = New-Object System.Windows.Forms.ContextMenuStrip

$openItem = $menu.Items.Add("🌿 Kvant Batareyasini Ochish")
$openItem.Font = New-Object System.Drawing.Font($menu.Font, [System.Drawing.FontStyle]::Bold)
$openItem.Add_Click({ Open-Aetheris })

$sep = $menu.Items.Add("-")

$exitItem = $menu.Items.Add("Chiqish")
$exitItem.Add_Click({
    $tray.Visible = $false
    [System.Windows.Forms.Application]::Exit()
})

$tray.ContextMenuStrip = $menu

# 4. Bildirishnoma (Balon)
$tray.BalloonTipTitle = "Aetheris Faol"
$tray.BalloonTipText = "Kvant Batareyasi Taskbarga qo'shildi. Oynani ko'rish uchun batareykaga bosing!"
$tray.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Info
$tray.ShowBalloonTip(2000)

# Dastlab bir marta oynani ko'rsatamiz
Open-Aetheris

# Windows form hodisalar sikli
[System.Windows.Forms.Application]::Run()
