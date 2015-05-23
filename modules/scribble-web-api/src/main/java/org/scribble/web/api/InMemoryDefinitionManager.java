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

import java.util.Collections;
import java.util.HashMap;
import java.util.Set;
import java.util.Map;

import javax.inject.Singleton;

/**
 * @author gbrown
 */
@Singleton
public class InMemoryDefinitionManager implements DefinitionManager {
    
    private Map<String,Map<String,String>> protocols=new HashMap<String,Map<String,String>>();

    @Override
    public void updateProtocol(String module, String protocol, String definition) throws Exception {
        synchronized (protocols) {
            Map<String,String> map=protocols.get(module);
            
            if (map == null) {
                map = new HashMap<String,String>();
                protocols.put(module, map);
            }
            
            map.put(protocol, definition);
        }
    }

    @Override
    public String getProtocol(String module, String protocol) {
        synchronized (protocols) {
            Map<String,String> map=protocols.get(module);
            
            if (map != null) {
                return map.get(protocol);
            }
            
            return null;
        }
    }

    @Override
    public Set<String> getModuleNames() {
        synchronized (protocols) {
            return protocols.keySet();
        }
    }

    @Override
    public Set<String> getProtocolNames(String module) {
        synchronized (protocols) {
            if (protocols.containsKey(module)) {
                return protocols.get(module).keySet();
            }
            return Collections.emptySet();
        }
    }

}
