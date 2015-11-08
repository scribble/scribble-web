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
package org.scribble.tools.cm.filesystem;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.File;
import java.util.List;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.scribble.tools.api.Content;
import org.scribble.tools.api.Path;

/**
 * @author gbrown
 */
public class FileContentManagerImplTest {

    private static final String scribblePath = System.getProperty("user.dir")
            + File.separator + "target" + File.separator + "test-classes" + File.separator + "scribble";

    @BeforeClass
    public static void init() {
        System.setProperty("SCRIBBLE_PATH", scribblePath);
    }

    @AfterClass
    public static void close() {
        System.getProperties().remove("SCRIBBLE_PATH");
    }

    @Test
    public void testGetContentPathsRoot() {
        FileContentManagerImpl impl = new FileContentManagerImpl();

        List<Path> paths = impl.getContentPaths(new Path());

        assertNotNull(paths);
        assertEquals(2, paths.size());

        assertEquals("/top/suba/ModuleA.spr", paths.get(0).toString());
        assertEquals("/top/subb/ModuleB.spr", paths.get(1).toString());
    }

    @Test
    public void testGetContentWithMetadata() {
        FileContentManagerImpl impl = new FileContentManagerImpl();

        Content content = impl.getContent(new Path("/top/suba/ModuleA.spr"));

        assertNotNull(content);
        assertEquals("This is ModuleA", content.getDescription());
        assertEquals("Joe Bloggs", content.getAuthor());
        assertNotNull(content.getData());
        assertTrue(content.getData().startsWith("module top.suba.ModuleA;"));
    }

    @Test
    public void testGetContentWithoutMetadata() {
        FileContentManagerImpl impl = new FileContentManagerImpl();

        Content content = impl.getContent(new Path("/top/subb/ModuleB.spr"));

        assertNotNull(content);
        assertNull(content.getDescription());
        assertNull(content.getAuthor());
        assertNotNull(content.getData());
        assertTrue(content.getData().startsWith("module top.subb.ModuleB;"));
    }

    @Test
    public void testSetContentAndUpdate() {
        FileContentManagerImpl impl = new FileContentManagerImpl();

        Content original = new Content();
        original.setData("module top.subc.ModuleC;");
        original.setDescription("This is ModuleC");
        original.setAuthor("Fred Bloggs");

        try {
            impl.setContent(new Path("/top/subc/ModuleC.spr"), original);
        } catch (Throwable t) {
            t.printStackTrace();
            fail("Failed to set content");
        }

        Content content = impl.getContent(new Path("/top/subc/ModuleC.spr"));

        assertNotNull(content);
        assertEquals(original.getAuthor(), content.getAuthor());
        assertEquals(original.getDescription(), content.getDescription());
        assertEquals(original.getData(), content.getData());

        content.setDescription("Changed description for ModuleC");
        content.setData("module top.subc.ModuleC;\r\n\r\nprotocol C() {\r\n}");

        try {
            impl.setContent(new Path("/top/subc/ModuleC.spr"), content);
        } catch (Throwable t) {
            t.printStackTrace();
            fail("Failed to set content");
        }

        Content content2 = impl.getContent(new Path("/top/subc/ModuleC.spr"));

        assertNotNull(content2);
        assertEquals(content.getAuthor(), content2.getAuthor());
        assertEquals(content.getDescription(), content2.getDescription());
        assertEquals(content.getData(), content2.getData());

        impl.remove(new Path("/top/subc"));
    }

    @Test
    public void testRename() {
        FileContentManagerImpl impl = new FileContentManagerImpl();

        Content original = new Content();
        original.setData("module top.subc.ModuleC;");
        original.setDescription("This is ModuleC");
        original.setAuthor("Fred Bloggs");

        try {
            impl.setContent(new Path("/top/subc/ModuleC.spr"), original);
        } catch (Throwable t) {
            t.printStackTrace();
            fail("Failed to set content");
        }

        Content content = impl.getContent(new Path("/top/subc/ModuleC.spr"));

        assertNotNull(content);
        assertEquals(original.getAuthor(), content.getAuthor());
        assertEquals(original.getDescription(), content.getDescription());
        assertEquals(original.getData(), content.getData());

        try {
            impl.rename(new Path("/top/subc/ModuleC.spr"), new Path("/top/subd/ModuleD.spr"));
        } catch (Throwable t) {
            t.printStackTrace();
            fail("Failed to rename");
        }

        Content content2 = impl.getContent(new Path("/top/subd/ModuleD.spr"));

        assertNotNull(content2);
        assertEquals(content.getAuthor(), content2.getAuthor());
        assertEquals(content.getDescription(), content2.getDescription());
        assertEquals(content.getData(), content2.getData());

        impl.remove(new Path("/top/subd"));
    }

    @Test
    public void testDelete() {
        FileContentManagerImpl impl = new FileContentManagerImpl();

        Content original = new Content();
        original.setData("module top.subc.ModuleC;");
        original.setDescription("This is ModuleC");
        original.setAuthor("Fred Bloggs");

        try {
            impl.setContent(new Path("/top/subc/ModuleC.spr"), original);
        } catch (Throwable t) {
            t.printStackTrace();
            fail("Failed to set content");
        }

        impl.remove(new Path("/top/subc/ModuleC.spr"));

        Content content = impl.getContent(new Path("/top/subc/ModuleC.spr"));

        assertNull(content);
    }

}
