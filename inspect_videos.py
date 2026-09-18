import subprocess
import os
import glob
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
desktop_dir = "/Users/manishyadav/Desktop"

files = sorted([
    os.path.join(desktop_dir, f)
    for f in os.listdir(desktop_dir)
    if f.startswith("Screen Recording") and f.endswith(".mov")
])

print(f"Found {len(files)} Screen Recording files.\n")

for idx, filepath in enumerate(files, 1):
    size_mb = os.path.getsize(filepath) / (1024 * 1024)
    cmd = [
        FFMPEG,
        "-i", filepath,
        "-hide_banner"
    ]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
    print(f"==========================================")
    print(f"Video {idx}: {os.path.basename(filepath)} ({size_mb:.2f} MB)")
    print(f"==========================================")
    for line in res.stderr.splitlines():
        if any(keyword in line for keyword in ["Duration", "Stream #0", "Video:", "Audio:"]):
            print("  " + line.strip())
    print()
