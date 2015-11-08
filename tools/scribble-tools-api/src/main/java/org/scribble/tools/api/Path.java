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

import java.util.Arrays;

/**
 * @author gbrown
 */
public class Path {

    private String[] parts;
    private boolean relative = true;

    public Path() {
        parts = new String[0];
        relative = false;
    }

    public Path(String path) {
        if (path.startsWith(java.io.File.separator)) {
            relative = false;
            path = path.substring(1);
        }
        if (path.trim().length() == 0) {
            parts = new String[0];
        } else {
            parts = path.split(java.io.File.separator);
        }
    }

    public Path(Path parent, String child) {
        parts = new String[parent.parts.length + 1];
        for (int i=0; i < parent.parts.length; i++) {
            parts[i] = parent.parts[i];
        }
        parts[parent.parts.length] = child;
        relative = parent.relative;
    }

    protected Path(String[] parts, boolean relative) {
        this.parts = parts;
        this.relative = relative;
    }

    public Path getParent() {
        String[] parent=new String[parts.length-1];
        for (int i=0; i < parts.length-1; i++) {
            parent[i] = parts[i];
        }
        return (new Path(parent, isRelative()));
    }
    
    public boolean isContent() {
        return parts.length > 0 && parts[parts.length-1].indexOf('.') != -1;
    }
    
    public boolean isFolder() {
        return parts[parts.length-1].indexOf('.') == -1;
    }
    
    protected String[] getParts() {
        return parts;
    }
    
    public void rename(Path from, Path to) {
        if (isContainedBy(from)) {
            String[] newparts=new String[parts.length - from.parts.length + to.parts.length];
            for (int i=0; i < to.parts.length; i++) {
                newparts[i] = to.parts[i];
            }
            for (int i=0; i < (parts.length - from.parts.length); i++) {
                newparts[i+to.parts.length] = parts[i+from.parts.length];
            }
            parts = newparts;
        } else if (from.equals(this)) {
            parts = to.parts;
        } else {
            throw new RuntimeException("This path is not contained within 'from' path: "+from);
        }
    }
    
    public boolean isContainedBy(Path path) {
        if (parts.length > path.getParts().length) {
            for (int i=0; i < path.getParts().length; i++) {
                if (!parts[i].equals(path.getParts()[i])) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    
    public String getExtension() {
        if (parts.length > 0) {
            int pos=parts[parts.length-1].lastIndexOf('.');
            
            if (pos != -1) {
                return parts[parts.length-1].substring(pos+1);
            }
        }
        return null;
    }
    
    public boolean hasExtension(String extension) {
        String ext = getExtension();
        if (ext != null && extension != null) {
            return ext.equals(extension);
        }
        return false;
    }
    
    public boolean isRelative() {
        return relative;
    }

    public String toString() {
        StringBuffer buf=new StringBuffer();
        
        for (int i=0; i < parts.length; i++) {
            if (i > 0 || !isRelative()) {
                buf.append(java.io.File.separator);
            }
            buf.append(parts[i]);
        }
        
        return buf.toString();
    }

    /* (non-Javadoc)
     * @see java.lang.Object#hashCode()
     */
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + Arrays.hashCode(parts);
        result = prime * result + (relative ? 1231 : 1237);
        return result;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#equals(java.lang.Object)
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Path other = (Path) obj;
        if (!Arrays.equals(parts, other.parts))
            return false;
        if (relative != other.relative)
            return false;
        return true;
    }

}
