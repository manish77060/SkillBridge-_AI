import wave
import struct
import math
import os

audio_dir = "/Users/manishyadav/Desktop/skillBridge-AI-platform-main 4/audio_analysis"

def get_rms_profile(wav_path, from_sec, to_sec, step=0.1):
    with wave.open(wav_path, 'rb') as wf:
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        duration = n_frames / framerate
        
        start_frame = int(max(0, from_sec) * framerate)
        end_frame = int(min(duration, to_sec) * framerate)
        
        wf.setpos(start_frame)
        frames_to_read = end_frame - start_frame
        raw_data = wf.readframes(frames_to_read)
        total_samples = len(raw_data) // 2
        samples = struct.unpack(f"<{total_samples}h", raw_data)
        
    window = int(framerate * step)
    profile = []
    for i in range(0, len(samples), window):
        chunk = samples[i:i+window]
        if not chunk:
            continue
        rms = math.sqrt(sum(s*s for s in chunk) / len(chunk))
        t = from_sec + (i / framerate)
        profile.append((t, rms))
    return profile

print("--- BOUNDARY RMS ANALYSIS ---")
# Check video 1 end
prof1 = get_rms_profile(f"{audio_dir}/video_1.wav", 125, 134)
print("\nVideo 1 (last 8 seconds):")
for t, r in prof1:
    bar = "#" * int(min(50, r // 100))
    print(f"  {t:6.2f}s: {r:6.1f} | {bar}")

# Check video 2 start & end
prof2_s = get_rms_profile(f"{audio_dir}/video_2.wav", 0, 5)
print("\nVideo 2 (first 5 seconds):")
for t, r in prof2_s:
    bar = "#" * int(min(50, r // 100))
    print(f"  {t:6.2f}s: {r:6.1f} | {bar}")

prof2_e = get_rms_profile(f"{audio_dir}/video_2.wav", 140, 147)
print("\nVideo 2 (last 7 seconds):")
for t, r in prof2_e:
    bar = "#" * int(min(50, r // 100))
    print(f"  {t:6.2f}s: {r:6.1f} | {bar}")

# Check video 3 start & end
prof3_s = get_rms_profile(f"{audio_dir}/video_3.wav", 0, 5)
print("\nVideo 3 (first 5 seconds):")
for t, r in prof3_s:
    bar = "#" * int(min(50, r // 100))
    print(f"  {t:6.2f}s: {r:6.1f} | {bar}")

prof3_e = get_rms_profile(f"{audio_dir}/video_3.wav", 95, 107)
print("\nVideo 3 (last 12 seconds):")
for t, r in prof3_e:
    bar = "#" * int(min(50, r // 100))
    print(f"  {t:6.2f}s: {r:6.1f} | {bar}")

# Check video 4 start & end
prof4_s = get_rms_profile(f"{audio_dir}/video_4.wav", 0, 5)
print("\nVideo 4 (first 5 seconds):")
for t, r in prof4_s:
    bar = "#" * int(min(50, r // 100))
    print(f"  {t:6.2f}s: {r:6.1f} | {bar}")

prof4_e = get_rms_profile(f"{audio_dir}/video_4.wav", 137, 143)
print("\nVideo 4 (last 6 seconds):")
for t, r in prof4_e:
    bar = "#" * int(min(50, r // 100))
    print(f"  {t:6.2f}s: {r:6.1f} | {bar}")

# Check video 5 start & end
prof5_s = get_rms_profile(f"{audio_dir}/video_5.wav", 0, 5)
print("\nVideo 5 (first 5 seconds):")
for t, r in prof5_s:
    bar = "#" * int(min(50, r // 100))
    print(f"  {t:6.2f}s: {r:6.1f} | {bar}")

prof5_e = get_rms_profile(f"{audio_dir}/video_5.wav", 60, 67)
print("\nVideo 5 (last 7 seconds):")
for t, r in prof5_e:
    bar = "#" * int(min(50, r // 100))
    print(f"  {t:6.2f}s: {r:6.1f} | {bar}")
