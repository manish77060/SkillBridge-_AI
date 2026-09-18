import subprocess
import os
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
desktop_dir = "/Users/manishyadav/Desktop"
out_dir = "/Users/manishyadav/Desktop/skillBridge-AI-platform-main 4/audio_analysis"
os.makedirs(out_dir, exist_ok=True)

files = sorted([
    os.path.join(desktop_dir, f)
    for f in os.listdir(desktop_dir)
    if f.startswith("Screen Recording") and f.endswith(".mov")
])

for idx, f in enumerate(files, 1):
    out_wav = os.path.join(out_dir, f"video_{idx}.wav")
    cmd = [
        FFMPEG,
        "-y",
        "-i", f,
        "-vn",
        "-acodec", "pcm_s16le",
        "-ar", "16000",
        "-ac", "1",
        out_wav
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Extracted audio for Video {idx}: {out_wav} ({os.path.getsize(out_wav) / (1024*1024):.2f} MB)")
