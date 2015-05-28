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
package org.scribble.tools.web.api.model;

import java.util.HashSet;
import java.util.Set;

/**
 * @author gbrown
 */
public class ProjectProtocolAction {

    private String module;
    private String protocol;
    private String role;
    
    private Set<String> definitions=new HashSet<String>();

    /**
     * @return the module
     */
    public String getModule() {
        return module;
    }

    /**
     * @param module the module to set
     */
    public void setModule(String module) {
        this.module = module;
    }

    /**
     * @return the protocol
     */
    public String getProtocol() {
        return protocol;
    }

    /**
     * @param protocol the protocol to set
     */
    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    /**
     * @return the role
     */
    public String getRole() {
        return role;
    }

    /**
     * @param role the role to set
     */
    public void setRole(String role) {
        this.role = role;
    }

    /**
     * @return the definitions
     */
    public Set<String> getDefinitions() {
        return definitions;
    }

    /**
     * @param definitions the definitions to set
     */
    public void setDefinitions(Set<String> definitions) {
        this.definitions = definitions;
    }

}
