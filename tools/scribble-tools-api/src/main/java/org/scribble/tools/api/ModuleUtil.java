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
public class ModuleUtil {

    /**  */
    public static final String SPR_EXTENSION = "spr";

    /**
     * This method returns the module associated with the supplied
     * path.
     *
     * @param path The path
     * @return The module name
     */
    public static String getModule(Path path) {
        if (path.isRelative()) {
            throw new RuntimeException("Path must not be relative");
        } else if (!path.isContent()) {
            throw new RuntimeException("Path does not represent content");
        } else if (!path.getExtension().equals(SPR_EXTENSION)) {
            throw new RuntimeException("Path does not represent a Scribble Protocol module");
        }
        
        StringBuffer moduleName=new StringBuffer();

        for (String part : path.getParts()) {
            if (moduleName.length() > 0) {
                moduleName.append('.');
            }
            moduleName.append(part);
        }
        
        // Remove extension
        moduleName.delete(moduleName.length()-SPR_EXTENSION.length()-1, moduleName.length());
        
        return moduleName.toString();
    }
    
    /**
     * This method returns the path associated with the supplied
     * module.
     *
     * @param module The module
     * @return The path
     */
    public static Path getPath(String module) {
        String[] parts=module.split("\\.");
        parts[parts.length-1] = parts[parts.length-1] + "." + SPR_EXTENSION;
        
        return new Path(parts, false);
    }
    
}
