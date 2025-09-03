# ffmpeg Online Image and Video Conversion

## Functionality Overview

This tool wraps the powerful command-line utility FFmpeg into an easy-to-use online service. You no longer need to install and learn complex FFmpeg commands on your computer; you can now convert and process your image and video files online, supporting a vast array of formats and features.

## How to Use

1.  **Upload File**: Upload the video or image file you need to process.
2.  **Select Target Format**: Choose your desired output format from the dropdown menu (e.g., MP4, MOV, GIF, MP3, etc.).
3.  **Set Parameters**: In the advanced options, you can set parameters such as video resolution, bitrate, and audio quality.
4.  **Start Conversion**: Click the "Convert" button, and the server will process the file for you in the background.
5.  **Download Result**: Once processed, the page will provide a download link.

## Important Notes

-   File processing is performed client-side. All file operations occur within your browser, ensuring no privacy leakage. The speed of processing large files depends on your computer's performance.

This deployment is for user online experience only. [Original Author's Repository](https://github.com/Dinoosauro/ffmpeg-web/)

# ffmpeg-web

A Web and Desktop app interface for [ffmpeg-wasm](https://ffmpeg-web.netlify.app/): harness the power of ffmpeg directly in your web browser or on your computer to convert videos, audios, and images.

Try it here: https://ffmpeg-web.netlify.app/

**Want it faster than your browser? Run speed-of-light ffmpeg-web on your device with desktop ffmpeg and electron, Electron is only used as a renderer. Read the "Electron" section below for more details.**

[![Netlify Status](https://api.netlify.com/api/v1/badges/54deaa95-e730-4007-8037-0d878109e6da/deploy-status)](https://app.netlify.com/sites/ffmpeg-web/deploys)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Dinoosauro/ffmpeg-web)

## Feature Overview:

### Video and Audio Conversion

This tool supports converting video and audio files with multiple encoders, covering almost all common formats:

-   **Video content can be converted to**: H264 (MP4), H265 (MP4), VP9 (WebM), VP8* (WebM), Theora* (OGG), Windows Media Video* (WMV)
-   **Audio content can be converted to**: MP3, AAC (M4A), Vorbis (OGG), Opus (OGG), FLAC, ALAC, WAV, Windows Media Audio* (WMA)

Note: * You need to go to "Settings" to enable "Show uncommon codecs".

#### Merge Video and Audio Files

When encoding media files, select the "Copy Video" and "Copy Audio" tags to merge video and audio files (see "File Selection" for an important note).

#### Customize Media Size:

You can directly change the video/audio bitrate and other basic settings (like framerate, orientation, channels, etc.) through the interface.

#### Add Filters

You can add video and audio filters. Common filters (in my opinion) have a graphical interface, but you can also input any ffmpeg video filter configuration you want.

### Custom Commands

If you have an ffmpeg command you need to execute, you can input it in the "Custom Commands" section, and ffmpeg-web will execute it.

### Merge Media Files

If you have two or more video/audio files to merge, use this section. This feature will avoid re-encoding, so your media files will be instantly available.

### Edit Metadata

If you need to quickly edit metadata, there's a dedicated area here. You can choose from a large list of default metadata keys or create your own. After adding values, click "Add value". Select the file, and you can edit metadata without re-encoding.

### Image Conversion

Just like video and audio, ffmpeg-web can also convert images to various formats. You can also add some filters, similar to video filters.

**Note:** You can also use this tool to extract album covers from songs!

## File Selection

In the top right corner of the page, you can see a "File Selection" tab. Before that, make sure you have set all points correctly. Then, if you are converting media, you should look at how to manage multiple files by clicking the selection box below the title:

-   You can keep only the first file in the script
-   Add all files to the output file (`ffmpeg -i file1 -i file2 ... output`)
-   Keep files with the same name
    -   You can choose to keep only files with the same name as the first file, or execute the script for each combination of same names
-   Execute the same command for each selected file

## Content Trimming

ffmpeg-web allows you to trim content in multiple scenarios. You can choose to trim videos:

-   By providing the start and end times of the new video
-   By writing a list of timestamps with delimiters (e.g., very useful for trimming videos by chapters)

## Settings

You can change some settings in ffmpeg-web:

-   Change file download method
    -   Use File System API, normal download, or save everything as a ZIP file
-   Enable hardware acceleration (Electron only)
-   Create and change themes
-   Enable screensaver (and change its content)
-   Change notification duration
-   View open-source licenses

### Screensaver

If you plan to convert many files with ffmpeg-web, or a very large file, you might want to enable the screensaver option. It's a beautiful UI that you can customize with custom images, custom videos, or custom YouTube URLs, and you can see the progress and the file being converted (you can hide both if desired).

## Electron

You can run ffmpeg-web with native performance using Electron:

1.  Clone this repository (if you don't have git installed, you can [download the zip file](https://github.com/Dinoosauro/ffmpeg-web/archive/refs/heads/main.zip))
2.  Make sure Node.JS is installed. Minimum requirement: Node 20 LTS.
3.  Build the dist folder so you only need to download resources once, by typing `node BuildDist.cjs` in the command line.
4.  Finally, type `npm run electron` to open the Electron build. From now on, you only need to type this command to run ffmpeg-web.

### Differences between Electron and Web/Docker versions:

-   The Electron version is much faster because it relies on native ffmpeg instead of the WebAssembly version.
-   The Electron version provides hardware acceleration. Please note that currently only Apple and Intel hardware acceleration have been tested.
-   You can still use FFmpeg WebAssembly if you want, but this is much slower than native FFmpeg. Please note that when using the native version, you cannot create zip files.

## Dockerfile

You can also run ffmpeg-web in a Docker container. Clone the repository (or download the zip file), then build the image:

`docker build -t ffmpeg-web .`

After that, you can start the container. The exposed port is "80" for plain HTTP and "443" for HTTPS (see below for how to set this up). For example, to open ffmpeg-web at `http://localhost:3000`:

`docker run -p 127.0.0.1:3000:80 ffmpeg-web`

### Enable HTTPS:

You might want to enable HTTPS with a self-signed certificate. Since the Dockerfile uses an nginx server for deployment, you need to do the following:

-   In the `Dockerfile`, uncomment the `COPY` commands for the certificates. Replace the source paths with the paths to your certificate file and key.
-   In `nginx.conf`, uncomment `listen 443 ssl`. You don't need to replace anything.

Rebuild the image, and HTTPS should be set up.

## Privacy

All videos are processed locally and are not sent to any server. ffmpeg-web connects to:

-   Google Fonts: To get fonts (no other data is sent)
-   Unpkg: To get essential scripts that make ffmpeg-web work
-   Netlify: Hosting service

Please note, if you are using Microsoft Edge browser, you should disable "Enhance security for this site" in the HTTPS security symbol in the status bar. This will make ffmpeg encode media faster than before. After selecting the file, the conversion will start automatically. You can view the progress at the bottom of the page.

## Offline Use

You can install ffmpeg-web as a Progressive Web App (PWA) for offline use.