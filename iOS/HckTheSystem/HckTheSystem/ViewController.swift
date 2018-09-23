//
//  ViewController.swift
//  HckTheSystem
//
//  Created by Vihan Bhargava on 9/22/18.
//  Copyright © 2018 Vihan Bhargava. All rights reserved.
//

import UIKit
import FaveButton
import Speech

class ViewController: UIViewController, FaveButtonDelegate {

    @IBOutlet weak var textDisplay: UITextView!
    @IBOutlet weak var runButton: UIButton!
    @IBOutlet weak var listen: FaveButton!
    
    private let speechRecognizer = SFSpeechRecognizer()
    private let audioEngine = AVAudioEngine()
    
    private var isSelected: Bool = false {
        didSet {
            if self.isSelected {
                self.startListen()
                self.displayText(string: "", disabledString: "...")
            } else {
                self.stopListening()
                self.displayText(string: "", disabledString: "Tap to Speak")
            }
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view, typically from a nib.
        self.isSelected = false
        self.listen.delegate = self
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        SFSpeechRecognizer.requestAuthorization { authStatus in
            if authStatus != .authorized {
                let alert = UIAlertController(title: "Audio required", message: "You must provide audio access", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self.present(alert, animated: true, completion: nil)
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func faveButton(_ faveButton: FaveButton, didSelected selected: Bool) {
        self.isSelected = selected
    }
    
    private var currentRequest: SFSpeechAudioBufferRecognitionRequest? = nil
    
    private var lastString: String? = nil
    func startListen() {
        // Stop listening if stil listenin
        self.stopListening()
        
        let audioSession = AVAudioSession.sharedInstance()
        try! audioSession.setCategory(AVAudioSessionCategoryRecord)
        try! audioSession.setMode(AVAudioSessionModeDefault)
        try! audioSession.setActive(true)
        
        guard let audioInput = audioEngine.inputNode else {
            let alert = UIAlertController(title: "No input found", message: "You must have a mic", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
            self.present(alert, animated: true, completion: nil)
            return
        }
        
        let recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
        recognitionRequest.shouldReportPartialResults = true
        
        speechRecognizer?.recognitionTask(with: recognitionRequest) { (result, error) in
            if let resultWord = result?.bestTranscription {
                let resultString = resultWord.formattedString
                self.lastString = resultString
                self.displayText(string: resultString, disabledString: "...")
            } else if error != nil {
                self.displayText(string: self.lastString ?? "(error)", disabledString: "")
            }
        }
        
        audioInput.installTap(onBus: 0, bufferSize: 1024, format: audioInput.inputFormat(forBus: 0)) { (buffer, time) in
            self.currentRequest?.append(buffer)
        }
        
        self.runButton.isEnabled = true
        
        self.currentRequest = recognitionRequest
        
        try! self.audioEngine.start()
    }
    
    func stopListening() {
        self.currentRequest?.endAudio()
        self.currentRequest = nil
        self.lastString = nil
        self.runButton.isEnabled = false
        
        self.audioEngine.inputNode?.removeTap(onBus: 0)
        
        self.audioEngine.stop()
    }
    
    func displayText(string: String, disabledString: String) {
        let mainString = NSAttributedString(
            string: "\(string )", attributes: [
                NSFontAttributeName: UIFont.systemFont(ofSize: 48.0, weight: UIFontWeightLight),
                NSForegroundColorAttributeName: UIColor.black
            ])
    
        let grayString = NSAttributedString(
            string: "\(disabledString )", attributes: [
                NSFontAttributeName: UIFont.systemFont(ofSize: 48.0, weight: UIFontWeightLight),
                NSForegroundColorAttributeName: UIColor.lightGray
            ])
        
        let text = NSMutableAttributedString()
        text.append(mainString)
        text.append(grayString)
        
        self.textDisplay.attributedText = text
    }

        
    @IBAction func shouldRun(_ sender: UIButton) {
        if let lastString = self.lastString, !lastString.isEmpty {
            CreateTask(text: lastString).run(callback: { taskInstance in
                guard let taskController = self.storyboard?.instantiateViewController(withIdentifier: "taskViewController") as? TaskViewController else {
                    let alert = UIAlertController(title: "Failed to load task", message: "Internal error", preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                    self.present(alert, animated: true, completion: nil)
                    return
                }
                
                let navController = UINavigationController(rootViewController: taskController)
                self.present(navController, animated: true, completion: nil)
            }, error: { () in
                let alert = UIAlertController(title: "Failed to establish connection to server", message: "Server borked", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self.present(alert, animated: true, completion: nil)
            })
        } else {
            let alert = UIAlertController(title: "No program to send", message: "You must write a program to send", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
            self.present(alert, animated: true, completion: nil)
        }
    }
    
}

