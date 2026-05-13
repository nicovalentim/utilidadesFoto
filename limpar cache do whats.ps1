if (Get-Process chrome -ErrorAction SilentlyContinue) {
    Write-Error "Chrome está aberto, feche ele para rodar o programa."
    break
}

$ChromeProfile = "Default"
$BasePath = "$env:LOCALAPPDATA\Google\Chrome\User Data\$ChromeProfile"

$Targets = @(
    "$BasePath\IndexedDB\https_web.whatsapp.com_0.indexeddb.leveldb",
    "$BasePath\Service Worker\CacheStorage",
    "$BasePath\Service Worker\ScriptCache",
    "$BasePath\Cache",
    "$BasePath\Code Cache"
)

Write-Host "Starting cleanup for profile: $ChromeProfile" -ForegroundColor Cyan

foreach ($Path in $Targets) {
    if (Test-Path $Path) {
        try {
            Remove-Item $Path -Recurse -Force -ErrorAction Stop
        } catch {
            Write-Warning "Não conseguimos remover $Path. Pode ser que esteja bloqueado."
        }
    }
}

Write-Host "Limpeza completa."