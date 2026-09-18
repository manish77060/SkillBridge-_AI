import subprocess
import os
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
desktop_dir = "/Users/manishyadav/Desktop"
frames_dir = "/Users/manishyadav/Desktop/skillBridge-AI-platform-main 4/video_frames"
os.makedirs(frames_dir, exist_ok=True)

files = sorted([
    os.path.join(desktop_dir, f)
    for f in os.listdir(desktop_dir)
    if f.startswith("Screen Recording") and f.endswith(".mov")
])

for idx, f in enumerate(files, 1):
    # Extract start frame (5s), middle frame (30s), and end frame
    for t_sec in [2, 10, 30, 60, 90]:
        out_jpg = os.path.join(frames_dir, f"v{idx}_{t_sec}s.jpg")
        cmd = [
            FFMPEG,
            "-y",
            "-ss", str(t_sec),
            "-i", f,
            "-vframes", "1",
            "-q:v", "3",
            "-vf", "scale=1280:-1",
            out_jpg
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
print("Frames extraction complete. Listing generated frames:")
for f in sorted(os.listdir(frames_dir)):
    if f.endswith(".jpg"):
        print(f"  {f}")
