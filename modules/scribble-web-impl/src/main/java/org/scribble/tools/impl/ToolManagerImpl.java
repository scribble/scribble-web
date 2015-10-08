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
package org.scribble.tools.impl;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.scribble.context.DefaultModuleContext;
import org.scribble.model.Module;
import org.scribble.parser.ProtocolParser;
import org.scribble.projection.ProtocolProjector;
import org.scribble.resources.InputStreamResource;
import org.scribble.resources.Resource;
import org.scribble.tools.api.Content;
import org.scribble.tools.api.ContentManager;
import org.scribble.tools.api.Issue;
import org.scribble.tools.api.Path;
import org.scribble.tools.api.Projection;
import org.scribble.tools.api.ToolManager;
import org.scribble.validation.ProtocolValidator;

/**
 * @author gbrown
 */
public class ToolManagerImpl implements ToolManager {
    
    @Inject
    private ContentManager contentManager;

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ToolManager#setContentManager(org.scribble.tools.api.ContentManager)
     */
    @Override
    public void setContentManager(ContentManager cm) {
        this.contentManager = cm;
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ToolManager#getContentManager()
     */
    @Override
    public ContentManager getContentManager() {
        return contentManager;
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ToolManager#validate(org.scribble.tools.api.Path)
     */
    @Override
    public List<Issue> validate(Path path) {
        List<Issue> ret=new ArrayList<Issue>();
        
        Content p=contentManager.getContent(path);
        
        if (p != null) {
            ProtocolParser pp=new ProtocolParser();
            
            MarkerIssueLogger logger=new MarkerIssueLogger();
            
            ByteArrayInputStream is=new ByteArrayInputStream(p.getData().getBytes());
            
            Resource res=new InputStreamResource(null, is);
            
            try {
                Module module=pp.parse(res, null, logger);
                
                if (logger.getIssues().isEmpty()) {
                    ProtocolValidator pv=new ProtocolValidator();
                    DefaultModuleContext context=new DefaultModuleContext(null, module, null);
                    pv.validate(context, module, logger);
                    ret.addAll(logger.getIssues());
                } else {
                    ret.addAll(logger.getIssues());
                }
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        
        return ret;
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ToolManager#project(org.scribble.tools.api.Path)
     */
    @Override
    public Map<String,Projection> project(Path path) {
        Map<String,Projection> ret=new HashMap<String,Projection>();
        
        Content p=contentManager.getContent(path);
        
        if (p != null) {
            ProtocolParser pp=new ProtocolParser();
            
            MarkerIssueLogger logger=new MarkerIssueLogger();
            
            ByteArrayInputStream is=new ByteArrayInputStream(p.getData().getBytes());
            
            Resource res=new InputStreamResource(null, is);
            
            try {
                Module module=pp.parse(res, null, logger);
                
                if (module != null) {
                    ProtocolProjector projector=new ProtocolProjector();
                    
                    DefaultModuleContext context=new DefaultModuleContext(res, module, null);
                    
                    java.util.Set<Module> projected=projector.project(context, module, logger);
                    
                    for (Module m : projected) {
                        Projection projection=new Projection();
                        projection.setRole(m.getLocatedRole().getName());
                        projection.setDefinition(m.toString());
                        projection.setGraph("digraph "+m.getLocalName()+"_"+m.getLocatedRole().getName()+" {\n" +
                                "    a -> b [label=hello];\n" +
                                "    b -> c;\n" +
                                "    b -> d;\n" +
                                "    d -> a;\n" +
                                "    }");
                        ret.put(m.getLocatedRole().getName(),projection);
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
