//
//  Request.swift
//  HckTheSystem
//
//  Created by Vihan Bhargava on 9/22/18.
//  Copyright © 2018 Vihan Bhargava. All rights reserved.
//

import Alamofire

class Endpoint<T> {
    private var path: String
    
    private(set) var error: Error!
    
    var url: String { get { return "\(serverAddr)\(self.path)" } }
    var urlRequest: URLRequest { get { return URLRequest(url: URL(string: self.url)!) } }
    
    // MARK: Overridable Methods
    func format(_ object: Any) throws -> T {
        return object as! T
    }
    
    // MARK: - Request functions
    typealias Callback = (T) -> Void
    
    var method: HTTPMethod
    var parameters: Parameters
    
    private func run(_ url: String, callback: @escaping Callback, error: (() -> Void)?) -> Void {
        Alamofire.request(url, method: self.method, parameters: self.parameters, encoding: JSONEncoding.default)
            .validate(statusCode: 200..<300)
            .validate(contentType: ["application/json"])
            .responseJSON { response in
                switch response.result {
                case .success:
                    callback(try! self.format(response.result.value!))
                case .failure(let response):
                    self.error = response
                    error?()
                }
        }
    }
    
    func run(callback: @escaping Callback) -> Void {
        self.run(self.url, callback: callback, error: nil)
    }
    
    func run(callback: @escaping Callback, error: @escaping () -> Void) -> Void {
        self.run(self.url, callback: callback, error: error)
    }
    
    init(_ path: String, parameters: Parameters = [:], method: HTTPMethod = .get) {
        self.path = path
        self.parameters = parameters
        self.method = method
    }
}
