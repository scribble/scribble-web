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

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import org.scribble.tools.api.Content;
import org.scribble.tools.api.ContentManager;
import org.scribble.tools.api.Path;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author gbrown
 */
public class FileContentManagerImpl implements ContentManager {

    private static final Logger log = Logger.getLogger(FileContentManagerImpl.class.getName());

    /**  */
    private static final String SCRIBBLE_PATH = "SCRIBBLE_PATH";

    private static final String DEFAULT_SCRIBBLE_PATH = System.getProperty("user.home") + File.separator + ".scribble";

    private static String scribblePath = System.getProperty(SCRIBBLE_PATH, DEFAULT_SCRIBBLE_PATH);

    private static final ObjectMapper mapper = new ObjectMapper();

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ContentManager#getContentPaths(org.scribble.tools.api.Path)
     */
    @Override
    public List<Path> getContentPaths(Path path) {
        if (path.isContent()) {
            throw new RuntimeException("Path must be folder based (without an extension)");
        }
        List<Path> ret = new ArrayList<Path>();

        File location = getPath(path);

        if (location != null && location.exists()) {
            findContentPaths(ret, location);
        }

        return ret;
    }

    /**
     * This method recursively scans the location for content paths.
     *
     * @param paths
     * @param location
     */
    protected void findContentPaths(List<Path> paths, File location) {
        for (File sub : location.listFiles()) {
            if (sub.isFile() && !sub.isHidden()) {
                paths.add(new Path(sub.getAbsolutePath().substring(scribblePath.length())));
            } else if (sub.isDirectory()) {
                findContentPaths(paths, sub);
            }
        }
    }

    /**
     * This method returns the file associated with the supplied
     * path.
     *
     * @param path The path
     * @return The file, or null if not found
     */
    protected File getPath(Path path) {
        if (path.isRelative()) {
            throw new RuntimeException("Path must NOT be relative");
        }

        File root = new File(scribblePath);
        
        if (!root.exists()) {
            // Create root folder
            root.mkdirs();
        }

        if (root.exists()) {
            return new File(root, path.toString());
        }

        log.severe("Root scribble folder '" + scribblePath + "' does not exist");

        return null;
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ContentManager#getContent(org.scribble.tools.api.Path)
     */
    @Override
    public Content getContent(Path path) {
        if (!path.isContent()) {
            throw new RuntimeException("Path must be content based (with an extension)");
        }

        File data = getPath(path);

        if (data != null && data.exists()) {
            File info = new File(data.getParentFile(), "." + data.getName() + ".info");

            Content content = null;

            if (info != null && info.exists()) {
                try {
                    content = mapper.readValue(info, Content.class);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to parse info file '" + info + "'", e);
                }
            }

            if (content == null) {
                content = new Content();
            }

            content.setLastModified(data.lastModified());

            try {
                FileInputStream fr = new FileInputStream(data);

                byte[] b = new byte[1024];
                int len = 0;
                StringBuffer buf = new StringBuffer();

                while ((len = fr.read(b)) > 0) {
                    buf.append(new String(b, 0, len));
                }

                fr.close();

                content.setData(buf.toString());
            } catch (Exception e) {
                throw new RuntimeException("Failed to read data file '" + data + "'", e);
            }

            return content;
        }

        return null;
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ContentManager#setContent(org.scribble.tools.api.Path, org.scribble.tools.api.Content)
     */
    @Override
    public void setContent(Path path, Content content) {
        if (!path.isContent()) {
            throw new RuntimeException("Path must be content based (with an extension)");
        }

        File data = getPath(path);

        if (data != null) {

            // Check if file already exists
            if (data.exists()) {
                // Check is a file
                if (!data.isFile()) {
                    throw new RuntimeException("Unable to save content - path '" + path
                            + "' exists, but is not a file");
                }
            } else {
                // Check if parent folder exists
                if (!data.getParentFile().exists()) {
                    if (!data.getParentFile().mkdirs()) {
                        throw new RuntimeException("Unable to create folder hierarchy for path '" + path + "'");
                    }
                }
            }

            File info = new File(data.getParentFile(), "." + data.getName() + ".info");

            Content toStore = new Content(content);
            toStore.setData(null);
            toStore.setLastModified(System.currentTimeMillis());

            if (info != null) {
                if (!info.exists()) {
                    toStore.setCreated(System.currentTimeMillis());
                }
                try {
                    mapper.writeValue(info, toStore);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to write info file '" + info + "'", e);
                }
            }

            try {
                FileOutputStream fos = new FileOutputStream(data);
                if (content.getData() != null) {
                    fos.write(content.getData().getBytes());
                } else {
                    fos.write(new byte[0]);
                }
                fos.flush();
                fos.close();
            } catch (Exception e) {
                throw new RuntimeException("Failed to write data file '" + data + "'", e);
            }
        }
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ContentManager#rename(org.scribble.tools.api.Path, org.scribble.tools.api.Path)
     */
    @Override
    public void rename(Path from, Path to) {
        if (!from.isContent()) {
            throw new RuntimeException("Path '" + from + "' must be content based (with an extension)");
        }

        File fromData = getPath(from);
        File toData = getPath(to);

        if (fromData != null && toData != null && fromData.exists()) {
            try {
                toData.getParentFile().mkdirs();

                Files.move(fromData.toPath(), toData.toPath());

                File fromInfo = new File(fromData.getParentFile(), "." + fromData.getName() + ".info");

                if (fromInfo.exists()) {
                    File toInfo = new File(toData.getParentFile(), "." + toData.getName() + ".info");
                    Files.move(fromInfo.toPath(), toInfo.toPath());
                }
            } catch (Exception e) {
                throw new RuntimeException("Failed to move from '" + from + "' to '" + to + "'", e);
            }
        }
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ContentManager#remove(org.scribble.tools.api.Path)
     */
    @Override
    public void remove(Path path) {
        File data = getPath(path);

        if (data != null && data.exists()) {
            if (data.isFile()) {
                // Delete metadata file
                File info = new File(data.getParentFile(), "." + data.getName() + ".info");
                if (info.exists()) {
                    info.delete();
                }
            }
            delete(data);
        }
    }

    /**
     * This method deletes the supplied path, recursively if
     * it is a folder.
     *
     * @param path The path
     */
    protected void delete(File path) {
        if (path.isDirectory()) {
            for (File file : path.listFiles()) {
                delete(file);
            }
        }
        path.delete();
    }
}
