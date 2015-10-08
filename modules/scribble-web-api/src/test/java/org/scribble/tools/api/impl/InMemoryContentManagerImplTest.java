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
package org.scribble.tools.api.impl;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.Test;
import org.scribble.tools.api.Content;
import org.scribble.tools.api.ContentManager;
import org.scribble.tools.api.Path;
import org.scribble.tools.api.impl.InMemoryContentManagerImpl;

/**
 * @author gbrown
 */
public class InMemoryContentManagerImplTest {

    @Test
    public void testGetContent() {
        ContentManager cm=new InMemoryContentManagerImpl();
        
        Path path=new Path("/a/b/c/D.e");

        Content content1=new Content();
        content1.setData("Hello World");
        cm.setContent(path, content1);
        
        Content result = cm.getContent(path);
        
        assertNotNull(result);
        assertEquals(content1, result);
    }

    @Test
    public void testGetContentPaths() {
        ContentManager cm=new InMemoryContentManagerImpl();
        
        Content content1=new Content();
        content1.setData("Hello World");
        cm.setContent(new Path("/a/b/c/D.e"), content1);
        
        Content content2=new Content();
        content2.setData("Joe Bloggs");
        cm.setContent(new Path("/a/b/d/e/F.g"), content2);
        
        List<Path> res1=cm.getContentPaths(new Path("/a/b"));
        
        assertEquals(2, res1.size());
        
        List<Path> res2=cm.getContentPaths(new Path("/a/b/c"));
        
        assertEquals(1, res2.size());
        
        List<Path> res3=cm.getContentPaths(new Path("/a/b/d/e"));
        
        assertEquals(1, res3.size());
    }

}
