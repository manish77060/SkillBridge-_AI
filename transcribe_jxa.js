ObjC.import('Foundation');
ObjC.import('Speech');

function transcribe(audioPath) {
    var url = $.NSURL.fileURLWithPath(audioPath);
    var locale = $.NSLocale.localeWithLocaleIdentifier("en-IN");
    var recognizer = $.SFSpeechRecognizer.alloc.initWithLocale(locale);
    
    if (!recognizer) {
        recognizer = $.SFSpeechRecognizer.alloc.initWithLocale($.NSLocale.localeWithLocaleIdentifier("en-US"));
    }
    
    var request = $.SFSpeechURLRecognitionRequest.alloc.initWithURL(url);
    request.requiresOnDeviceRecognition = true;
    
    var done = false;
    var transcript = "";
    
    var task = recognizer.recognitionTaskWithRequestResultHandler(request, function(result, error) {
        if (result) {
            transcript = ObjC.unwrap(result.bestTranscription.formattedString);
            if (result.isFinal) {
                done = true;
            }
        }
        if (error) {
            var errStr = ObjC.unwrap(error.localizedDescription);
            console.log("Error: " + errStr);
            done = true;
        }
    });
    
    var startTime = $.NSDate.date.timeIntervalSince1970;
    while (!done && ($.NSDate.date.timeIntervalSince1970 - startTime < 10.0)) {
        $.NSRunLoop.currentRunLoop.runUntilDate($.NSDate.dateWithTimeIntervalSinceNow(0.1));
    }
    
    return transcript;
}

var v2_end = "/Users/manishyadav/Desktop/skillBridge-AI-platform-main 4/audio_analysis/snippets/v2_end.wav";
var v3_start = "/Users/manishyadav/Desktop/skillBridge-AI-platform-main 4/audio_analysis/snippets/v3_start.wav";

console.log("Transcribing v2_end...");
var res2 = transcribe(v2_end);
console.log("v2_end: " + res2);

console.log("\nTranscribing v3_start...");
var res3 = transcribe(v3_start);
console.log("v3_start: " + res3);
