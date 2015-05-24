/*
 * Copyright 2015 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.scribble.web.api;

import java.util.Set;

/**
 * @author gbrown
 */
public interface DefinitionManager {

    /**
     * This method updates a protocol definition.
     * 
     * @param moduleName The module name
     * @param protocolName The protocol name
     * @param definition The protocol definition
     * @throws Exception Failed to update protocol
     */
    public void updateProtocol(String moduleName, String protocolName, Protocol definition) throws Exception;
    
    /**
     * This method returns the definition associated with the supplied
     * module and protocol names.
     * 
     * @param moduleName The module name
     * @param protocolName The protocol name
     * @return The protocol definition
     */
    public Protocol getProtocol(String moduleName, String protocolName);
    
    /**
     * This method returns the list of module names.
     * 
     * @return The module names
     */
    public Set<String> getModuleNames();

    /**
     * This method returns the protocol names associated with the
     * supplied module.
     * 
     * @param moduleName The module name
     * @return The protocol names
     */
    public Set<String> getProtocolNames(String moduleName);

}
