<?php
$exclude = ['vendor', 'node_modules','zipper.php','.htaccess','.env','.git']; // files/folders to skip
$zipFile = 'backup_' . date('Y-m-d_H-i-s') . '.zip';
$zip = new ZipArchive();

if ($zip->open($zipFile, ZipArchive::CREATE) !== TRUE) {
    exit("Cannot open <$zipFile>\n");
}

function addFiles($folder, $zip, $exclude, $base = '') {
    $items = scandir($folder);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..' || in_array($item, $exclude)) continue;
        $path = "$folder/$item";
        $localPath = "$base$item";

        if (is_dir($path)) {
            addFiles($path, $zip, $exclude, "$localPath/");
        } else {
            $zip->addFile($path, $localPath);
        }
    }
}

addFiles('.', $zip, $exclude);
$zip->close();

echo "✅ Archived to $zipFile\n";
?>
