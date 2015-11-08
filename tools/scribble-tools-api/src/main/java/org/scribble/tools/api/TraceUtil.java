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

/**
 * @author gbrown
 */
public class TraceUtil {

    /**  */
    public static final String TRACE_EXTENSION = "trace";

    /**
     * This method returns the path for the folder that
     * contains trace files associated with the supplied
     * module.
     *
     * @param module
     * @return The trace folder
     */
    public static Path getFolder(String module) {
        return (new Path("/" + module.replace('.', '/')));
    }

    /**
     * This method returns the path for the trace file
     * associated with the supplied module.
     *
     * @param module The module
     * @param trace The trace
     * @return The path
     */
    public static Path getPath(String module, String trace) {
        Path path=getFolder(module);
        return new Path(path, trace + "." + TRACE_EXTENSION);
    }
    
    /**
     * This method returns the trace name associated with the
     * supplied path.
     *
     * @param path The path
     * @return The trace name, or null if not found
     */
    public static String getTraceName(Path path) {
        if (path.toString().endsWith("."+TRACE_EXTENSION)) {
            String traceName = path.getParts()[path.getParts().length-1];
            traceName = traceName.substring(0, traceName.length()-TRACE_EXTENSION.length()-1);
            return traceName;
        }
        return null;
    }
}
