import { lookup } from "mime-types";
import { fetch as nativeFetch } from "@tauri-apps/plugin-http";

export const fetchFileWithMimeType = async (url: string): Promise<{ content: ArrayBuffer; mimeType: string }> => {
  const nowFetch = ["blob:", "asset:"].some((pre) => url.startsWith(pre)) ? fetch : nativeFetch;
  // 使用 fetch 来获取文件
  const response = await nowFetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch file from ${url}: ${response.statusText}`);
  }

  // 获取文件内容
  const content = await response.arrayBuffer();

  // 从响应头中获取 MIME 类型
  let mimeType = response.headers.get("Content-Type") || "";

  // 如果 MIME 类型为空，尝试从 URL 的扩展名获取
  if (!mimeType) {
    const extension = url.split(".").pop() || "";
    mimeType = lookup(extension) || "application/octet-stream";
  }

  return { content, mimeType };
};

export const pickFileBrowser = ({ multiple, accept }: { multiple: boolean; accept: string }) => {
  const input = document.createElement("input");
  input.multiple = multiple;
  input.type = "file";
  input.accept = accept;
  input.style.position = "fixed";
  // input.style.width = "0";
  // input.style.height = "0";
  // input.style.top = "-1000px";
  // input.style.left = "-1000px";
  // input.style.opacity = "0";
  const clean = () => {
    input.remove();
  };
  return new Promise<FileList>((resolve, reject) => {
    input.addEventListener("change", () => {
      const files = input.files;
      if (!files || files.length === 0) {
        reject();
        clean();
        return;
      }
      resolve(files);
      clean();
    });
    document.body.appendChild(input);
    input.click();
    // setTimeout(() => {
    //   clean();
    // }, 10);
  });
};
