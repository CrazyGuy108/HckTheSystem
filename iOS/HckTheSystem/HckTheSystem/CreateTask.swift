//
//  CreateTask.swift
//  HckTheSystem
//
//  Created by Vihan Bhargava on 9/22/18.
//  Copyright © 2018 Vihan Bhargava. All rights reserved.
//

import Foundation

class CreateTask: Endpoint<TaskInstance> {
    
    override func format(_ object: Any) throws -> TaskInstance {
        // let json = object as! [String: AnyObject]
        return TaskInstance()
    }
    
    public init(text: String) {
        super.init("/task", parameters: [
            "text": text
        ], method: .post)
    }
    
}
