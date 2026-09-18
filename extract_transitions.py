import subprocess
import os
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
desktop_dir = "/Users/manishyadav/Desktop"
frames_dir = "/Users/manishyadav/Desktop/skillBridge-AI-platform-main 4/video_frames/transitions"
os.makedirs(frames_dir, exist_ok=True)

files = sorted([
    os.path.join(desktop_dir, f)
    for f in os.listdir(desktop_dir)
    if f.startswith("Screen Recording") and f.endswith(".mov")
])

# Extract end of v1 and start of v2
# End of v2 and start of v3
# End of v3 and start of v4
# End of v4 and start of v5

subprocess.run([FFMPEG, "-y", "-ss", "128", "-i", files[0], "-vframes", "1", "-vf", "scale=960:-1", f"{frames_dir}/v1_end.jpg"], stderr=subprocess.DEVNULL)
subprocess.run([FFMPEG, "-y", "-ss", "1", "-i", files[1], "-vframes", "1", "-vf", "scale=960:-1", f"{frames_dir}/v2_start.jpg"], stderr=subprocess.DEVNULL)
subprocess.run([FFMPEG, "-y", "-ss", "144", "-i", files[1], "-vframes", "1", "-vf", "scale=960:-1", f"{frames_dir}/v2_end.jpg"], stderr=subprocess.DEVNULL)
subprocess.run([FFMPEG, "-y", "-ss", "1", "-i", files[2], "-vframes", "1", "-vf", "scale=960:-1", f"{frames_dir}/v3_start.jpg"], stderr=subprocess.DEVNULL)
subprocess.run([FFMPEG, "-y", "-ss", "100", "-i", files[2], "-vframes", "1", "-vf", "scale=960:-1", f"{frames_dir}/v3_end.jpg"], stderr=subprocess.DEVNULL)
subprocess.run([FFMPEG, "-y", "-ss", "1", "-i", files[3], "-vframes", "1", "-vf", "scale=960:-1", f"{frames_dir}/v4_start.jpg"], stderr=subprocess.DEVNULL)
subprocess.run([FFMPEG, "-y", "-ss", "140", "-i", files[3], "-vframes", "1", "-vf", "scale=960:-1", f"{frames_dir}/v4_end.jpg"], stderr=subprocess.DEVNULL)
subprocess.run([FFMPEG, "-y", "-ss", "1", "-i", files[4], "-vframes", "1", "-vf", "scale=960:-1", f"{frames_dir}/v5_start.jpg"], stderr=subprocess.DEVNULL)
subprocess.run([FFMPEG, "-y", "-ss", "64", "-i", files[4], "-vframes", "1", "-vf", "scale=960:-1", f"{frames_dir}/v5_end.jpg"], stderr=subprocess.DEVNULL)

print("Transition frames extracted.")
