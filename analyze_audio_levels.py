import wave
import struct
import math
import os

audio_dir = "/Users/manishyadav/Desktop/skillBridge-AI-platform-main 4/audio_analysis"

def analyze_wav(wav_path):
    with wave.open(wav_path, 'rb') as wf:
        n_channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        duration = n_frames / framerate
        
        # Read all frames
        raw_data = wf.readframes(n_frames)
        total_samples = len(raw_data) // 2 # 16-bit
        samples = struct.unpack(f"<{total_samples}h", raw_data)
        
    # Analyze in 100ms windows
    window_size = int(framerate * 0.1) # 1600 samples
    rms_list = []
    
    for i in range(0, len(samples), window_size):
        chunk = samples[i:i+window_size]
        if not chunk:
            continue
        sum_sq = sum(s*s for s in chunk)
        rms = math.sqrt(sum_sq / len(chunk))
        time_sec = i / framerate
        rms_list.append((time_sec, rms))
        
    # Baseline noise vs speech threshold
    # Sort RMS values to find noise floor
    sorted_rms = sorted([r for _, r in rms_list])
    noise_floor = sorted_rms[int(len(sorted_rms) * 0.2)]
    speech_threshold = max(noise_floor * 3.0, 150.0) # Adaptive threshold
    
    # Find speech segments
    speech_windows = [(t, r > speech_threshold) for t, r in rms_list]
    
    first_speech_time = None
    for t, is_speech in speech_windows:
        if is_speech:
            first_speech_time = t
            break
            
    last_speech_time = None
    for t, is_speech in reversed(speech_windows):
        if is_speech:
            last_speech_time = t
            break
            
    return {
        "duration": duration,
        "noise_floor": noise_floor,
        "speech_threshold": speech_threshold,
        "first_speech_time": first_speech_time,
        "last_speech_time": last_speech_time,
        "rms_list": rms_list
    }

print("=== AUDIO ENERGY & SPEECH BOUNDARY ANALYSIS ===")
boundaries = []
for idx in range(1, 6):
    wav_path = os.path.join(audio_dir, f"video_{idx}.wav")
    res = analyze_wav(wav_path)
    boundaries.append(res)
    print(f"\n--- Video {idx} ---")
    print(f"  Duration:           {res['duration']:.2f}s ({res['duration']//60:.0f}m {res['duration']%60:.2f}s)")
    print(f"  First speech detected at: {res['first_speech_time']:.2f}s (Dead air at start: {res['first_speech_time']:.2f}s)")
    print(f"  Last speech detected at:  {res['last_speech_time']:.2f}s (Dead air at end: {res['duration'] - res['last_speech_time']:.2f}s)")
