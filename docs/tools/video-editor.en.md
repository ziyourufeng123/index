# Video Editing

## Functionality Overview

A lightweight online video editing tool that allows you to edit videos directly from your computer or mobile browser. It's completely free, open-source, requires no download or installation, no account registration, and won't add any watermarks to your work.

This is an online video editor built using Next.js, Remotion for real-time preview, and FFmpeg (WebAssembly port) for high-quality rendering.

## Features
🎞️ **Real-time Preview**: See instant previews of your edits.
🧰 **FFmpeg Rendering**: Renders using FFmpeg (WebAssembly port) with various options, supporting up to 1080p export.
🕹️ **Interactive Timeline Editor**: Precisely arrange, trim, and control media with a customizable timeline.
✂️ **Element Utilities**: Easily split, duplicate, and manage individual media layers.
🖼️ **Flexible Media Support**: Seamlessly import and mix video, audio tracks, images, and text elements.
🛠️ **Advanced Element Control**: Adjust properties like position, opacity, z-index, and volume for each element.
⌨️ **Keyboard Shortcuts**: Quickly play, mute, move through the timeline with arrows, split, duplicate, and more.

## How to Use

1.  **Import Video**: Drag and drop your video file onto the timeline, or import it via the file selector.
2.  **Clip and Splice**: Drag video clips on the timeline, use the trim tool to split or delete unwanted parts.
3.  **Add Elements**: You can add text, background music, transition effects, and more.
4.  **Export Video**: After finishing your edits, choose the export resolution, then render and download your video file.

## Installation
```
Clone the repo and install dependencies:

npm install
Then run the development server:

npm run dev
Or build and start in production mode:

npm run build
npm start
Alternatively, using Docker:

# Build the Docker image
docker build -t clipjs .

# Run the container
docker run -p 3000:3000 clipjs
Then navigate to http://localhost:3000
```
## Important Notes

-   Online editing of large or high-resolution video files may require high browser performance. It is recommended to use a modern browser and maintain a stable network connection.
-   All processing occurs locally in your browser; your video files are not uploaded to any server, ensuring privacy and security.

Edit your videos from your PC or phone, no downloads, no registration, no watermarks. Online, free, and open-source.

This deployment is for user online experience only. [Original Author's Repository](https://github.com/mohyware/clip-js)