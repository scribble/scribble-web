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
package org.scribble.tools.web.rest;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON_TYPE;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.Response;

import org.scribble.tools.api.Content;
import org.scribble.tools.api.ContentManager;
import org.scribble.tools.api.TraceUtil;

import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import com.wordnik.swagger.annotations.ApiResponse;
import com.wordnik.swagger.annotations.ApiResponses;

/**
 * REST interface for managing scribble traces.
 *
 * @author gbrown
 *
 */
@Path("/traces")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
@Api(value = "/", description = "Trace management")
public class TracesHandler {

    @Inject
    private ContentManager contentManager;

    @PUT
    @Path("/{module}/{trace}")
    @ApiOperation(
            value = "Create or update a trace definition")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Create or update trace succeeded."),
            @ApiResponse(code = 500, message = "Unexpected error happened while creating or updating the trace") })
    public void updateProtocol(
            @Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module name") @PathParam("module") String moduleName,
            @ApiParam(required = true, value = "The trace name") @PathParam("trace") String traceName,
            @ApiParam(value = "The trace definition", required = true) Content content) {

        try {
            contentManager.setContent(TraceUtil.getPath(moduleName, traceName), content);

            response.resume(Response.status(Response.Status.OK).build());

        } catch (Throwable t) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + t.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }
    }

    @DELETE
    @Path("/{module}/{trace}")
    @ApiOperation(
            value = "Delete a trace definition")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Delete trace succeeded."),
            @ApiResponse(code = 500, message = "Unexpected error happened while deleting the trace") })
    public void deleteModule(
            @Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module name") @PathParam("module") String moduleName,
            @ApiParam(required = true, value = "The trace name") @PathParam("trace") String traceName) {

        try {
            contentManager.remove(TraceUtil.getPath(moduleName, traceName));

            response.resume(Response.status(Response.Status.OK).build());

        } catch (Throwable t) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + t.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }
    }

    @GET
    @Path("/{module}/{trace}")
    @Produces(APPLICATION_JSON)
    @ApiOperation(
            value = "Retrieve definition for module and trace name",
            response = Content.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success, trace definition found and returned"),
            @ApiResponse(code = 500, message = "Internal server error"),
            @ApiResponse(code = 400, message = "Unknown module or trace name") })
    public void getModule(@Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module") @PathParam("module") String moduleName,
            @ApiParam(required = true, value = "The trace name") @PathParam("trace") String traceName) {

        try {
            Content content = contentManager.getContent(TraceUtil.getPath(moduleName, traceName));

            if (content == null) {
                response.resume(Response.status(Response.Status.BAD_REQUEST).type(APPLICATION_JSON_TYPE).build());
            } else {
                response.resume(Response.status(Response.Status.OK).entity(content).type(APPLICATION_JSON_TYPE)
                        .build());
            }
        } catch (Exception e) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + e.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }

    }

    @GET
    @Path("/{module}")
    @Produces(APPLICATION_JSON)
    @ApiOperation(
            value = "Retrieve the list of traces associated with specified module",
            response = List.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success, module's traces found and returned"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public void getModules(@Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module") @PathParam("module") String moduleName) {

        try {
            List<org.scribble.tools.api.Path> paths = contentManager.getContentPaths(TraceUtil.getFolder(moduleName));

            List<String> traceNames = new ArrayList<String>();

            for (org.scribble.tools.api.Path path : paths) {
                if (path.hasExtension(TraceUtil.TRACE_EXTENSION)) {
                    traceNames.add(TraceUtil.getTraceName(path));
                }
            }

            // Sort the list before returning
            Collections.sort(traceNames);

            response.resume(Response.status(Response.Status.OK).entity(
                    traceNames).type(APPLICATION_JSON_TYPE).build());
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + e.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }

    }

}
