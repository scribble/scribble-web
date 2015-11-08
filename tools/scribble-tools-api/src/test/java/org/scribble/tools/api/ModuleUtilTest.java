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
package org.scribble.tools.api;

import static org.junit.Assert.*;

import org.junit.Test;

/**
 * @author gbrown
 */
public class ModuleUtilTest {

    @Test
    public void testGetModuleRelative() {
        Path path=new Path("../hello/world.spr");
        
        try {
            ModuleUtil.getModule(path);

            fail("Should throw exception due to relative path");
        } catch (Throwable t) {
            // Ignore
        }
    }

    @Test
    public void testGetModuleNotContent() {
        Path path=new Path("/hello/world");
        
        try {
            ModuleUtil.getModule(path);

            fail("Should throw exception due to not content");
        } catch (Throwable t) {
            // Ignore
        }
    }

    @Test
    public void testGetModuleNotProtocol() {
        Path path=new Path("/hello/world.abc");
        
        try {
            ModuleUtil.getModule(path);

            fail("Should throw exception due to not protocol");
        } catch (Throwable t) {
            // Ignore
        }
    }

    @Test
    public void testGetModuleForProtocolSingleLevel() {
        Path path=new Path("/hello.spr");
        
        String module=ModuleUtil.getModule(path);

        assertEquals("hello", module);
    }

    @Test
    public void testGetModuleForProtocolMultiLevel() {
        Path path=new Path("/hello/world/this/is/a/protocol.spr");
        
        String module=ModuleUtil.getModule(path);

        assertEquals("hello.world.this.is.a.protocol", module);
    }

    @Test
    public void testGetPath() {
        Path path=ModuleUtil.getPath("hello.world");
        
        assertEquals("/hello/world.spr", path.toString());
    }
}
