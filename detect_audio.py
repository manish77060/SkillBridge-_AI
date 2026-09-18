import subprocess
import os
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
desktop_dir = "/Users/manishyadav/Desktop"

files = sorted([
    os.path.join(desktop_dir, f)
    for f in os.listdir(desktop_dir)
    if f.startswith("Screen Recording") and f.endswith(".mov")
])

for idx, filepath in enumerate(files, 1):
    print(f"\n==========================================")
    print(f"Detecting silence in Video {idx}: {os.path.basename(filepath)}")
    print(f"==========================================")
    cmd = [
        FFMPEG,
        "-i", filepath,
        "-af", "silencedetect=noise=-35dB:d=0.5",
        "-f", "null", "-"
    ]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
    silence_lines = [l.strip() for l in res.stderr.splitlines() if "silence" in l]
    print(f"Total silence intervals found: {len(silence_lines)//2}")
    for l in silence_lines[:8]: # print first few
        print("  ", l)
    if len(silence_lines) > 8:
        print("  ...")
        for l in silence_lines[-4:]: # print last few
            print("  ", l)
