$styles = Join-Path $PSScriptRoot '..\css\styles.css'
$bridge = Join-Path $PSScriptRoot '..\css\bridge.css'
$utf8 = New-Object System.Text.UTF8Encoding $false
$content = [IO.File]::ReadAllText($styles)
$marker = '/* Maps existing HTML class names to Calmyra dark gold/sage theme */'
$idx = $content.IndexOf($marker)
if ($idx -ge 0) {
    $content = $content.Substring(0, $idx).TrimEnd()
}
$bridgeText = [IO.File]::ReadAllText($bridge)
[IO.File]::WriteAllText($styles, ($content + "`n`n" + $bridgeText), $utf8)
Write-Host 'Bridge re-appended to styles.css'
