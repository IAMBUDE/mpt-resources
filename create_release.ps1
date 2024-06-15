# Define the base directories
$modsFolder = "$PSScriptRoot\Mods"
$releasesFolder = "$PSScriptRoot\Releases"
$updatesFolder = "$PSScriptRoot\Updates" # Define the updates folder

# Create a list to hold all needed directories
$requiredDirectories = @{}

# Get all mod directories
$modDirectories = Get-ChildItem -Path $modsFolder -Directory

# Process mod directories and add required directories for releases
foreach ($modDir in $modDirectories) {
    $items = Get-ChildItem -Path $modDir.FullName -Recurse -File
    foreach ($item in $items) {
        $relativePath = $item.FullName.Substring($modDir.FullName.Length)
        $destinationPath = Join-Path -Path $releasesFolder -ChildPath $relativePath
        $parentDir = Split-Path -Path $destinationPath -Parent
        $requiredDirectories[$parentDir] = $true
    }
}

# Process updates directories and add required directories for releases
foreach ($updateDir in (Get-ChildItem -Path $updatesFolder -Directory)) {
    $items = Get-ChildItem -Path $updateDir.FullName -Recurse -File
    foreach ($item in $items) {
        $relativePath = $item.FullName.Substring($updateDir.FullName.Length + 1) # Include the parent directory name
        $destinationPath = Join-Path -Path $releasesFolder -ChildPath $relativePath
        $parentDir = Split-Path -Path $destinationPath -Parent
        $requiredDirectories[$parentDir] = $true
    }
}

# Create required directories in the releases folder
$requiredDirectories.Keys | Sort-Object -Unique | ForEach-Object {
    if (-Not (Test-Path $_)) {
        New-Item -Path $_ -ItemType Directory -Force | Out-Null
    }
}

# Copy files from mod directories and verify
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
            Write-Output "Failed to copy file: $($item.FullName)"
            $allFilesCopiedSuccessfully = $false
        }
    }
    if ($allFilesCopiedSuccessfully) {
        $successfulMods += $modDir.Name
    }
}

# Copy files from updates directories and verify
$successfulUpdates = @()
foreach ($updateDir in (Get-ChildItem -Path $updatesFolder -Directory)) {
    $allFilesCopiedSuccessfully = $true
    $items = Get-ChildItem -Path $updateDir.FullName -Recurse -File
    foreach ($item in $items) {
        $relativePath = $item.FullName.Substring($updateDir.FullName.Length + 1) # Include the parent directory name
        $destinationPath = Join-Path -Path $releasesFolder -ChildPath $relativePath
        Copy-Item -Path $item.FullName -Destination $destinationPath -Force
        
        # Verify that the file was copied
        if (-Not (Test-Path $destinationPath)) {
            Write-Output "Failed to copy update file: $($item.FullName)"
            $allFilesCopiedSuccessfully = $false
        }
    }
    if ($allFilesCopiedSuccessfully) {
        $successfulUpdates += $updateDir.Name
    }
}

# Output the names of successfully copied mods and updates
if ($successfulMods.Count -gt 0 -or $successfulUpdates.Count -gt 0) {
    Write-Output "The following mod folders have been successfully merged into the releases folder:"
    $successfulMods | ForEach-Object { Write-Output $_ }
    
    if ($successfulUpdates.Count -gt 0) {
        Write-Output "The following updates have been successfully merged into the releases folder:"
        $successfulUpdates | ForEach-Object { Write-Output $_ }
    }
} else {
    Write-Output "No mods or updates were successfully copied."
}

Write-Output "Operation completed."