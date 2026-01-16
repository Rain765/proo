# 网页版文档校对工具

此工具为纯前端页面，可在其他电脑直接打开使用（无需安装），也可发布为在线网页。

## 如何在其他电脑打开

1. 将整个文件夹拷贝到目标电脑（包含 `index.html` 与 `vendor/`）。
2. 双击打开 `index.html` 即可使用。
3. 如果需要在局域网共享，可用简单静态服务启动（例如 `python -m http.server`）。

## 说明

- `vendor/` 内包含 docx/pdf 解析所需的离线脚本，确保无网络也可打开。
- 浏览器直接打开即可对比；如需更稳定的文件读取，建议用本地静态服务。

## 发布为在线网页

以下方式任选其一，发布后会得到一个公网链接：

### GitHub Pages

1. 新建仓库并上传整个目录（包含 `index.html` 和 `vendor/`）。
2. 进入仓库 Settings → Pages，Source 选择 `main` 分支根目录。
3. 保存后等待生成链接。

### Vercel

1. 打开 https://vercel.com ，选择导入该目录或仓库。
2. Framework 选择 `Other`，构建命令留空，输出目录留空。
3. 部署完成即可获得在线链接。

可选：若使用 Vercel CLI，可在根目录运行 `vercel`，首次部署后用 `vercel --prod` 发布正式链接。

### 一键部署到 Vercel

将下方链接中的 `YOUR_GITHUB_REPO_URL` 替换为你的仓库地址，即可生成一键部署按钮：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GITHUB_REPO_URL)

### Netlify

1. 打开 https://app.netlify.com ，选择 Deploy site。
2. 直接拖拽整个目录（包含 `index.html`）。
3. 部署完成即可获得在线链接。
