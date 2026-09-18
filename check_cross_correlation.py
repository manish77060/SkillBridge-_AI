import wave
import struct
import math
import os

audio_dir = "/Users/manishyadav/Desktop/skillBridge-AI-platform-main 4/audio_analysis"

def load_samples(wav_path):
    with wave.open(wav_path, 'rb') as wf:
        n_frames = wf.getnframes()
        framerate = wf.getframerate()
        raw = wf.readframes(n_frames)
        samples = struct.unpack(f"<{len(raw)//2}h", raw)
        return samples, framerate

# Check each transition
transitions = [
    ("v1_to_v2", "video_1.wav", "video_2.wav", 125, 133, 0, 10),
    ("v2_to_v3", "video_2.wav", "video_3.wav", 135, 146.5, 0, 10),
    ("v3_to_v4", "video_3.wav", "video_4.wav", 95, 106, 0, 10),
    ("v4_to_v5", "video_4.wav", "video_5.wav", 135, 142, 0, 10),
]

print("=== CHECKING POTENTIAL AUDIO REPETITION & OVERLAPS ===")
for name, f1, f2, s1, e1, s2, e2 in transitions:
    p1 = os.path.join(audio_dir, f1)
    p2 = os.path.join(audio_dir, f2)
    smp1, r1 = load_samples(p1)
    smp2, r2 = load_samples(p2)
    
    # Extract end chunk of clip 1 and start chunk of clip 2
    chunk1 = smp1[int(s1*r1):int(e1*r1)]
    chunk2 = smp2[int(s2*r2):int(e2*r2)]
    
    # Check energy
    rms1 = math.sqrt(sum(x*x for x in chunk1)/len(chunk1)) if chunk1 else 0
    rms2 = math.sqrt(sum(x*x for x in chunk2)/len(chunk2)) if chunk2 else 0
    print(f"\nTransition {name}:")
    print(f"  Clip 1 end [{s1}s - {e1}s]: RMS = {rms1:.1f}")
    print(f"  Clip 2 start [{s2}s - {e2}s]: RMS = {rms2:.1f}")
