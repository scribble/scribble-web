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
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.Response;

import org.scribble.tools.api.Issue;
import org.scribble.tools.api.Projection;
import org.scribble.tools.api.ModuleUtil;
import org.scribble.tools.api.ToolManager;
import org.scribble.tools.api.TraceUtil;

import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import com.wordnik.swagger.annotations.ApiResponse;
import com.wordnik.swagger.annotations.ApiResponses;

/**
 * REST interface for performing actions on scribble protocols.
 *
 * @author gbrown
 *
 */
@Path("/actions")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
@Api(value = "/", description = "Perform actions on scribble modules")
public class ActionsHandler {
    
    @Inject
    private ToolManager toolManager;

    @POST
    @Path("/project/{module}/{role}")
    @ApiOperation(value = "Project a module definition",
            response = Projection.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successfully projected a module"),
            @ApiResponse(code = 500, message = "Failed to project the module") })
    public void projectProtocol(
            @Suspended final AsyncResponse response,
            @ApiParam(value = "The module", required = true) @PathParam("module") String moduleName,
            @ApiParam(value = "The role", required = true) @PathParam("role") String roleName) {

        try {
            Map<String,Projection> result=toolManager.project(ModuleUtil.getPath(moduleName));

            if (result == null || !result.containsKey(roleName)) {
                response.resume(Response.status(Response.Status.NOT_FOUND).build());
            } else {
                response.resume(Response.status(Response.Status.OK).entity(result.get(roleName)).build());
            }

        } catch (Throwable t) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + t.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }
    }

    @POST
    @Path("/verify/{module}")
    @ApiOperation(value = "Verify a module definition",
            response = List.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Verified a module"),
            @ApiResponse(code = 500, message = "Failed to verify the module") })
    public void verifyModule(
            @Suspended final AsyncResponse response,
            @ApiParam(value = "The module name", required = true) @PathParam("module") String moduleName) {

        try {
            List<Issue> result=toolManager.validate(ModuleUtil.getPath(moduleName));

            response.resume(Response.status(Response.Status.OK).entity(result).build());

        } catch (Throwable t) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + t.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }
    }

    @GET
    @Path("/roles/{module}")
    @Produces(APPLICATION_JSON)
    @ApiOperation(
            value = "Retrieve roles for module name",
            response = List.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success, roles found and returned"),
            @ApiResponse(code = 500, message = "Internal server error"),
            @ApiResponse(code = 400, message = "Unknown module name") })
    public void getRoles(@Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module") @PathParam("module") String moduleName) {

        try {
            Map<String,Projection> result=toolManager.project(ModuleUtil.getPath(moduleName));

            List<String> roles=new ArrayList<String>(result.keySet());
            Collections.sort(roles);

            response.resume(Response.status(Response.Status.OK).entity(roles).build());

        } catch (Throwable t) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + t.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }

    }

    @POST
    @Path("/simulate/{module}/{trace}")
    @ApiOperation(value = "Simulate a module's trace definition",
            response = List.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Simulated a trace successfully"),
            @ApiResponse(code = 500, message = "Failed to simulate the module's trace") })
    public void simulateTrace(
            @Suspended final AsyncResponse response,
            @ApiParam(value = "The module name", required = true) @PathParam("module") String moduleName,
            @ApiParam(value = "The trace name", required = true) @PathParam("trace") String traceName) {

        try {
            List<Issue> result=toolManager.simulate(ModuleUtil.getPath(moduleName),
                    TraceUtil.getPath(moduleName, traceName));

            response.resume(Response.status(Response.Status.OK).entity(result).build());

        } catch (Throwable t) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + t.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }
    }

}
