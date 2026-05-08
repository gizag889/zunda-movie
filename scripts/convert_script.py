import json
import os
import subprocess
import sys

# パス設定
#実行しているスクリプトファイルが存在するディレクトリの絶対パス」を取得
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "public")
SCRIPT_FILE = os.path.join(SCRIPT_DIR, "script.json")
GENERATE_VOICE_SCRIPT = os.path.join(SCRIPT_DIR, "generate_voice.py")
TIMING_FILE = os.path.join(PROJECT_ROOT, "src", "timing.json")

def main():
    # ユーザーがコマンドで打つ引数から台本ファイル名を取得。指定がない場合はデフォルトの script.json
    script_file_name = sys.argv[1] if len(sys.argv) > 1 else "script.json"
    script_path = os.path.join(SCRIPT_DIR, script_file_name)

    if not os.path.exists(script_path):
        # SCRIPT_DIRで見つからない場合は絶対パスとして試行
        script_path = script_file_name
        if not os.path.exists(script_path):
            print(f"Error: {script_path} not found.")
            sys.exit(1)

    print(f"Using script: {script_path}")
    
    if not os.path.exists(PUBLIC_DIR):
        os.makedirs(PUBLIC_DIR)

    with open(script_path, "r", encoding="utf-8") as f:
        script_data = json.load(f)

    timing_data = []
    current_frame = 0
    fps = 30

    for entry in script_data:
        display_text = entry["text"]
        # audioText があればそれを使用、なければ text を使用
        audio_text = entry.get("audioText", display_text)
        char = entry["character"]
        output_filename = f"voice_{entry['id']}.wav"
        output_path = os.path.join(PUBLIC_DIR, output_filename)

        print(f"Generating voice for: {audio_text[:20]}...")
        
        # generate_voice.py を呼び出し
        result = subprocess.run(
            [sys.executable, GENERATE_VOICE_SCRIPT, audio_text, char, output_path],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            print(f"Error generating voice for ID {entry['id']}: {result.stderr}")
            continue

        try:
            voice_info = json.loads(result.stdout)
            duration = voice_info["duration"]
            # セリフ間のバッファを30フレーム（1秒）に増やす
            duration_in_frames = int(duration * fps) + 30 

            timing_data.append({
                "id": entry["id"],
                "character": char,
                "text": display_text, # 表示用テキスト
                "audioFile": output_filename,
                "expression": entry.get("expression", "normal"),
                "startFrame": current_frame,
                "durationInFrames": duration_in_frames
            })

            current_frame += duration_in_frames
        except Exception as e:
            print(f"Error parsing result for ID {entry['id']}: {e}")

    # timing.json の保存
    # イントロの10秒（300フレーム）を加算し、最後に5秒（150フレーム）の余裕を持たせる
    intro_offset = fps * 10
    end_buffer = fps * 5 

    with open(TIMING_FILE, "w", encoding="utf-8") as f:
        json.dump({
            "segments": timing_data,
            "totalDurationInFrames": current_frame + intro_offset + end_buffer
        }, f, indent=2, ensure_ascii=False)

    print(f"Finished. Total duration: {current_frame + intro_offset + end_buffer} frames.")

if __name__ == "__main__":
    main()

