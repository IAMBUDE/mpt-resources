# Define the base directories
$modsFolder = "Mods"
$releasesFolder = "Releases"

# Create a list to hold all needed directories
$requiredDirectories = @{}

# Get all mod directories
$modDirectories = Get-ChildItem -Path $modsFolder -Directory

# Create directories
foreach ($modDir in $modDirectories) {
    $items = Get-ChildItem -Path $modDir.FullName -Recurse -File
    foreach ($item in $items) {
        $relativePath = $item.FullName.Substring($modDir.FullName.Length)
        $destinationPath = Join-Path -Path $releasesFolder -ChildPath $relativePath
        $parentDir = Split-Path -Path $destinationPath -Parent
        $requiredDirectories[$parentDir] = $true
    }
}

$requiredDirectories.Keys | Sort-Object -Unique | ForEach-Object {
    if (-Not (Test-Path $_)) {
        New-Item -Path $_ -ItemType Directory -Force | Out-Null
    }
}

# Copy files and verify
$successfulMods = @()
foreach ($modDir in $modDirectories) {
    $allFilesCopiedSuccessfully = $true
    $items = Get-ChildItem -Path $modDir.FullName -Recurse -File
    foreach ($item in $items) {
        $relativePath = $item.FullName.Substring($modDir.FullName.Length)
        $destinationPath = Join-Path -Path $releasesFolder -ChildPath $relativePath
        Copy-Item -Path $item.FullName -Destination $destinationPath -Force
        
        # Verify that the file was copied
        if (-Not (Test-Path $destinationPath)) {
            Write-Output "Failed to copy file: $item.FullName"
            $allFilesCopiedSuccessfully = $false
        }
    }
    if ($allFilesCopiedSuccessfully) {
        $successfulMods += $modDir.Name
    }
}

# Output the names of successfully copied mods
if ($successfulMods.Count -gt 0) {
    Write-Output "The following mod folders have been successfully merged into the releases folder:"
    $successfulMods | ForEach-Object { Write-Output $_ }
} else {
    Write-Output "No mods were successfully copied."
}

Write-Output "Operation completed."
