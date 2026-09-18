import subprocess
import os
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
desktop_dir = "/Users/manishyadav/Desktop"
snip_dir = "/Users/manishyadav/Desktop/skillBridge-AI-platform-main 4/audio_analysis/snippets"
os.makedirs(snip_dir, exist_ok=True)

files = sorted([
    os.path.join(desktop_dir, f)
    for f in os.listdir(desktop_dir)
    if f.startswith("Screen Recording") and f.endswith(".mov")
])

snippets = [
    ("v1_end", files[0], 124, 6.5),
    ("v2_start", files[1], 0, 5),
    ("v2_end", files[1], 140, 6.5),
    ("v3_start", files[2], 0, 5),
    ("v3_end", files[2], 96, 5),
    ("v4_start", files[3], 0, 5),
    ("v4_end", files[3], 136, 5),
    ("v5_start", files[4], 0, 5),
    ("v5_end", files[4], 60, 6.6)
]

for name, src, start, dur in snippets:
    out_file = os.path.join(snip_dir, f"{name}.wav")
    cmd = [
        FFMPEG, "-y",
        "-ss", str(start),
        "-t", str(dur),
        "-i", src,
        "-acodec", "pcm_s16le",
        "-ar", "16000",
        "-ac", "1",
        out_file
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Extracted {name}.wav (from {start}s for {dur}s)")
