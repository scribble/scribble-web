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

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;
import org.scribble.context.DefaultModuleContext;
import org.scribble.model.Module;
import org.scribble.parser.ProtocolParser;
import org.scribble.projection.ProtocolProjector;
import org.scribble.resources.InputStreamResource;
import org.scribble.resources.Resource;
import org.scribble.resources.ResourceLocator;
import org.scribble.tools.api.Content;
import org.scribble.tools.api.ContentManager;
import org.scribble.tools.api.Issue;
import org.scribble.tools.api.ModuleUtil;
import org.scribble.tools.api.Issue.Severity;
import org.scribble.tools.api.Path;
import org.scribble.tools.api.Projection;
import org.scribble.tools.api.ToolManager;
import org.scribble.trace.model.Step;
import org.scribble.trace.model.Trace;
import org.scribble.trace.simulation.DefaultSimulatorContext;
import org.scribble.trace.simulation.SimulationListener;
import org.scribble.trace.simulation.Simulator;
import org.scribble.trace.simulation.SimulatorContext;
import org.scribble.validation.ProtocolValidator;

/**
 * @author gbrown
 */
public class ToolManagerImpl implements ToolManager {

    @Inject
    private ContentManager contentManager;

    private ObjectMapper mapper = new ObjectMapper();

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ToolManager#setContentManager(org.scribble.tools.api.ContentManager)
     */
    @Override
    public void setContentManager(ContentManager cm) {
        this.contentManager = cm;
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ToolManager#getContentManager()
     */
    @Override
    public ContentManager getContentManager() {
        return contentManager;
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ToolManager#validate(org.scribble.tools.api.Path)
     */
    @Override
    public List<Issue> validate(Path path) {
        List<Issue> ret = new ArrayList<Issue>();

        Content p = contentManager.getContent(path);

        if (p != null) {
            ProtocolParser pp = new ProtocolParser();

            MarkerIssueLogger logger = new MarkerIssueLogger();

            ByteArrayInputStream is = new ByteArrayInputStream(p.getData().getBytes());

            Resource res = new InputStreamResource(null, is);

            try {
                Module module = pp.parse(res, null, logger);

                if (logger.getIssues().isEmpty()) {
                    ProtocolValidator pv = new ProtocolValidator();
                    DefaultModuleContext context = new DefaultModuleContext(null, module, null);
                    pv.validate(context, module, logger);
                    ret.addAll(logger.getIssues());
                } else {
                    ret.addAll(logger.getIssues());
                }
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }

        return ret;
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ToolManager#project(org.scribble.tools.api.Path)
     */
    @Override
    public Map<String, Projection> project(Path path) {
        Map<String, Projection> ret = new HashMap<String, Projection>();

        Content p = contentManager.getContent(path);

        if (p != null) {
            ProtocolParser pp = new ProtocolParser();

            MarkerIssueLogger logger = new MarkerIssueLogger();

            ByteArrayInputStream is = new ByteArrayInputStream(p.getData().getBytes());

            Resource res = new InputStreamResource(null, is);

            try {
                Module module = pp.parse(res, null, logger);

                if (module != null) {
                    ProtocolProjector projector = new ProtocolProjector();

                    DefaultModuleContext context = new DefaultModuleContext(res, module, null);

                    java.util.Set<Module> projected = projector.project(context, module, logger);

                    for (Module m : projected) {
                        Projection projection = new Projection();
                        projection.setRole(m.getLocatedRole().getName());
                        projection.setDefinition(m.toString());
                        projection.setGraph("digraph " + m.getLocalName() + "_" + m.getLocatedRole().getName()
                                + " {\n" +
                                "    a -> b [label=hello];\n" +
                                "    b -> c;\n" +
                                "    b -> d;\n" +
                                "    d -> a;\n" +
                                "    }");
                        ret.put(m.getLocatedRole().getName(), projection);
                    }
                }
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }

        return ret;
    }

    /* (non-Javadoc)
     * @see org.scribble.tools.api.ToolManager#simulate(org.scribble.tools.api.Path, org.scribble.tools.api.Path)
     */
    @Override
    public List<Issue> simulate(Path modulePath, Path tracePath) {
        List<Issue> issues = new ArrayList<Issue>();

        Content traceContent = contentManager.getContent(tracePath);

        try {
            Trace trace = mapper.readValue(traceContent.getData(), Trace.class);

            SimulatorContext context = new DefaultSimulatorContext(new ResourceLocator() {
                @Override
                public Resource getResource(final String path) {
                    String newpath=path;
                    if (newpath.endsWith(".scr")) {
                        newpath = path.replaceAll(".scr", ".spr");
                    }
                    Path p=new Path("/"+newpath);
                    final Content content=contentManager.getContent(p);
                    if (content == null) {
                        return null;
                    }
                    Resource res=new Resource() {
                        @Override
                        public String getPath() {
                            return path;
                        }
                        @Override
                        public InputStream getInputStream() {
                            return new ByteArrayInputStream(content.getData().getBytes());
                        }                        
                    };
                    return res;
                }
            });

            Simulator simulator = new Simulator();

            final java.util.List<Step> failed = new java.util.ArrayList<Step>();

            SimulationListener l = new SimulationListener() {

                @Override
                public void start(Trace trace) {
                }

                @Override
                public void start(Trace trace, Step step) {
                }

                @Override
                public void successful(Trace trace, Step step) {
                }

                @Override
                public void failed(Trace trace, Step step) {
                    failed.add(step);
                }

                @Override
                public void stop(Trace trace) {
                }

            };

            simulator.addSimulationListener(l);

            simulator.simulate(context, trace);

            simulator.removeSimulationListener(l);

            if (failed.size() > 0) {
                for (Step step : failed) {
                    Issue issue = new Issue();
                    issue.setDescription("Step failed: " + step);
                    issue.setSeverity(Severity.Error);
                    issues.add(issue);
                }
            }
        } catch (Exception e) {
            Issue issue = new Issue();
            issue.setDescription(e.getMessage());
            issue.setSeverity(Severity.Error);
            issues.add(issue);
        }

        return issues;
    }

}
