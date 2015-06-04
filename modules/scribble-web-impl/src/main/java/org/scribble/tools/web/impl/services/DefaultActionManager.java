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

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.inject.Inject;

import org.scribble.context.DefaultModuleContext;
import org.scribble.model.Module;
import org.scribble.parser.ProtocolParser;
import org.scribble.projection.ProtocolProjector;
import org.scribble.resources.InputStreamResource;
import org.scribble.resources.Resource;
import org.scribble.tools.web.api.model.Marker;
import org.scribble.tools.web.api.model.ProjectProtocolAction;
import org.scribble.tools.web.api.model.Protocol;
import org.scribble.tools.web.api.model.ProtocolProjection;
import org.scribble.tools.web.api.model.RoleInfo;
import org.scribble.tools.web.api.model.VerifyProtocolAction;
import org.scribble.tools.web.api.services.ActionManager;
import org.scribble.tools.web.api.services.DefinitionManager;
import org.scribble.validation.ProtocolValidator;

/**
 * @author gbrown
 */
public class DefaultActionManager implements ActionManager {

    @Inject
    private DefinitionManager definitionManager;

    /**
     * @return the definitionManager
     */
    public DefinitionManager getDefinitionManager() {
        return definitionManager;
    }

    /**
     * @param definitionManager the definitionManager to set
     */
    public void setDefinitionManager(DefinitionManager definitionManager) {
        this.definitionManager = definitionManager;
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.web.api.actions.ActionManager#project(org.scribble.tools.web.api.actions.ProjectProtocolAction)
     */
    @Override
    public ProtocolProjection project(ProjectProtocolAction action) {
        ProtocolProjection ret=new ProtocolProjection();
        
        if (action.getDefinitions().isEmpty()) {
            Protocol p=definitionManager.getProtocol(action.getModule(), action.getProtocol());
            
            if (p != null) {
                ProtocolParser pp=new ProtocolParser();
                
                MarkerIssueLogger logger=new MarkerIssueLogger();
                
                ByteArrayInputStream is=new ByteArrayInputStream(p.getDefinition().getBytes());
                
                Resource res=new InputStreamResource(action.getProtocol(), is);
                
                try {
                    Module module=pp.parse(res, null, logger);
                    
                    if (module != null) {
                        ProtocolProjector projector=new ProtocolProjector();
                        
                        DefaultModuleContext context=new DefaultModuleContext(res, module, null);
                        
                        java.util.Set<Module> projected=projector.project(context, module, logger);
                        
                        for (Module m : projected) {
                            if (m.getLocatedRole().getName().equals(action.getRole())) {
                                ret.setDefinition(m.toString());
                                break;
                            }
                        }
                    }
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }                

                // TODO: Temporary graph
                ret.setGraph("digraph Hello {\n" +
                            "    a -> b [label=hello];\n" +
                            "    b -> c;\n" +
                            "    b -> d;\n" +
                            "    d -> a;\n" +
                            "    }");
            }
        }

        return ret;
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.web.api.actions.ActionManager#verify(org.scribble.tools.web.api.actions.VerifyProtocolAction)
     */
    @Override
    public List<Marker> verify(VerifyProtocolAction action) {
        List<Marker> ret=new ArrayList<Marker>();
        
        Protocol p=definitionManager.getProtocol(action.getModule(), action.getProtocol());
        
        if (p != null) {
            ProtocolParser pp=new ProtocolParser();
            
            MarkerIssueLogger logger=new MarkerIssueLogger();
            
            ByteArrayInputStream is=new ByteArrayInputStream(p.getDefinition().getBytes());
            
            Resource res=new InputStreamResource(action.getProtocol(), is);
            
            try {
                Module module=pp.parse(res, null, logger);
                
                if (logger.getMarkers().isEmpty()) {
                    ProtocolValidator pv=new ProtocolValidator();
                    DefaultModuleContext context=new DefaultModuleContext(null, module, null);
                    pv.validate(context, module, logger);
                    ret.addAll(logger.getMarkers());
                } else {
                    ret.addAll(logger.getMarkers());
                }
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        
        return ret;
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.web.api.services.ActionManager#getRoles(java.lang.String, java.lang.String)
     */
    @Override
    public Set<RoleInfo> getRoles(String moduleName, String protocolName) {
        Set<RoleInfo> ret=new HashSet<RoleInfo>();
        Protocol p=definitionManager.getProtocol(moduleName, protocolName);
        
        if (p != null) {
            ProtocolParser pp=new ProtocolParser();
            
            MarkerIssueLogger logger=new MarkerIssueLogger();
            
            ByteArrayInputStream is=new ByteArrayInputStream(p.getDefinition().getBytes());
            
            Resource res=new InputStreamResource(protocolName, is);
            
            try {
                Module module=pp.parse(res, null, logger);
                
                if (module != null) {
                    ProtocolProjector projector=new ProtocolProjector();
                    
                    DefaultModuleContext context=new DefaultModuleContext(res, module, null);
                    
                    java.util.Set<Module> projected=projector.project(context, module, logger);
                    
                    for (Module m : projected) {
                        ret.add(new RoleInfo(m.getLocatedRole().getName()));
                    }
                }
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        
        return ret;
    }

}
