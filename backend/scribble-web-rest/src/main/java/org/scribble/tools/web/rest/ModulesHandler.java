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
import org.scribble.tools.api.ModuleUtil;

import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import com.wordnik.swagger.annotations.ApiResponse;
import com.wordnik.swagger.annotations.ApiResponses;

/**
 * REST interface for managing scribble modules.
 *
 * @author gbrown
 *
 */
@Path("/modules")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
@Api(value = "/", description = "Module management")
public class ModulesHandler {
    
    @Inject
    private ContentManager contentManager;
    
    @PUT
    @Path("/{module}")
    @ApiOperation(
            value = "Create or update a module definition")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Create or update module succeeded."),
            @ApiResponse(code = 500, message = "Unexpected error happened while creating or updating the module") })
    public void updateProtocol(
            @Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module name") @PathParam("module") String moduleName,
            @ApiParam(value = "The module definition", required = true) Content content) {

        try {
            contentManager.setContent(ModuleUtil.getPath(moduleName), content);
            
            response.resume(Response.status(Response.Status.OK).build());

        } catch (Throwable t) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + t.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }
    }

    @DELETE
    @Path("/{module}")
    @ApiOperation(
            value = "Delete a module definition")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Delete module succeeded."),
            @ApiResponse(code = 500, message = "Unexpected error happened while deleting the module") })
    public void deleteModule(
            @Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module name") @PathParam("module") String moduleName) {

        try {
            contentManager.remove(ModuleUtil.getPath(moduleName));
            
            response.resume(Response.status(Response.Status.OK).build());

        } catch (Throwable t) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + t.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }
    }

    @GET
    @Path("/{module}")
    @Produces(APPLICATION_JSON)
    @ApiOperation(
            value = "Retrieve definition for module name",
            response = Content.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success, module definition found and returned"),
            @ApiResponse(code = 500, message = "Internal server error"),
            @ApiResponse(code = 400, message = "Unknown module name") })
    public void getModule(@Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module") @PathParam("module") String moduleName) {

        try {
            Content content = contentManager.getContent(ModuleUtil.getPath(moduleName));

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
    @Path("/")
    @Produces(APPLICATION_JSON)
    @ApiOperation(
            value = "Retrieve the list of modules",
            response = List.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success, modules found and returned"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public void getModules(@Suspended final AsyncResponse response) {

        try {
            List<org.scribble.tools.api.Path> paths=contentManager.getContentPaths(
                    new org.scribble.tools.api.Path("/"));

            List<String> moduleNames=new ArrayList<String>();
            
            for (org.scribble.tools.api.Path path : paths) {
                moduleNames.add(ModuleUtil.getModule(path));
            }
            
            // Sort the list before returning
            Collections.sort(moduleNames);

            response.resume(Response.status(Response.Status.OK).entity(
                    moduleNames).type(APPLICATION_JSON_TYPE).build());
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + e.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }

    }

}
