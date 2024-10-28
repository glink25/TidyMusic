#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn showfile(path: &str) {
    showfile::show_path_in_file_manager(path);
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![showfile])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
