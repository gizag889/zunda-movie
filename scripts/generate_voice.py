import requests
import json
import sys
import os
import wave

# 設定
VOICEVOX_URL = os.getenv("VOICEVOX_URL", "http://localhost:50021")

# キャラクターとスピーカーIDの対応
# 2: 四国めたん（ノーマル）
# 3: ずんだもん（ノーマル）
SPEAKER_MAP = {
    "metan": 2,
    "zundamon": 3
}

def generate_voice(text, character, output_path):
    # キャラクター名に応じてスピーカーIDを切り替える（対話形式対応）
    char_key = character.lower().strip()
    # 辞書にないキャラクターの場合は、デフォルトとして四国めたん（2）を設定
    speaker_id = SPEAKER_MAP.get(char_key, 2)

    # 1. 音声クエリの作成
    query_payload = {"text": text, "speaker": speaker_id}
    try:
        query_res = requests.post(f"{VOICEVOX_URL}/audio_query", params=query_payload)
        if query_res.status_code != 200:
            print(f"Error: Query failed {query_res.status_code}")
            return None
        
        query_data = query_res.json()

        # 2. 音声合成の実行
        synth_res = requests.post(
            f"{VOICEVOX_URL}/synthesis",
            params={"speaker": speaker_id},
            data=json.dumps(query_data)
        )
        if synth_res.status_code != 200:
            print(f"Error: Synthesis failed {synth_res.status_code}")
            return None

        # 3. 保存
        with open(output_path, "wb") as f:
            f.write(synth_res.content)
        
        # 再生時間の計測
        with wave.open(output_path, 'rb') as wr:
            duration = wr.getnframes() / wr.getframerate()
        return duration
    except Exception as e:
        print(f"Error: {e}")
        return None

#「外部から命令を受け取り、作業をして、その結果（秒数など）を報告する」**という窓口業務を担当しているコード
#このスクリプトが直接実行された時だけ、以下のコードを動かすという決まり文句
if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python generate_voice.py [text] [character] [output_path]")
        sys.exit(1)
    
    text, char, out = sys.argv[1], sys.argv[2], sys.argv[3]
    dur = generate_voice(text, char, out)
    if dur:
        print(json.dumps({"duration": dur, "path": out}))
    else:
        sys.exit(1)

