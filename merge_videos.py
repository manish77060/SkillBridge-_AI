import subprocess
import os
import shutil
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
desktop_dir = "/Users/manishyadav/Desktop"
workspace_dir = "/Users/manishyadav/Desktop/skillBridge-AI-platform-main 4"

# Source files
files = sorted([
    os.path.join(desktop_dir, f)
    for f in os.listdir(desktop_dir)
    if f.startswith("Screen Recording") and f.endswith(".mov")
])

print("Detected 5 recordings:")
for i, f in enumerate(files, 1):
    print(f"  [{i}] {os.path.basename(f)}")

# Exact clean trim boundaries based on speech & visual analysis:
# Clip 1: Landing page (cuts 2.9s of dead silence/mouse moving at end)
# Clip 2: Student Dashboard (cuts 1.0s initial pause; cuts trailing 3s error page)
# Clip 3: Opportunities & Learning Center (starts right on 'Next is opportunities', cuts 5.5s trailing dead air)
# Clip 4: Industry Portal (starts clean on 'Now we login', cuts 1.7s trailing silence)
# Clip 5: Institution Portal (starts clean on 'Now we login', ends after closing statement)
trims = [
    (0.0, 130.4),
    (1.0, 143.5),
    (0.5, 100.8),
    (1.1, 140.7),
    (0.4, 66.5)
]

temp_clips = []
temp_dir = os.path.join(workspace_dir, "temp_merged_parts")
os.makedirs(temp_dir, exist_ok=True)

print("\n--- STEP 1: Trimming and normalizing individual clips (Apple VideoToolbox HW Acceleration) ---")
for idx, (f, (start_t, end_t)) in enumerate(zip(files, trims), 1):
    duration = end_t - start_t
    out_part = os.path.join(temp_dir, f"part_{idx}.mp4")
    temp_clips.append(out_part)
    print(f"Processing Clip {idx}: {start_t:.1f}s to {end_t:.1f}s (duration: {duration:.1f}s)...")
    
    # Apple Silicon hardware-accelerated H.264 encoding with 60fps constant frame rate
    cmd = [
        FFMPEG, "-y",
        "-ss", str(start_t),
        "-t", str(duration),
        "-i", f,
        "-c:v", "h264_videotoolbox",
        "-b:v", "5500k",
        "-r", "60",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-ar", "48000",
        "-ac", "2",
        "-af", f"afade=t=in:ss=0:d=0.08,afade=t=out:st={duration - 0.08:.3f}:d=0.08",
        out_part
    ]
    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"Error on clip {idx}:", res.stderr[-500:])
        exit(1)
    size_mb = os.path.getsize(out_part) / (1024 * 1024)
    print(f"  -> Generated {os.path.basename(out_part)} ({size_mb:.2f} MB)")

print("\n--- STEP 2: Creating concat manifest ---")
concat_list_path = os.path.join(temp_dir, "concat_list.txt")
with open(concat_list_path, "w") as f_out:
    for clip in temp_clips:
        f_out.write(f"file '{clip}'\n")

print(f"Concat manifest created with {len(temp_clips)} parts.")

print("\n--- STEP 3: Concatenating all parts into final seamless video ---")
out_desktop = os.path.join(desktop_dir, "SkillBridge_AI_Complete_Demo.mp4")
out_workspace = os.path.join(workspace_dir, "SkillBridge_AI_Complete_Demo.mp4")

cmd_concat = [
    FFMPEG, "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_list_path,
    "-c", "copy",
    "-movflags", "+faststart",
    out_desktop
]
res_concat = subprocess.run(cmd_concat, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
if res_concat.returncode != 0:
    print("Error during concat:", res_concat.stderr[-500:])
    exit(1)

# Copy to workspace
shutil.copy2(out_desktop, out_workspace)

# Cleanup temporary parts
shutil.rmtree(temp_dir, ignore_errors=True)

final_size_mb = os.path.getsize(out_desktop) / (1024 * 1024)

# Get final duration
cmd_probe = [
    FFMPEG, "-i", out_desktop, "-hide_banner"
]
p_res = subprocess.run(cmd_probe, stderr=subprocess.PIPE, text=True)
dur_line = [l.strip() for l in p_res.stderr.splitlines() if "Duration:" in l]

print(f"\n🎉 VIDEO MERGE COMPLETE!")
print(f"Output files:")
print(f"  • Desktop:   {out_desktop} ({final_size_mb:.2f} MB)")
print(f"  • Workspace: {out_workspace} ({final_size_mb:.2f} MB)")
if dur_line:
    print(f"Final {dur_line[0]}")
