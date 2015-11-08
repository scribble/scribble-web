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
package org.scribble.tools.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.scribble.logging.IssueLogger;
import org.scribble.model.ModelObject;
import org.scribble.tools.api.Issue;
import org.scribble.tools.api.Issue.Severity;

/**
 * @author gbrown
 */
public class MarkerIssueLogger implements IssueLogger {
    
    private List<Issue> markers=new ArrayList<Issue>();

    /**
     * This method returns the markers.
     *
     * @return The markers
     */
    public List<Issue> getIssues() {
        return markers;
    }

    /* (non-Javadoc)
     * @see org.scribble.logging.IssueLogger#error(java.lang.String, java.util.Map)
     */
    @Override
    public void error(String arg0, Map<String, Object> arg1) {
        //System.out.println("ERROR: "+arg0);
        Issue marker=new Issue();
        marker.setDescription(arg0);
        marker.setSeverity(Severity.Error);
        if (arg1.containsKey("start.line")) {
            marker.setStartLine((Integer)arg1.get("start.line"));
        }
        if (arg1.containsKey("start.column")) {
            marker.setStartPos((Integer)arg1.get("start.column"));
        }
        if (arg1.containsKey("end.line")) {
            marker.setEndLine((Integer)arg1.get("end.line"));
        }
        if (arg1.containsKey("end.column")) {
            marker.setEndPos((Integer)arg1.get("end.column"));
        }
        markers.add(marker);
    }

    /* (non-Javadoc)
     * @see org.scribble.logging.IssueLogger#error(java.lang.String, org.scribble.model.ModelObject)
     */
    @Override
    public void error(String arg0, ModelObject arg1) {
        //System.out.println("ERROR: "+arg0);
        Issue marker=new Issue();
        marker.setDescription(arg0);
        marker.setSeverity(Severity.Error);
        if (arg1.getProperties().containsKey("start.line")) {
            marker.setStartLine((Integer)arg1.getProperties().get("start.line"));
        }
        if (arg1.getProperties().containsKey("start.column")) {
            marker.setStartPos((Integer)arg1.getProperties().get("start.column"));
        }
        if (arg1.getProperties().containsKey("end.line")) {
            marker.setEndLine((Integer)arg1.getProperties().get("end.line"));
        }
        if (arg1.getProperties().containsKey("end.column")) {
            marker.setEndPos((Integer)arg1.getProperties().get("end.column"));
        }
        markers.add(marker);
    }

    /* (non-Javadoc)
     * @see org.scribble.logging.IssueLogger#info(java.lang.String, java.util.Map)
     */
    @Override
    public void info(String arg0, Map<String, Object> arg1) {
        //System.out.println("INFO: "+arg0);
    }

    /* (non-Javadoc)
     * @see org.scribble.logging.IssueLogger#info(java.lang.String, org.scribble.model.ModelObject)
     */
    @Override
    public void info(String arg0, ModelObject arg1) {
        //System.out.println("INFO: "+arg0);
    }

    /* (non-Javadoc)
     * @see org.scribble.logging.IssueLogger#warning(java.lang.String, java.util.Map)
     */
    @Override
    public void warning(String arg0, Map<String, Object> arg1) {
        //System.out.println("WARNING: "+arg0);
        Issue marker=new Issue();
        marker.setDescription(arg0);
        marker.setSeverity(Severity.Warning);
        if (arg1.containsKey("start.line")) {
            marker.setStartLine((Integer)arg1.get("start.line"));
        }
        if (arg1.containsKey("start.column")) {
            marker.setStartPos((Integer)arg1.get("start.column"));
        }
        if (arg1.containsKey("end.line")) {
            marker.setEndLine((Integer)arg1.get("end.line"));
        }
        if (arg1.containsKey("end.column")) {
            marker.setEndPos((Integer)arg1.get("end.column"));
        }
        markers.add(marker);
    }

    /* (non-Javadoc)
     * @see org.scribble.logging.IssueLogger#warning(java.lang.String, org.scribble.model.ModelObject)
     */
    @Override
    public void warning(String arg0, ModelObject arg1) {
        //System.out.println("WARNING: "+arg0);
        Issue marker=new Issue();
        marker.setDescription(arg0);
        marker.setSeverity(Severity.Warning);
        if (arg1.getProperties().containsKey("start.line")) {
            marker.setStartLine((Integer)arg1.getProperties().get("start.line"));
        }
        if (arg1.getProperties().containsKey("start.column")) {
            marker.setStartPos((Integer)arg1.getProperties().get("start.column"));
        }
        if (arg1.getProperties().containsKey("end.line")) {
            marker.setEndLine((Integer)arg1.getProperties().get("end.line"));
        }
        if (arg1.getProperties().containsKey("end.column")) {
            marker.setEndPos((Integer)arg1.getProperties().get("end.column"));
        }
        markers.add(marker);
    }

}
