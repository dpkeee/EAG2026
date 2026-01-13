# PowerShell script to create simple icon files for Chrome extension
# Requires .NET Framework

Add-Type -AssemblyName System.Drawing

function Create-Icon {
    param(
        [int]$Size,
        [string]$FileName
    )
    
    # Create a bitmap
    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Set high quality
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    # Fill with blue background
    $blueBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(33, 150, 243))
    $graphics.FillRectangle($blueBrush, 0, 0, $Size, $Size)
    
    # Draw white circle
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $margin = [int]($Size / 8)
    $graphics.FillEllipse($whiteBrush, $margin, $margin, $Size - 2*$margin, $Size - 2*$margin)
    
    # Draw text "FA"
    $font = New-Object System.Drawing.Font("Arial", [int]($Size / 2.5), [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(33, 150, 243))
    $text = "FA"
    $textSize = $graphics.MeasureString($text, $font)
    $x = ($Size - $textSize.Width) / 2
    $y = ($Size - $textSize.Height) / 2
    $graphics.DrawString($text, $font, $textBrush, $x, $y)
    
    # Save as PNG
    $bitmap.Save($FileName, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Clean up
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Created $FileName ($Size x $Size)"
}

# Create all three icon sizes
Write-Host "Creating Chrome extension icons..."
Create-Icon -Size 16 -FileName "icon16.png"
Create-Icon -Size 48 -FileName "icon48.png"
Create-Icon -Size 128 -FileName "icon128.png"

Write-Host "`nAll icons created successfully!"

