#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use serde_json::Value;

#[tauri::command]
async fn ai_scan_check() -> Result<Value, String> {
    let output = std::process::Command::new("python")
        .args(["python/ai_scan_sidecar.py", "check"])
        .current_dir(std::env::current_dir().unwrap())
        .output()
        .map_err(|e| format!("Failed to run sidecar: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    serde_json::from_str(&stdout).map_err(|e| format!("JSON parse error: {}", e))
}

#[tauri::command]
async fn ai_scan_process(input_path: String, output_dir: String) -> Result<Value, String> {
    let output = std::process::Command::new("python")
        .args([
            "python/ai_scan_sidecar.py",
            "process",
            &input_path,
            &output_dir,
        ])
        .current_dir(std::env::current_dir().unwrap())
        .output()
        .map_err(|e| format!("Failed to run sidecar: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !output.status.success() {
        return Err(format!("Sidecar error: {}", if stderr.is_empty() { stdout.to_string() } else { stderr.to_string() }));
    }

    serde_json::from_str(&stdout).map_err(|e| format!("JSON parse error: {}", e))
}

#[tauri::command]
async fn ai_scan_process_b64(image_b64: String, output_dir: String) -> Result<Value, String> {
    use std::io::Write;

    // Decode base64
    use base64::{engine::general_purpose, Engine};
    let data = general_purpose::STANDARD.decode(&image_b64).map_err(|e| format!("Base64 decode error: {}", e))?;

    // Write to temp file
    let tmp_dir = std::env::temp_dir().join("forgia-ai-scan");
    std::fs::create_dir_all(&tmp_dir).map_err(|e| format!("Failed to create temp dir: {}", e))?;
    let ts = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let input_path = tmp_dir.join(format!("input_{}.png", ts));
    let mut file = std::fs::File::create(&input_path).map_err(|e| format!("Failed to create temp file: {}", e))?;
    file.write_all(&data).map_err(|e| format!("Failed to write temp file: {}", e))?;

    // Run sidecar
    let output = std::process::Command::new("python")
        .args([
            "python/ai_scan_sidecar.py",
            "process",
            input_path.to_str().unwrap(),
            &output_dir,
        ])
        .current_dir(std::env::current_dir().unwrap())
        .output()
        .map_err(|e| format!("Failed to run sidecar: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !output.status.success() {
        return Err(format!("Sidecar error: {}", if stderr.is_empty() { stdout.to_string() } else { stderr.to_string() }));
    }

    serde_json::from_str(&stdout).map_err(|e| format!("JSON parse error: {}", e))
}

#[tauri::command]
async fn ai_scan_vectorize(input_path: String, output_dir: String) -> Result<Value, String> {
    let output = std::process::Command::new("python")
        .args([
            "python/opencv_vectorize.py",
            "vectorize",
            &input_path,
            &output_dir,
        ])
        .current_dir(std::env::current_dir().unwrap())
        .output()
        .map_err(|e| format!("Failed to run vectorizer: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !output.status.success() {
        return Err(format!("Vectorizer error: {}", if stderr.is_empty() { stdout.to_string() } else { stderr.to_string() }));
    }

    serde_json::from_str(&stdout).map_err(|e| format!("JSON parse error: {}", e))
}

#[tauri::command]
async fn ai_scan_vectorize_b64(image_b64: String, output_dir: String) -> Result<Value, String> {
    use std::io::Write;
    use base64::{engine::general_purpose, Engine};

    let data = general_purpose::STANDARD.decode(&image_b64).map_err(|e| format!("Base64 decode error: {}", e))?;

    let tmp_dir = std::env::temp_dir().join("forgia-ai-scan");
    std::fs::create_dir_all(&tmp_dir).map_err(|e| format!("Failed to create temp dir: {}", e))?;
    let ts = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let input_path = tmp_dir.join(format!("input_{}.png", ts));
    let mut file = std::fs::File::create(&input_path).map_err(|e| format!("Failed to create temp file: {}", e))?;
    file.write_all(&data).map_err(|e| format!("Failed to write temp file: {}", e))?;

    let output = std::process::Command::new("python")
        .args([
            "python/opencv_vectorize.py",
            "vectorize",
            input_path.to_str().unwrap(),
            &output_dir,
        ])
        .current_dir(std::env::current_dir().unwrap())
        .output()
        .map_err(|e| format!("Failed to run vectorizer: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !output.status.success() {
        return Err(format!("Vectorizer error: {}", if stderr.is_empty() { stdout.to_string() } else { stderr.to_string() }));
    }

    serde_json::from_str(&stdout).map_err(|e| format!("JSON parse error: {}", e))
}

#[tauri::command]
async fn ai_scan_analyse(input_path: String) -> Result<Value, String> {
    let output = std::process::Command::new("python")
        .args([
            "python/claude_vision.py",
            "analyse",
            &input_path,
        ])
        .current_dir(std::env::current_dir().unwrap())
        .output()
        .map_err(|e| format!("Failed to run analyser: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !output.status.success() {
        return Err(format!("Analyser error: {}", if stderr.is_empty() { stdout.to_string() } else { stderr.to_string() }));
    }

    serde_json::from_str(&stdout).map_err(|e| format!("JSON parse error: {}", e))
}

#[tauri::command]
async fn ai_scan_analyse_b64(image_b64: String) -> Result<Value, String> {
    let output = std::process::Command::new("python")
        .args([
            "python/claude_vision.py",
            "analyse_b64",
            &image_b64,
        ])
        .current_dir(std::env::current_dir().unwrap())
        .output()
        .map_err(|e| format!("Failed to run analyser: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !output.status.success() {
        return Err(format!("Analyser error: {}", if stderr.is_empty() { stdout.to_string() } else { stderr.to_string() }));
    }

    serde_json::from_str(&stdout).map_err(|e| format!("JSON parse error: {}", e))
}

#[tauri::command]
async fn ai_scan_match_library(analysis_json: String) -> Result<Value, String> {
    let output = std::process::Command::new("python")
        .args([
            "python/parametric_match.py",
            "match_b64",
            &analysis_json,
        ])
        .current_dir(std::env::current_dir().unwrap())
        .output()
        .map_err(|e| format!("Failed to run matcher: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !output.status.success() {
        return Err(format!("Matcher error: {}", if stderr.is_empty() { stdout.to_string() } else { stderr.to_string() }));
    }

    serde_json::from_str(&stdout).map_err(|e| format!("JSON parse error: {}", e))
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            ai_scan_check,
            ai_scan_process,
            ai_scan_process_b64,
            ai_scan_vectorize,
            ai_scan_vectorize_b64,
            ai_scan_analyse,
            ai_scan_analyse_b64,
            ai_scan_match_library
        ])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }

            // Auto-check for updates on startup
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                match tauri_plugin_updater::UpdaterExt::check(handle) {
                    Ok(update) => {
                        if let Some(update) = update {
                            println!("Update available: {}", update.version);
                        }
                    }
                    Err(e) => {
                        eprintln!("Update check failed: {}", e);
                    }
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
