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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.scribble.tools.api.Content;
import org.scribble.tools.api.ContentManager;
import org.scribble.tools.api.Path;

/**
 * @author gbrown
 */
public class InMemoryContentManagerImpl implements ContentManager {

    private static Map<Path,Content> contents=new ConcurrentHashMap<Path,Content>();

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ContentManager#getContentPaths(org.scribble.tools.api.Path)
     */
    @Override
    public List<Path> getContentPaths(Path path) {
        if (path.isContent()) {
            throw new RuntimeException("Path must be folder based (without an extension)");
        }
        List<Path> ret=new ArrayList<Path>();
        
        for (Path p : contents.keySet()) {
            if (p.isContainedBy(path)) {
                ret.add(p);
            }
        }

        return ret;
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ContentManager#getContent(org.scribble.tools.api.Path)
     */
    @Override
    public Content getContent(Path path) {
        if (!path.isContent()) {
            throw new RuntimeException("Path must be content based (with an extension)");
        }
        return contents.get(path);
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ContentManager#setContent(org.scribble.tools.api.Path, org.scribble.tools.api.Content)
     */
    @Override
    public void setContent(Path path, Content content) {
        if (!path.isContent()) {
            throw new RuntimeException("Path must be content based (with an extension)");
        }
        contents.put(path, content);
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ContentManager#rename(org.scribble.tools.api.Path, org.scribble.tools.api.Path)
     */
    @Override
    public void rename(Path from, Path to) {
        for (Path path : contents.keySet()) {
            if (path.isContainedBy(from)) {
                path.rename(from, to);
            }
        }
    }

}
