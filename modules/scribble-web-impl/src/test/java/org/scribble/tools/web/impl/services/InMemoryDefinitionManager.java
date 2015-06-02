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
package org.scribble.tools.web.impl.services;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.Map;

import javax.inject.Singleton;

import org.scribble.tools.web.api.model.Module;
import org.scribble.tools.web.api.model.Protocol;
import org.scribble.tools.web.api.model.ProtocolInfo;
import org.scribble.tools.web.api.services.DefinitionManager;

/**
 * @author gbrown
 */
@Singleton
public class InMemoryDefinitionManager implements DefinitionManager {
    
    private Map<String,Map<String,Protocol>> protocols=new HashMap<String,Map<String,Protocol>>();

    @Override
    public void updateProtocol(String module, String protocolName, Protocol definition) throws Exception {
        synchronized (protocols) {
            Map<String,Protocol> map=protocols.get(module);
            
            if (map == null) {
                map = new HashMap<String,Protocol>();
                protocols.put(module, map);
            }
            
            map.put(protocolName, definition);
        }
    }

    @Override
    public Protocol getProtocol(String module, String protocolName) {
        synchronized (protocols) {
            Map<String,Protocol> map=protocols.get(module);
            
            if (map != null) {
                return map.get(protocolName);
            }
            
            return null;
        }
    }

    @Override
    public Set<Module> getModules() {
        synchronized (protocols) {
            Set<Module> ret=new HashSet<Module>();
            
            for (String module : protocols.keySet()) {
                Module m=new Module();
                m.setName(module);
                m.setNumberOfProtocols(protocols.get(module).size());
                ret.add(m);
            }
            
            return ret;
        }
    }

    @Override
    public Set<ProtocolInfo> getProtocols(String moduleName) {
        synchronized (protocols) {
            if (protocols.containsKey(moduleName)) {
                Set<ProtocolInfo> ret=new HashSet<ProtocolInfo>();
                
                for (String protocol : protocols.get(moduleName).keySet()) {
                    ProtocolInfo pi=new ProtocolInfo();
                    pi.setName(protocol);
                    
                    Protocol p=protocols.get(moduleName).get(protocol);
                    pi.setAuthor(p.getAuthor());
                    pi.setDescription(p.getDescription());
                    
                    ret.add(pi);
                }
                
                return ret;
            }
            return Collections.emptySet();
        }
    }

}
