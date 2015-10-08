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
public class PathTest {

    @Test
    public void testRenameContainedToLongerPath() {
        Path path=new Path("/first/second/third/fourth/fifth");
        Path fromPath=new Path("/first/second");
        Path toPath=new Path("/hello/world/fred");
        Path expected=new Path("/hello/world/fred/third/fourth/fifth");
        
        path.rename(fromPath, toPath);
        
        assertEquals(expected, path);
    }

    @Test
    public void testRenameContainedToShorterPath() {
        Path path=new Path("/first/second/third/fourth/fifth");
        Path fromPath=new Path("/first/second/third");
        Path toPath=new Path("/hello/world");
        Path expected=new Path("/hello/world/fourth/fifth");
        
        path.rename(fromPath, toPath);
        
        assertEquals(expected, path);
    }

    @Test
    public void testRenameFullPath() {
        Path path=new Path("/first/second/third/fourth/fifth");
        Path fromPath=new Path("/first/second/third/fourth/fifth");
        Path toPath=new Path("/hello/world");
        Path expected=new Path("/hello/world");
        
        path.rename(fromPath, toPath);
        
        assertEquals(expected, path);
    }

    @Test
    public void testRenameNonContainedFrom() {
        Path path=new Path("/first/second/third/fourth/fifth");
        Path fromPath=new Path("/first/second/third");
        Path toPath=new Path("/hello/world");
        
        try {
            path.rename(fromPath, toPath);
            
            fail("Should have generated a runtime exception");
        } catch (Throwable t) {
            // Ignore
        }
    }

    @Test
    public void testIsFolder() {
        Path path=new Path("/first/second");
        assertTrue(path.isFolder());
    }

    @Test
    public void testIsNotFolder() {
        Path path=new Path("/first/second.file");
        assertFalse(path.isFolder());
    }

    @Test
    public void testIsContent() {
        Path path=new Path("/first/second.file");
        assertTrue(path.isContent());
    }

    @Test
    public void testIsNotContent() {
        Path path=new Path("/first/second");
        assertFalse(path.isContent());
    }

    @Test
    public void testIsNotContentRoot() {
        Path path=new Path("/");
        assertFalse(path.isContent());
    }
    
    @Test
    public void testIsContainedByRootTrue() {
        Path p1=new Path("/");
        Path p2=new Path("/hello");
        
        assertTrue(p2.isContainedBy(p1));
    }

    @Test
    public void testIsContainedByRootFalse() {
        Path p1=new Path("/");
        Path p2=new Path("/hello");
        
        assertFalse(p1.isContainedBy(p2));
    }

    @Test
    public void testIsContainedByTrue() {
        Path p1=new Path("/hello");
        Path p2=new Path("/hello/world");
        
        assertTrue(p2.isContainedBy(p1));
    }

    @Test
    public void testIsContainedByFalse() {
        Path p1=new Path("/hello");
        Path p2=new Path("/hello/world");
        
        assertFalse(p1.isContainedBy(p2));
    }

    @Test
    public void testGetExtensionContent() {
        Path path=new Path("/first/second.file");
        assertEquals("file", path.getExtension());
    }

    @Test
    public void testGetExtensionFolder() {
        Path path=new Path("/first/second");
        assertNull(path.getExtension());
    }

    @Test
    public void testIsRelativeFalse() {
        Path path=new Path("/first/second");
        assertFalse(path.isRelative());
    }

    @Test
    public void testIsRelativeContainedTrue() {
        Path path=new Path("first/second");
        assertTrue(path.isRelative());
    }

    @Test
    public void testIsRelativeAboveTrue() {
        Path path=new Path("../first/second");
        assertTrue(path.isRelative());
    }

    @Test
    public void testToStringRelative() {
        Path path=new Path("../first/second");
        assertEquals("../first/second", path.toString());
    }

    @Test
    public void testToStringAbsolute() {
        Path path=new Path("/first/second");
        assertEquals("/first/second", path.toString());
    }

}
