import { lookup } from "mime-types";
import { fetch as nativeFetch } from '@tauri-apps/plugin-http';
import { invoke } from "@tauri-apps/api/core";

export const fetchFileWithMimeType = async (url: string): Promise<{ content: ArrayBuffer; mimeType: string }> => {
    const nowFetch = url.startsWith('blob:') ? fetch :nativeFetch
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


export function downloadFile(blob: Blob, fileName: string) {
    // 创建一个 URL 对象，指向 Blob 数据
    const url = URL.createObjectURL(blob);
    
    // 创建一个 a 标签用于下载
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // 设置下载的文件名
    
    // 将 a 标签插入到页面并触发点击事件
    document.body.appendChild(a);
    a.click();
    
    // 下载完成后移除 URL 和 a 标签
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // 释放 Blob URL
    }, 0);
  }
  

  interface Metadata {
    title?: string;
    artist?: string;
    album?: string;
    year?: string;
    lyrics?: string;
  }
  
  export const updateMetadata = async (fileBuffer:ArrayBuffer,metadata:Metadata,coverBuffer:ArrayBuffer) => {
    const fileData = Array.from(new Uint8Array(fileBuffer))
    console.log(fileData,"fildata")
    const response = await invoke<ArrayBuffer>('update_metadata', {
        payload: {
          file_data: fileData,
          metadata:{
            title:undefined,
            artist:undefined,
            album:undefined,
            year:undefined,
            lyrics:undefined,
            ...metadata
          },
          cover_data: coverBuffer ? Array.from(new Uint8Array(coverBuffer)) : null,
        },
      });
      const blob = new Blob([new Uint8Array(response)]);
      return blob
  };