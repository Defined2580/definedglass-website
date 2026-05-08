# ============================================================
# Defined Glass Creations — Auto Gallery Sync
# Runs weekly via Windows Task Scheduler.
# Scans OneDrive folders, watermarks new images, removes
# deleted ones, rebuilds gallery-config.js, and pushes live.
# ============================================================

Add-Type -AssemblyName System.Drawing

$sourceBase = "C:\Users\ej\OneDrive - Defined Glass\Documents - Public\New Pictures 2026"
$destBase   = "C:\Users\ej\Documents\definedglass-website\public\images"
$logoPath   = "C:\Users\ej\Documents\definedglass-website\public\logo.png"
$configPath = "C:\Users\ej\Documents\definedglass-website\gallery-config.js"
$repoPath   = "C:\Users\ej\Documents\definedglass-website"
$logPath    = "C:\Users\ej\Documents\definedglass-gallery-sync.log"

function Log($msg) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm') | $msg"
    Add-Content $logPath $line
}

$categories = @(
    [PSCustomObject]@{ src="Shower Doors";       dest="shower-doors"; prefix="showerdoor"; cat="shower"   }
    [PSCustomObject]@{ src="Glass Railing";      dest="railings";     prefix="railing";    cat="railing"  }
    [PSCustomObject]@{ src="Office Partitions";  dest="office";       prefix="office";     cat="office"   }
    [PSCustomObject]@{ src="Exterior Solutions"; dest="exterior";     prefix="exterior";   cat="exterior" }
    [PSCustomObject]@{ src="Mirrors";            dest="mirrors";      prefix="mirror";     cat="mirror"   }
)

Log "=== Sync started ==="

# Setup watermark tools
$logo       = [System.Drawing.Image]::FromFile($logoPath)
$cm         = New-Object System.Drawing.Imaging.ColorMatrix
$cm.Matrix33 = 0.22
$attr       = New-Object System.Drawing.Imaging.ImageAttributes
$attr.SetColorMatrix($cm)
$jpegCodec  = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$jpegParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$jpegParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]88)

$anyChanges = $false
$allEntries = [System.Collections.Generic.List[PSCustomObject]]::new()

foreach ($cat in $categories) {
    $srcFolder  = Join-Path $sourceBase $cat.src
    $destFolder = Join-Path $destBase   $cat.dest

    $srcFiles  = Get-ChildItem $srcFolder  -File -ErrorAction SilentlyContinue |
                 Where-Object { $_.Extension -match '\.(jpg|jpeg|png)$' } |
                 Sort-Object Name -Descending   # newest OneDrive file = #1

    $destCount = (Get-ChildItem $destFolder -File -ErrorAction SilentlyContinue |
                  Where-Object { $_.Name -match '\.jpg$' }).Count

    if ($srcFiles.Count -ne $destCount) {
        Log "$($cat.src): $destCount on site, $($srcFiles.Count) in OneDrive — reprocessing"
        $anyChanges = $true

        # Clear dest folder and reprocess all source files
        Get-ChildItem $destFolder -File -ErrorAction SilentlyContinue | Remove-Item -Force

        $i = 1
        foreach ($file in $srcFiles) {
            $destPath = Join-Path $destFolder "$($cat.prefix)-$i.jpg"
            try {
                $img = [System.Drawing.Image]::FromFile($file.FullName)
                $ww  = [int]($img.Width  * 0.18)
                $wh  = [int]($logo.Height * ($ww / $logo.Width))
                $pad = [int]($img.Width  * 0.025)
                $wx  = $img.Width  - $ww  - $pad
                $wy  = $img.Height - $wh  - $pad
                $g   = [System.Drawing.Graphics]::FromImage($img)
                $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $g.DrawImage($logo, (New-Object System.Drawing.Rectangle($wx,$wy,$ww,$wh)),
                    0, 0, $logo.Width, $logo.Height, [System.Drawing.GraphicsUnit]::Pixel, $attr)
                $g.Dispose()
                $img.Save($destPath, $jpegCodec, $jpegParams)
                $img.Dispose()
                Log "  + $($cat.prefix)-$i.jpg"
            } catch {
                Log "  ERROR: $($file.Name) — $_"
            }
            $i++
        }
    } else {
        Log "$($cat.src): $($srcFiles.Count) images — no change"
    }

    # Collect entries for gallery-config.js
    Get-ChildItem $destFolder -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '\.jpg$' } |
        Sort-Object Name |
        ForEach-Object {
            $allEntries.Add([PSCustomObject]@{
                cat  = $cat.cat
                src  = "public/images/$($cat.dest)/$($_.Name)"
                name = $_.Name
            })
        }
}

$logo.Dispose()

if ($anyChanges) {
    Log "Rebuilding gallery-config.js..."

    $catOrder  = @('shower','mirror','railing','office','exterior')
    $catLabels = @{ shower='SHOWER DOORS'; mirror='MIRRORS'; railing='GLASS RAILINGS'; office='OFFICE PARTITIONS'; exterior='EXTERIOR SOLUTIONS' }

    $sb = [System.Text.StringBuilder]::new()
    $null = $sb.AppendLine("/*")
    $null = $sb.AppendLine("  ============================================================")
    $null = $sb.AppendLine("  DEFINED GLASS CREATIONS - GALLERY PHOTO LIST")
    $null = $sb.AppendLine("  Auto-synced on: $(Get-Date -Format 'yyyy-MM-dd')")
    $null = $sb.AppendLine("  ============================================================")
    $null = $sb.AppendLine("*/")
    $null = $sb.AppendLine("")
    $null = $sb.AppendLine("var GALLERY_PHOTOS = [")
    $null = $sb.AppendLine("")

    foreach ($c in $catOrder) {
        $entries = $allEntries | Where-Object { $_.cat -eq $c }
        $null = $sb.AppendLine("  // -- $($catLabels[$c])")
        if ($entries.Count -eq 0) {
            $null = $sb.AppendLine("  // (no photos yet)")
        } else {
            foreach ($e in $entries) {
                $null = $sb.AppendLine("  { src: '$($e.src)', cat: '$($e.cat)', alt: '$($e.cat) photo' },")
            }
        }
        $null = $sb.AppendLine("")
    }

    $null = $sb.AppendLine("];")
    [System.IO.File]::WriteAllText($configPath, $sb.ToString(), [System.Text.Encoding]::UTF8)

    # Git push
    Set-Location $repoPath
    git add -A 2>&1 | ForEach-Object { Log $_ }
    git commit -m "Auto-sync $(Get-Date -Format 'yyyy-MM-dd'): gallery updated" 2>&1 | ForEach-Object { Log $_ }
    git push origin main 2>&1 | ForEach-Object { Log $_ }
    Log "Pushed to GitHub successfully."
} else {
    Log "No changes — nothing to push."
}

Log "=== Sync complete ==="
