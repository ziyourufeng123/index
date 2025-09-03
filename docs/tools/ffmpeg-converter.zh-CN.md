# ffmpeg在线图像视频转换

## 功能简介

本工具将强大的命令行工具FFmpeg封装为简单易用的在线服务。您无需在电脑上安装和学习复杂的FFmpeg命令，即可在线转换和处理您的图像与视频文件，它支持海量的格式和功能。

## 如何使用

1.  **上传文件**: 上传您需要处理的视频或图像文件。
2.  **选择目标格式**: 从下拉菜单中选择您希望转换成的格式（如MP4, MOV, GIF, MP3等）。
3.  **设定参数**: 在高级选项中，您可以设定视频分辨率、比特率、音频质量等参数。
4.  **开始转换**: 点击“转换”按钮，服务器将在后台为您处理文件。
5.  **下载结果**: 处理完成后，页面会提供下载链接。

## 注意事项

- 文件处理在客户端进行，所有文件处理都在您的浏览器中完成，不存在隐私泄露的问题。处理大文件速度取决于您电脑的性能。


此处仅部署提供用户在线体验，[原作者仓库](https://github.com/Dinoosauro/ffmpeg-web/)

# ffmpeg-web

一个用于 [ffmpeg-wasm](https://ffmpeg-web.netlify.app/) 的 Web 和桌面应用界面：利用 ffmpeg 的强大功能，直接在您的网络浏览器或电脑上转换视频、音频和图像。

前往体验：https://ffmpeg-web.netlify.app/

**想要比浏览器更快？使用桌面版 ffmpeg 和 Electron 在您的设备上全速运行 ffmpeg-web，Electron 仅作为渲染器。更多详情请阅读下方的“Electron”部分。**

[![Netlify 状态](https://api.netlify.com/api/v1/badges/54deaa95-e730-4007-8037-0d878109e6da/deploy-status)](https://app.netlify.com/sites/ffmpeg-web/deploys)
[![部署到 Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Dinoosauro/ffmpeg-web)

## 功能概览：

### 视频和音频转换

本工具支持用多种编码器转换视频和音频文件，几乎涵盖所有常见格式：

- **视频内容可转换到**：H264 (MP4)、H265 (MP4)、VP9 (WebM)、VP8* (WebM)、Theora* (OGG)、Windows Media Video* (WMV)
- **音频内容可转换到**：MP3、AAC (M4A)、Vorbis (OGG)、Opus (OGG)、FLAC、ALAC、WAV、Windows Media Audio* (WMA)

注意：* 您需要前往“设置”中启用“显示不常用编解码器”。

#### 合并视频和音频文件

在编码媒体文件时，选择“复制视频”和“复制音频”标签即可合并视频和音频文件（请参阅“选择文件”部分的重要提示）。

#### 自定义媒体大小：

您可以通过界面直接更改视频/音频的比特率以及其他基本设置（如帧率、方向、声道等）。



#### 添加滤镜

您可以添加视频和音频滤镜。常见的滤镜（我认为）都有图形界面，但您也可以输入任何您想要的 ffmpeg 视频滤镜配置。

### 自定义命令

如果您有需要执行的 ffmpeg 命令，可以在“自定义命令”部分输入，然后 ffmpeg-web 将执行该命令。



### 合并媒体文件

如果您有两个或更多视频/音频文件需要合并，请使用此部分。本功能将避免重新编码，因此您的媒体文件将即时可用。



### 编辑元数据

如果您需要快速编辑元数据，这里有一个专门的区域。您可以从大量的默认元数据键中选择，也可以创建自己的键。添加数值后，点击“添加数值”。选择文件，无需重新编码即可编辑元数据。



### 图像转换

与视频和音频一样，ffmpeg-web 也可以将图像转换为多种格式。您还可以添加一些滤镜，与视频滤镜相同。

**注意：** 您也可以使用此工具提取歌曲的专辑封面！

## 文件选择

在页面右上角，您可以看到一个“文件选择”选项卡。在此之前，请确保您已正确设置了所有要点。然后，如果您正在转换媒体，您应该查看管理多个文件的方式，方法是点击标题下方的选择框：

- 您可以只保留脚本中的第一个文件
- 将所有文件添加到输出文件(`ffmpeg -i file1 -i file2 ... output`)中
- 保留同名文件
  - 您可以选择只保留与第一个文件同名的文件，或者对每种同名组合执行脚本
- 对每个选定的文件执行相同的命令

## 内容剪辑

ffmpeg-web 允许您在多种情况下进行内容剪辑。您可以选择剪辑视频：

- 提供新视频的开始和结束时间
- 编写带有分隔符的时间戳列表（例如：用于按章节剪辑视频时非常有用）


## 设置

您可以在 ffmpeg-web 中更改一些设置：

- 更改文件下载方式
  - 使用文件系统 API、普通下载或将所有内容保存为 ZIP 文件
- 启用硬件加速（仅限 Electron）
- 创建和更改主题
- 启用屏幕保护程序（并更改其内容）
- 更改通知持续时间
- 查看开源许可证

### 屏幕保护程序

如果您计划使用 ffmpeg-web 转换大量文件，或者转换一个非常大的文件，您可能希望启用屏幕保护程序选项。它是一个美观的 UI，您可以使用自定义图像、自定义视频或自定义 YouTube URL 来自定义它，并且您可以查看进度和正在转换的文件（如果需要，您可以隐藏这两项）。



## Electron

您可以使用 Electron 以原生性能运行 ffmpeg-web：

1. 克隆此仓库（如果您没有安装 git，可以[下载 zip 文件](https://github.com/Dinoosauro/ffmpeg-web/archive/refs/heads/main.zip)）
2. 确保已安装 Node.JS。最低要求：Node 20 LTS。
3. 构建 dist 文件夹，这样您只需要下载一次资源，在命令行中输入`node BuildDist.cjs`
4. 最后，输入`npm run electron`打开 Electron 构建。从现在开始，您只需输入此命令即可运行 ffmpeg-web。

### Electron 与 Web/Docker 版本的区别：

- Electron 版本速度快得多，因为它依赖于原生 ffmpeg 而不是 WebAssembly 版本
- Electron 版本提供硬件加速功能。请注意，目前只测试了 Apple 和 Intel 硬件加速
- 如果您愿意，仍然可以使用 FFmpeg WebAssembly，但这比原生 FFmpeg 慢得多。请注意，在使用原生版本时，无法创建 zip 文件。

## Dockerfile

您也可以在 Docker 容器中运行 ffmpeg-web。克隆仓库（或下载 zip 文件），然后构建镜像：

`docker build -t ffmpeg-web .`

之后，您可以启动容器。暴露的端口是“80”用于普通 HTTP， “443”用于 HTTPS（请参阅下文如何设置）。例如，要在 `http://localhost:3000` 打开 ffmpeg-web：

`docker run -p 127.0.0.1:3000:80 ffmpeg-web`

### 启用HTTPS：

您可能希望使用自签名证书启用 HTTPS。由于 Dockerfile 使用 nginx 服务器进行部署，您需要执行以下操作：

- 在 `Dockerfile` 中，取消对证书的 `COPY` 命令的注释。将源路径替换为您的证书文件和密钥的路径。
- 在 `nginx.conf` 中，取消对 `listen 443 ssl` 的注释。您不需要替换任何内容。

重新构建镜像，HTTPS 就应该设置好了。

## 隐私

所有视频都在本地处理，不会发送到任何服务器。ffmpeg-web 连接到：

- Google Fonts：获取字体（不发送其他数据）
- Unpkg：获取使 ffmpeg-web 正常工作的基本脚本
- Netlify：托管服务

请注意，如果您使用的是 Microsoft Edge 浏览器，您应该在状态栏的 HTTPS 安全符号中禁用“增强此网站的安全性”。这样，ffmpeg 将比以前更快地编码媒体。选择文件后，转换将自动开始。您可以在页面底部查看进度。

## 离线使用

您可以将 ffmpeg-web 作为渐进式网络应用 (PWA) 安装，以便离线使用。