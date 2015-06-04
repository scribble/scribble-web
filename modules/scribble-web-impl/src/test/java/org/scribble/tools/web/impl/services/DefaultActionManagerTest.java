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

import static org.junit.Assert.*;

import java.util.List;

import org.junit.Test;
import org.scribble.tools.web.api.model.Marker;
import org.scribble.tools.web.api.model.ProjectProtocolAction;
import org.scribble.tools.web.api.model.Protocol;
import org.scribble.tools.web.api.model.ProtocolProjection;
import org.scribble.tools.web.api.model.VerifyProtocolAction;
import org.scribble.tools.web.api.services.DefinitionManager;

/**
 * @author gbrown
 */
public class DefaultActionManagerTest {

    /**  */
    private static final String TEST_MODULE = "TestModule";
    /**  */
    private static final String TEST_ROLE1 = "TestRole1";
    /**  */
    private static final String TEST_ROLE2 = "TestRole2";
    /**  */
    private static final String TEST_ROLE3 = "TestRole3";
    /**  */
    private static final String TEST_PROTOCOL = "TestProtocol";

    @Test
    public void testProject() {
        DefaultActionManager am=new DefaultActionManager();
        
        DefinitionManager dm=new InMemoryDefinitionManager();
        am.setDefinitionManager(dm);
        
        Protocol p=new Protocol();
        p.setDefinition("module "+TEST_MODULE+";\r\nglobal protocol "+
                    TEST_PROTOCOL+"(role "+TEST_ROLE1+",role "+TEST_ROLE2+") {\r\n\tmesg() from "+
                    TEST_ROLE1+" to "+TEST_ROLE2+";\r\n}\r\n");

        try {
            dm.updateProtocol(TEST_MODULE, TEST_PROTOCOL, p);
        } catch (Exception e) {
            fail("Failed to update protocol: "+e);
        }
        
        ProjectProtocolAction action=new ProjectProtocolAction();
        action.setModule(TEST_MODULE);
        action.setProtocol(TEST_PROTOCOL);
        action.setRole(TEST_ROLE1);

        ProtocolProjection projection=am.project(action);
        
        assertNotNull("Projection should not be null", projection);
        
        assertNotNull("Definition should not be null", projection.getDefinition());
    }

    @Test
    public void testVerify() {
        DefaultActionManager am=new DefaultActionManager();
        
        DefinitionManager dm=new InMemoryDefinitionManager();
        am.setDefinitionManager(dm);
        
        Protocol p=new Protocol();
        p.setDefinition("module "+TEST_MODULE+";\r\nglobal protocol "+
                    TEST_PROTOCOL+"(role "+TEST_ROLE1+", "+TEST_ROLE2+") {\r\n\tmesg() from "+
                    TEST_ROLE1+" to "+TEST_ROLE3+";\r\n}\r\n");

        try {
            dm.updateProtocol(TEST_MODULE, TEST_PROTOCOL, p);
        } catch (Exception e) {
            fail("Failed to update protocol: "+e);
        }
        
        VerifyProtocolAction action=new VerifyProtocolAction();
        action.setModule(TEST_MODULE);
        action.setProtocol(TEST_PROTOCOL);

        List<Marker> markers=am.verify(action);
        
        assertNotNull("Marker list should not be null", markers);
        
        assertNotNull("Should be 1 marker", markers.size() == 1);
    }

}
