ObjC.import('Foundation');
ObjC.import('Speech');

function transcribe(audioPath) {
    var url = $.NSURL.fileURLWithPath(audioPath);
    var recognizer = $.SFSpeechRecognizer.alloc.initWithLocale($.NSLocale.localeWithLocaleIdentifier("en-IN"));
    if (!recognizer) {
        recognizer = $.SFSpeechRecognizer.alloc.initWithLocale($.NSLocale.localeWithLocaleIdentifier("en-US"));
    }
    
    var request = $.SFSpeechURLRecognitionRequest.alloc.initWithURL(url);
    request.requiresOnDeviceRecognition = true;
    
    var done = false;
    var transcript = "";
    
    var task = recognizer.recognitionTaskWithRequestResultHandler(request, function(result, error) {
        if (result && result.bestTranscription) {
            transcript = ObjC.unwrap(result.bestTranscription.formattedString);
            if (result.isFinal) {
                done = true;
            }
        }
        if (error) {
            done = true;
        }
    });
    
    var startTime = $.NSDate.date.timeIntervalSince1970;
    while (!done && ($.NSDate.date.timeIntervalSince1970 - startTime < 8.0)) {
        $.NSRunLoop.currentRunLoop.runUntilDate($.NSDate.dateWithTimeIntervalSinceNow(0.1));
    }
    
    return transcript;
}

var baseDir = "/Users/manishyadav/Desktop/skillBridge-AI-platform-main 4/audio_analysis/snippets";
var snippets = [
    "v1_end",
    "v2_start",
    "v2_end",
    "v3_start",
    "v3_end",
    "v4_start",
    "v4_end",
    "v5_start",
    "v5_end"
];

for (var i = 0; i < snippets.length; i++) {
    var sName = snippets[i];
    var path = baseDir + "/" + sName + ".wav";
    var text = transcribe(path);
    console.log(sName + ": " + (text ? text : "[SILENCE / NO SPEECH]"));
}
