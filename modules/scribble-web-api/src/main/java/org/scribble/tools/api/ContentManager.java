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

import java.util.List;

/**
 * @author gbrown
 */
public interface ContentManager {
    
    /**
     * This method returns all of the content paths contained within
     * the supplied path.
     *
     * @param path The path
     * @return The content paths contained within the supplied path
     */
    List<Path> getContentPaths(Path path);

    /**
     * This method returns the content associated with the supplied path.
     *
     * @param path The path
     * @return The content, or null if not found
     */
    Content getContent(Path path);

    /**
     * This method sets the content associated with the supplied path.
     *
     * @param path The path
     * @param content The content to be set
     */
    void setContent(Path path, Content content);

    /**
     * This method renames the content contained within the supplied
     * 'from' path to the 'to' path.
     *
     * @param from The 'from' path
     * @param to The 'to' path
     */
    void rename(Path from, Path to);

}
