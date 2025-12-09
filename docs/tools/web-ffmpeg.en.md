# OmniConvert AI - All-in-One Media Converter

## Introduction

OmniConvert AI is a next-generation online media processing tool based on WebAssembly (FFmpeg) and Google Gemini AI. It not only supports traditional format conversions but also allows users to manipulate video and audio using natural language (e.g., "Make the video black and white and speed it up by 2x"), without needing to master complex command-line arguments. All processing is done locally in your browser, protecting your privacy.

## Key Features

-   **AI Smart Commands**: Integrated with Gemini AI to understand your natural language requests and automatically generate FFmpeg commands.
-   **Local Processing**: Powered by WebAssembly technology, files are converted directly in your local browser without uploading to a server, ensuring security and speed.
-   **Versatile Format Support**: Supports various common media formats including MP4, WebM, MP3, WAV, GIF, JPG, PNG, and more.
-   **Visual Preview**: Real-time preview of the converted video or image results.
-   **Custom Control**: Advanced users can directly edit FFmpeg parameters for unlimited possibilities.

## How to Use

1.  **Upload File**: Click the upload area or drag and drop a file (video, audio, or image) onto the page.
2.  **Select Mode**:
    -   **Preset Tools**: Click on the quick cards on the left (e.g., "Mute", "Compress", "Convert to GIF").
    -   **AI Lab**: Switch to the AI tab, enter your request (e.g., "Extract audio and save as mp3"), and click "Analyze & Execute".
3.  **Configure API Key (AI Mode)**: When using the AI feature for the first time, you need to enter your Google Gemini API Key (saved locally only).
4.  **Start Processing**: Confirm the task and click "Start Processing", then wait for the conversion to complete.
5.  **Download Result**: Preview and download your file after conversion is finished.

## Notes

-   Since it uses local browser computing power, processing large video files (>500MB) may consume significant memory. It is recommended to use on a desktop computer.
-   The AI feature requires a network environment that can connect to the Google Gemini API.
