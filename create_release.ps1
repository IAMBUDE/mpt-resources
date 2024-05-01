# Define the base directories
$modsFolder = "Mods"
$releasesFolder = "Releases"

# Get all mod directories
$modDirectories = Get-ChildItem -Path $modsFolder -Directory

foreach ($modDir in $modDirectories) {
    # Get all files and folders recursively within each mod directory
    $items = Get-ChildItem -Path $modDir.FullName -Recurse
    
    foreach ($item in $items) {
        # Determine the relative path from the mod folder
        $relativePath = $item.FullName.Substring($modDir.FullName.Length)

        # Set the full destination path
        $destinationPath = Join-Path -Path $releasesFolder -ChildPath $relativePath

        # Check if the item is a directory or a file and create directories if needed
        if ($item -is [System.IO.DirectoryInfo]) {
            if (-Not (Test-Path -Path $destinationPath)) {
                New-Item -Path $destinationPath -ItemType Directory
            }
        } else {
            # Ensure the destination directory exists before copying files
            $destinationDir = Split-Path -Path $destinationPath -Parent
            if (-Not (Test-Path -Path $destinationDir)) {
                New-Item -Path $destinationDir -ItemType Directory
            }

            # Copy the file, overwriting existing files
            Copy-Item -Path $item.FullName -Destination $destinationPath -Force
        }
    }
}

Write-Output "All mods have been successfully merged into the releases folder."
