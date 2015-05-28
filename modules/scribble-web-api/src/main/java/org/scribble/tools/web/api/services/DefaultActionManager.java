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
package org.scribble.tools.web.api.services;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.scribble.tools.web.api.model.Marker;
import org.scribble.tools.web.api.model.ProjectProtocolAction;
import org.scribble.tools.web.api.model.Protocol;
import org.scribble.tools.web.api.model.ProtocolProjection;
import org.scribble.tools.web.api.model.VerifyProtocolAction;
import org.scribble.tools.web.api.model.Marker.Severity;

/**
 * @author gbrown
 */
public class DefaultActionManager implements ActionManager {

    @Inject
    private DefinitionManager definitionManager;

    /* (non-Javadoc)
     * @see org.scribble.tools.web.api.actions.ActionManager#project(org.scribble.tools.web.api.actions.ProjectProtocolAction)
     */
    @Override
    public ProtocolProjection project(ProjectProtocolAction action) {
        ProtocolProjection ret=new ProtocolProjection();
        
        if (action.getDefinitions().isEmpty()) {
            Protocol p=definitionManager.getProtocol(action.getModule(), action.getProtocol());
            
            if (p != null) {
                ret.setDefinition(p.getDefinition());
                
                ret.setGraph("digraph {\n    a -> b;\n    }");
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
        
        Marker m1=new Marker();
        m1.setDescription("This is the first marker");
        m1.setSeverity(Severity.Error);
        m1.setStartLine(1);
        m1.setEndLine(1);
        m1.setStartPos(4);
        m1.setEndPos(10);
        ret.add(m1);

        Marker m2=new Marker();
        m2.setDescription("This is the second marker");
        m2.setSeverity(Severity.Warning);
        m2.setStartLine(1);
        m2.setEndLine(1);
        m2.setStartPos(7);
        m2.setEndPos(12);
        ret.add(m2);

        return ret;
    }

}
