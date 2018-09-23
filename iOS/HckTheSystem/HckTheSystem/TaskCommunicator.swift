//
//  TaskCommunicator.swift
//  HckTheSystem
//
//  Created by Vihan Bhargava on 9/22/18.
//  Copyright © 2018 Vihan Bhargava. All rights reserved.
//

import Foundation
import SocketIO

protocol TaskCommunicatorDelegate {
    @objc optional func didGetTaskList() -> TaskList
}

class TaskCommunicator {
    
    private let client: SocketIOClient
    open var delegate: TaskCommunicatorDelegate
    
    init() {
        self.client = SocketIOClient(socketURL: URL(string: serverAddr)!, config: [.log(true)])
    }
}
