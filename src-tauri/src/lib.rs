#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tauri::command]
fn showfile(path: &str) {
    showfile::show_path_in_file_manager(path);
}

use tauri_plugin_log::{Target, TargetKind};

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir { file_name: None }),
                    Target::new(TargetKind::Webview),
                ])
                .build(),
        )
        .invoke_handler(tauri::generate_handler![showfile])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
