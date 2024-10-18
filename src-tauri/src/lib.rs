// src-tauri/src/main.rs
use id3::{frame::Lyrics, frame::Picture, frame::PictureType, Tag, TagLike};
use std::io::Cursor;
use tauri::{Manager, State};

// 定义一个结构体来接收 TypeScript 传入的metadata和文件数据
#[derive(serde::Deserialize)]
struct Metadata {
    title: Option<String>,
    artist: Option<String>,
    album: Option<String>,
    year: Option<String>,
    lyrics: Option<String>,
}

#[derive(serde::Deserialize)]
struct MetadataPayload {
    file_data: Vec<u8>,          // MP3 文件的二进制数据
    metadata: Metadata,          // metadata 信息
    cover_data: Option<Vec<u8>>, // 可选的图片封面数据
}

#[tauri::command]
async fn update_metadata(payload: MetadataPayload) -> Result<Vec<u8>, String> {
    let MetadataPayload {
        file_data,
        metadata,
        cover_data,
    } = payload;

    // 使用 Cursor 包装传入的文件数据作为输入
    let mut tag = match Tag::read_from2(Cursor::new(&file_data)) {
        Ok(t) => t,
        Err(e) => return Err(format!("Failed to read tag: {}", e)),
    };

    // 更新metadata
    if let Some(title) = metadata.title {
        tag.set_title(title);
    }
    if let Some(artist) = metadata.artist {
        tag.set_artist(artist);
    }
    if let Some(album) = metadata.album {
        tag.set_album(album);
    }
    if let Some(year) = metadata.year {
        tag.set_year(year.parse::<i32>().unwrap_or(0));
    }
    if let Some(lyrics) = metadata.lyrics {
        tag.add_frame(Lyrics {
            lang: "eng".to_string(),
            description: "".to_string(),
            text: lyrics,
        });
    }

    // 如果传入了封面图片，则更新封面图片
    if let Some(cover) = cover_data {
        let picture = Picture {
            mime_type: "image/jpeg".to_string(), // 假设图片是 JPEG 格式，可以根据需求更改
            picture_type: PictureType::CoverFront,
            description: "".to_string(),
            data: cover,
        };
        tag.add_frame(picture);
    }

    // 将修改后的文件数据写入 Vec<u8>
    let mut output_data: Vec<u8> = Vec::new();
    if let Err(e) = tag.write_to(&mut output_data, id3::Version::Id3v24) {
        return Err(format!("Failed to write tag: {}", e));
    }

    Ok(output_data) // 返回修改后的 MP3 数据
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![update_metadata])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
