import Foundation
import Speech

let audioDir = "/Users/manishyadav/Desktop/skillBridge-AI-platform-main 4/audio_analysis"

for idx in 1...5 {
    let wavPath = "\(audioDir)/video_\(idx).wav"
    let url = URL(fileURLWithPath: wavPath)
    
    let recognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-IN")) ?? SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    guard let recognizer = recognizer, recognizer.isAvailable else {
        print("Recognizer not available for video \(idx)")
        continue
    }
    
    let request = SFSpeechURLRecognitionRequest(url: url)
    request.requiresOnDeviceRecognition = true
    
    let semaphore = DispatchSemaphore(value: 0)
    print("\n--- Transcribing Video \(idx) ---")
    
    recognizer.recognitionTask(with: request) { result, error in
        if let result = result {
            if result.isFinal {
                print("Result (final): \(result.bestTranscription.formattedString)")
                for seg in result.bestTranscription.segments {
                    if seg.timestamp < 10.0 || seg.timestamp > result.bestTranscription.segments.last!.timestamp - 10.0 {
                        print("  [\(String(format: "%.2f", seg.timestamp))s - \(String(format: "%.2f", seg.timestamp + seg.duration))s] \(seg.substring)")
                    }
                }
                semaphore.signal()
            }
        }
        if let error = error {
            print("Error: \(error.localizedDescription)")
            semaphore.signal()
        }
    }
    
    _ = semaphore.wait(timeout: .now() + 15.0)
}
